<script setup lang="ts">
import { ref, watch } from 'vue'

const model = defineModel<string>({ default: '' })



</script>

<template>
  <div class="editor">
    <textarea
      class="editor__textarea"
      v-model="model"
      spellcheck="false"
      placeholder="今天什么都没干吗？"
    />
  </div>
</template>

<style scoped>


.editor__textarea{
  background-color: rgb(224, 223, 223);
  border: none;

}



</style>
