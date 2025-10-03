<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import slugify from '@sindresorhus/slugify'
import DOMPurify from 'dompurify'



const model = defineModel<string>({ default: '# 你好' })


// md渲染器
const md = new MarkdownIt()



// 响应式计算 md文档内容
const rendered = computed(() => {

  const raw = md.render(model.value)
  return DOMPurify.sanitize(raw)
  
})

//计算属性：从 tokens 中抽取 TOC（标题文本、层级、id）
const TocItem = ref()
const tocItems = computed(() => {
  const src = model.value || ''
  if (!src) return []

  const tokens = md.parse(src, {}) // 不渲染，只拿语法树


  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    console.log(t)
  }
  return tokens
})

</script>

<template>
  <div class="view">
    {{ tocItems }}
     <div class="split-preview__content" v-html="rendered"></div>
  </div>
</template>

<style scoped>






</style>
