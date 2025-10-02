<script setup>
import MarkdownEditor from '@/components/md/Markdown.vue'
import ButtonBar from './components/button/ButtonBar.vue'
import { ref } from 'vue'

const awesome = ref(true)
</script>

<template>
  <div class="any">

    <div  class="bar">      
        <h1>日程记录</h1>
        <div>
          <ButtonBar></ButtonBar>
     
        </div>
    </div>
      
        <div  class="banner">
          
          <MarkdownEditor  :awesome="awesome" />
        </div>
        


  </div>


</template>

<style scoped>
.bar{
  justify-items: center;
  display: grid;
  grid-template-rows:  10vh 10vh;
}

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
