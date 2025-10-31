<script setup lang="ts">
import { EventBus, Events } from '@/envBus/envBus'
import { updateItemByType } from '@/services/request'
import mdView from '@/page/home/components/content/markdownView.vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { UpdateItemDto } from '@/type/requestDto/UpdateItemDto'


const id = defineModel<number | null>('id')
const content = defineModel<string>('content')


const awesome=ref(true)


// vue组件生命周期：组件挂载完成后执
onMounted(() => {
    EventBus.$on(Events.Button_edit,handleEditorToggle)
})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {
    EventBus.$off(Events.Button_edit,handleEditorToggle)

})

const handleEditorToggle = (nextState) => {
  awesome.value = Boolean(nextState)
}

watch(awesome, (newVal, oldVal) => {
  if (oldVal === false && newVal === true) {
    saveContent();
  }
})

const isSaving = ref(false)
async function saveContent() {
  if (isSaving.value) {//防止重复提交
    return
  }

  isSaving.value = true
  try {
    let typeId = 0
    try {
      const saved = Number(sessionStorage.getItem('view.typeId'))
      if (!Number.isNaN(saved)) typeId = saved
    } catch {}
    const data: UpdateItemDto = { id: id.value as number, content: content.value, type: typeId }
    await updateItemByType(data)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>


    <div  class="sqlit">
    <!-- 换行失效 -->
        <div v-if="awesome">
          <md-view v-model="content"></md-view>
        </div>
        <div v-else  class="editor-wrap">
          <el-input
            v-model="content"
            type="textarea"
            :autosize="{ minRows: 16, maxRows: 40 }"
            class="edit_input"
            spellcheck="false"
            placeholder="Please input"
          />
        </div>
            
    </div>


</template>

<style>

.sqlit{
    width:  100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.editor-wrap {
  flex: 1;
  display: flex;
  align-items: stretch;
  width: 100%;
}
.edit_input { width: 100%; }
.edit_input textarea {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  line-height: 1.5;
}


</style>


