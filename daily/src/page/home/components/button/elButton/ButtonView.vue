<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EventBus, Events } from '@/envBus/envBus'
import { getAllTypes } from '@/services/request'
import type { TypeDto } from '@/type/TypeDto'
import { ArrowDown } from '@element-plus/icons-vue'

const STORAGE_TYPE_ID = 'view.typeId'

const types = ref<TypeDto[]>([])

async function fetchTypes() {
  try {
    const json = await getAllTypes()
    const list = Array.isArray(json) ? json : json?.data
    if (Array.isArray(list)) {
      types.value = list as TypeDto[]
      // 恢复上次类型选择（仅广播类型，视图由 banner 自行恢复）
      try {
        const saved = Number(sessionStorage.getItem(STORAGE_TYPE_ID))
        if (!Number.isNaN(saved)) {
          const t = types.value.find(x => x.id === saved)
          if (t) {
            const name = String(t?.name ?? '').toLowerCase()
            const viewMap: Record<string, string> = { dailybase: 'dailyBase', checklist: 'checklist' }
            const key = viewMap[name] || 'dailyBase'
            EventBus.$emit(Events.Button_type, { id: t.id, key, name: t.name })
          }
        }
      } catch {}
    }
  } catch (err) {
    console.error('Failed to load types:', err)
  }
}

function emitViewByType(t: TypeDto) {
  const name = String(t?.name ?? '').toLowerCase()
  const viewMap: Record<string, string> = {
    dailybase: 'dailyBase',
    checklist: 'checklist',
  }
  const key = viewMap[name] || 'dailyBase'
  EventBus.$emit(Events.Button_view, key)
  EventBus.$emit(Events.Button_type, { id: t.id, key, name: t.name })
  try { sessionStorage.setItem(STORAGE_TYPE_ID, String(t.id)) } catch {}
}

function onCommand(cmd: number | string) {
  let target: TypeDto | undefined
  const idNum = Number(cmd)
  if (!Number.isNaN(idNum)) {
    target = types.value.find(t => t.id === idNum)
  }
  if (!target && typeof cmd === 'string') {
    target = types.value.find(t => t.name === cmd)
  }
  if (target) {
    emitViewByType(target)
  }
}

onMounted(fetchTypes)
</script>

<template>
  <div class="button-view">
    <el-dropdown @command="onCommand">
      <el-button type="success" plain>
        {{ $t('view') }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="it in types"
            :key="it.id"
            :command="it.id"
          >
            {{ it.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  
</template>

<style scoped>
.button-view { display: flex; }
</style>
