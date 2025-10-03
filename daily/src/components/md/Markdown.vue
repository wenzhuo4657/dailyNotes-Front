<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

import 'highlight.js/styles/github.css'
import { getMarkdown, saveMarkdown } from "@/services/markdown";
import mdEdit from "@/components/md/MarkdownEdit.vue";
import mdView from "@/components/md/MarkdownView.vue";
import { EventBus, Events } from '@/envBus/envBus'

const awesome = ref(true)
const text = ref('')
const isSaving = ref(false)

const handleEditorToggle = (nextState) => {
  awesome.value = Boolean(nextState)
}


// 获取远程服务器上的md文档
async function fetchContent() {
  text.value = await getMarkdown();
}

// 修改远程服务器上的md文档
async function saveContent() {
  if (isSaving.value) {//防止重复提交
    return
  }

  isSaving.value = true
  try {
    await saveMarkdown(text.value);
  } finally {
    isSaving.value = false
  }
}

// vue组件生命周期：组件挂载完成后执
onMounted(() => {
  EventBus.$on(Events.Button_edit, handleEditorToggle)
  fetchContent()
})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {
  EventBus.$off(Events.Button_edit, handleEditorToggle)
})

watch(awesome, (newVal, oldVal) => {
  if (oldVal === false && newVal === true) {
    saveContent();
  }
})
</script>

<template>
  <div class="split">

    <div v-if="awesome" class="split-preview">
      <md-view  class="split-preview__content" v-model="text"  ></md-view>
    
    </div>
    <div v-else class="split-edit">
      <md-edit class="split-editor" v-model="text" />
    </div>
  </div>
</template>

<style scoped>
.split {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.split > div {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.split-preview__content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
  box-sizing: border-box;
}

.split-preview {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.split-edit {
  flex: 1;
  min-height: 0;
  display: flex;
}

.split-editor {
  flex: 1;
  min-height: 0;
  display: flex;
}

.split-editor :deep(.editor) {
  flex: 1;
  display: flex;
}

.split-editor :deep(.editor__textarea) {
  flex: 1;
  min-height: 0;
}
</style>
