<script setup>
import MarkdownEditor from '@/components/Markdown.vue'
import { ref } from 'vue'

const awesome = ref(true)
</script>

<template>
  <div class="any">

    <div>      
        <h1>日程记录</h1>
        <div>
          <!-- todo 按钮栏也要做成一个组件 -->
              <button @click="awesome=!awesome">编辑/预览</button>
        </div>
    </div>
      
        <div  class="banner">
          
          <MarkdownEditor  :awesome="awesome" />
        </div>
        


  </div>


</template>

<style scoped>

.any{
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows:  20vh 80vh;
  background: #f2f2f2;
  justify-items: center;

}
.banner{
  display: block;
  width: 80vw;
  background-color: #ece3e3;
  overflow: auto; 
}
</style>
