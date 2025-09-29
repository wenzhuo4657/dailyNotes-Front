<script setup>
import MarkdownEditor from '@/components/md/Markdown.vue'
import { ref } from 'vue'

const awesome = ref(true)
</script>

<template>
  <div class="any">

    <div>      
        <h1>日程记录</h1>
        <div>
          <!-- TODO 按钮栏也要做成一个组件 -->
           <!--  问题  组件之间如何通信？目前的通信都是父子之间进行数据绑定？一个父亲两个兄弟能否正确进行状态变化？-->
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
  background: rgb(222, 215, 171);
  justify-items: center;

}
.banner{
  display: block;
  width: 80vw;
  overflow: auto; 
}
</style>
