<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { getMarkdown, saveMarkdown } from "@/services/markdown";
import mdEdit from "@/components/md/MarkdownEdit.vue";
import { EventBus, Events } from '@/envBus/envBus'

const awesome = ref(true)
const text = ref('')
const isSaving = ref(false)

const handleEditorToggle = (nextState) => {
  awesome.value = Boolean(nextState)
}

// md渲染器
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const { value } = hljs.highlight(code, { language: lang })
        return `<pre><code class="hljs language-${lang}">${value}</code></pre>`
      } catch {
        /* keep default escaping below */
      }
    }
    const escaped = md.utils.escapeHtml(code)
    return `<pre><code class="hljs">${escaped}</code></pre>`
  }
})

// 响应式计算 md文档内容
const rendered = computed(() => {

  const rawHtml = md.render(text.value)
  return DOMPurify.sanitize(rawHtml)
})

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
      <div class="split-preview__content" v-html="rendered"></div>
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
