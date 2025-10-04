<script setup lang="ts">

import { ref, computed, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

const model = defineModel<string>({ default: '' })

// 解析器
const md = new MarkdownIt()

// 工具：判断是否是 ATX 标题（# 系列）
function isAtxHeadingOpen(t) {
  return t && t.type === 'heading_open' && t.markup && t.markup[0] === '#'
}

// 从 tokens 切出“章节”
// 章节的边界规则：从某个 ATX 标题开始，直到遇到下一个“level <= 当前 level”的 ATX 标题（不含后者）
function buildSectionsFromTokens(src) {
  if (!src) return []
  const tokens = md.parse(src, {})
  const sections = []

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (!isAtxHeadingOpen(t)) continue

    const level = Number(t.tag?.slice(1)) || 0
    const inline = tokens[i + 1]
    const title = inline && inline.type === 'inline' ? (inline.content || '').trim() : ''

    // 寻找本章节的结束位置（下一个 <= 当前 level 的 ATX 标题的 "open" 之前）
    let j = i + 1
    for (; j < tokens.length; j++) {
      const tk = tokens[j]
      if (isAtxHeadingOpen(tk)) {
        const nextLevel = Number(tk.tag?.slice(1)) || 0
        if (nextLevel <= level) break
      }
    }

    // 取 [i, j) 这段 token 重新渲染为 HTML
    const slice = tokens.slice(i, j)
    const html = md.renderer.render(slice, md.options, {})

    sections.push({
      title,
      level,            // 1..6
      start: i,         // token 起点（可用于调试）
      end: j,           // token 终点（不包含）
      html: DOMPurify.sanitize(html)
    })

    // 跳过已消费的片段
    i = j - 1
  }

  return sections
}

// 计算：目录 + 章节
const sections = computed(() => buildSectionsFromTokens(model.value))

// 当前选择的章节索引
const selected = ref(0)

// 当文档变更时，保证 selected 不越界
watch(sections, (arr) => {
  if (!arr.length) selected.value = 0
  else if (selected.value >= arr.length) selected.value = 0
})

// 右侧展示的 HTML
const renderedSection = computed(() => {
  const s = sections.value[selected.value]
  return s ? s.html : ''
})
</script>

<template>
  <div class="view">
    <aside class="toc">
      <ul>
        <li
          v-for="(s, i) in sections"
          :key="s.start"
          class="toc-item"
          :style="{ paddingLeft: (s.level - 1) * 12 + 'px' }"
        >
          <button
            class="toc-btn"
            :class="{ active: i === selected }"
            @click="selected = i"
            type="button"
            title="查看此章节"
          >
            {{ s.title || ('(无标题 H' + s.level + ')') }}
          </button>
        </li>
      </ul>
    </aside>

    <main class="content" v-html="renderedSection"></main>
  </div>
</template>

<style scoped>
.view {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 12px;
  min-height: 60vh;
}

.toc {
  padding: 8px;
  border-right: 1px solid #eee;
  overflow: auto;
}

.toc-item {
  list-style: none;
  margin: 4px 0;
}

.toc-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  width: 100%;
  text-align: left;
  border-radius: 6px;
}

.toc-btn:hover {
  background: #f5f5f5;
}

.toc-btn.active {
  background: #e9f2ff;
}

.content :deep(pre) {
  background: #f7f7f9;
  padding: 10px;
  overflow: auto;
}
</style>

