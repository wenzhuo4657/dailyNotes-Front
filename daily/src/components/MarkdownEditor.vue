<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps<{ awesome: boolean }>()

const text = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const saveMessage = ref('')
const saveError = ref('')
const loadError = ref('')

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


// 响应式变量： md文档内容
const rendered = computed(() => {
  const rawHtml = md.render(text.value)
  return DOMPurify.sanitize(rawHtml)
})


// 读取远程服务器上的md文档
async function fetchContent() {
  isLoading.value = true
  loadError.value = ''

  try {
    const response = await fetch('/api/markdown')
    if (!response.ok) {
      throw new Error('Fetch failed')
    }
    const data: unknown = await response.json()

    if (typeof (data as { content?: unknown }).content !== 'string') {
      throw new Error('Invalid response shape')
    }

    text.value = (data as { content: string }).content
  } catch (error) {
    console.error(error)
    loadError.value = '读取 Markdown 文件失败'
  } finally {
    isLoading.value = false
  }
}


// 修改远程服务器上的md文档
async function saveContent() {
  if (isSaving.value) {
    return
  }

  saveError.value = ''
  saveMessage.value = ''
  isSaving.value = true

  try {
    const response = await fetch('/api/markdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text.value }),
    })

    if (!response.ok) {
      throw new Error('Save failed')
    }

    const data: unknown = await response.json()
    if (!(data as { ok?: unknown }).ok) {
      throw new Error('Save failed')
    }

    saveMessage.value = '保存成功'
    window.setTimeout(() => {
      saveMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error(error)
    saveError.value = '保存失败，请重试'
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchContent)


// 监听控制变量，实现自动更新
watch(
  () => props.awesome,
  (isPreview) => {
    if (!isPreview) {
      fetchContent()
    }
  }
)
</script>

<template>
  <div class="split">
    <div class="preview" v-if="awesome">
      <div v-if="loadError" class="status status--error">
        {{ loadError }}
      </div>
      <div v-else v-html="rendered"></div>
    </div>
    <div class="editor" v-else>
      <div class="editor__toolbar">
        <button @click="saveContent" :disabled="isSaving || isLoading">
          {{ isSaving ? '保存中...' : '保存' }}
        </button>
        <span v-if="saveMessage" class="status status--success">{{ saveMessage }}</span>
        <span v-if="saveError" class="status status--error">{{ saveError }}</span>
        <span v-if="isLoading" class="status">读取中...</span>
      </div>
      <textarea
        v-model="text"
        :disabled="isSaving || isLoading"
        spellcheck="false"
      ></textarea>
      <div v-if="loadError" class="status status--error">
        {{ loadError }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  height: 100%;
}

@media (min-width: 960px) {
  .split {
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
}

.preview,
.editor {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  overflow: auto;
}

.editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.editor__toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.editor__toolbar button {
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.editor__toolbar button:disabled {
  cursor: not-allowed;
  background: #94a3b8;
}

.editor__toolbar button:not(:disabled):hover {
  background: #1d4ed8;
}

textarea {
  flex: 1;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #d4d4d8;
  padding: 1rem;
  resize: vertical;
  min-height: 360px;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  line-height: 1.6;
  background: #f8fafc;
}

textarea:disabled {
  background: #e2e8f0;
}

.status {
  font-size: 0.875rem;
  color: #64748b;
}

.status--success {
  color: #15803d;
}

.status--error {
  color: #dc2626;
}
</style>
