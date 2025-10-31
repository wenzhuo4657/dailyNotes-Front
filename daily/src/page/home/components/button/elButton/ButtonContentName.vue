<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'
import { getTypesWithItems } from '@/services/request'
import type { ContentNameDto } from '@/type/ContentNameDto'
import { ArrowDown } from '@element-plus/icons-vue'

const STORAGE_TYPE_ID = 'view.typeId'
const STORAGE_CN_ID = 'view.contentNameId'

const items = ref<ContentNameDto[]>([])
const label = ref<string>('选择内容')
const currentTypeId = ref<number | null>(null)

async function loadByTypeId(typeId: number) {
  try {
    const json = await getTypesWithItems(typeId)
    const list = Array.isArray(json) ? json : json?.data
    if (Array.isArray(list)) {
      items.value = list as ContentNameDto[]
      // 重置展示文案
      label.value = '选择内容'
      // 恢复上次内容选择（如果兼容当前类型）
      try {
        const saved = Number(sessionStorage.getItem(STORAGE_CN_ID))
        if (!Number.isNaN(saved)) {
          const target = items.value.find(it => it.id === saved)
          if (target) {
            label.value = target.name
            EventBus.$emit(Events.Button_contentName, { id: target.id, name: target.name })
          }
        }
      } catch {}
    } else {
      items.value = []
    }
  } catch (e) {
    console.error('Failed to load content names:', e)
    items.value = []
  }
}

function onTypeChanged(payload: { id: number; key?: string; name?: string } | number) {
  const typeId = typeof payload === 'number' ? payload : payload?.id
  if (typeof typeId === 'number' && typeId >= 0) {
    currentTypeId.value = typeId
    void loadByTypeId(typeId)
  }
}

function onCommand(cmd: number | string) {
  const idNum = Number(cmd)
  let target = items.value.find(it => it.id === idNum)
  if (!target && typeof cmd === 'string') {
    target = items.value.find(it => it.name === cmd)
  }
  if (target) {
    label.value = target.name
    EventBus.$emit(Events.Button_contentName, { id: target.id, name: target.name })
    try { sessionStorage.setItem(STORAGE_CN_ID, String(target.id)) } catch {}
  }
}

onMounted(() => {
  EventBus.$on(Events.Button_type, onTypeChanged)
  // 首次进入时尝试根据已保存的类型立即加载
  try {
    const savedType = Number(sessionStorage.getItem(STORAGE_TYPE_ID))
    if (!Number.isNaN(savedType)) {
      currentTypeId.value = savedType
      void loadByTypeId(savedType)
    }
  } catch {}
})
onBeforeUnmount(() => {
  EventBus.$off(Events.Button_type, onTypeChanged)
})
</script>

<template>
  <div class="button-content-name">
    <el-dropdown @command="onCommand">
      <el-button type="success" plain>
        {{ label }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="it in items" :key="it.id" :command="it.id">
            {{ it.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.button-content-name { display: flex; }
</style>
