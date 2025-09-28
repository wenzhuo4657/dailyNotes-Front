<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ text?: string }>()
const emit = defineEmits<{ (event: 'update:text', value: string): void }>()

const localText = ref(props.text ?? '')

watch(
  () => props.text,
  (val) => {
    const next = val ?? ''
    if (next !== localText.value) {
      localText.value = next
    }
  }
)

function handleInput(event: Event) {
  const value = (event.target as HTMLTextAreaElement).value
  localText.value = value
  emit('update:text', value)
}
</script>

<template>
  <div class="editor">
    <textarea
      class="editor__textarea"
      :value="localText"
      @input="handleInput"
      spellcheck="false"
      placeholder="Write your Markdown here..."
    />
  </div>
</template>

<style scoped>
.editor {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.editor__textarea {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  resize: none;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  background-color: #1e1e1e;
  color: #f5f5f5;
  box-sizing: border-box;
  overflow: auto;
}

.editor__textarea:focus {
  outline: none;
}
</style>
