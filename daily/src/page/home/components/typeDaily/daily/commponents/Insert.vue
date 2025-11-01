<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { addItemByType } from '@/services/request';
import { EventBus, Events } from '@/envBus/envBus'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const { t } = useI18n()

const selectedTypeId = ref<number>(0)
const selectedContentNameId = ref<number>(0)

function onTypeChanged(payload){
  const id = typeof payload === 'number' ? payload : payload?.id
  if (typeof id === 'number') {
    selectedTypeId.value = id
  }
}
function onContentNameChanged(payload){
  const id = typeof payload === 'number' ? payload : payload?.id
  if (typeof id === 'number') {
    selectedContentNameId.value = id
  }
}

onMounted(() => {
  // 恢复会话选择
  try {
    const typeSaved = Number(sessionStorage.getItem('view.typeId'))
    if (!Number.isNaN(typeSaved)) selectedTypeId.value = typeSaved
    const cnSaved = Number(sessionStorage.getItem('view.contentNameId'))
    if (!Number.isNaN(cnSaved)) selectedContentNameId.value = cnSaved
  } catch {}
  EventBus.$on(Events.Button_type, onTypeChanged)
  EventBus.$on(Events.Button_contentName, onContentNameChanged)
})
onBeforeUnmount(() => {
  EventBus.$off(Events.Button_type, onTypeChanged)
  EventBus.$off(Events.Button_contentName, onContentNameChanged)
})

async function InsertItem(){
  const payload = { contentNameId: selectedContentNameId.value ?? 0, type: selectedTypeId.value ?? 0 }
  const res = await addItemByType(payload)
  if(res===true){
    alert('新增成功/或已存在，请手动刷新。')
  }
}

</script>

<template>
  <el-button type="success" plain  @click="InsertItem">
    <strong>新增</strong>
  </el-button>
</template>
<style>
</style>
