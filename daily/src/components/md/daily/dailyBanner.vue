<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

import 'highlight.js/styles/github.css'
import {  getMd,addItem } from "@/services/markdown";
import { EventBus, Events } from '@/envBus/envBus'
import ItemVierAndEndit from '@/components/md/daily/ItemVierAndEndit.vue';



type Item = { id: number; title: string; content: string }
const items = ref<Item[]>([])
const current = ref<Item | null>(null)






// 获取远程服务器上的md文档
async function fetchContent() {
  const json = await getMd();
  const list = Array.isArray(json) ? json : json.data;
  if (!Array.isArray(list)) throw new Error('返回不是数组或 data 数组')

  items.value = list.map(({ id, title, content }) => ({ id, title, content }))
  current.value = items.value[0] ?? null
}



// vue组件生命周期：组件挂载完成后执
onMounted(() => {
  fetchContent()
})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {

})


function chooseContent(it){
  current.value=it
  
}

async function InsertItem(){
  type Item ={content_name_Id:number}
  const data:Item={content_name_Id:0}
  const res=await addItem(data);
  if(res==true){
    alert("当前文档的当日Item已添加/已存在，请手动刷新！！")
  }

}


</script>

<template>
  <div class="split">
   <div class="split_title">
      <button 
          @click="InsertItem"
          class="button-reset">
        新增</button>
      <button
        v-for="it in items"
        :key="it.id"
        @click="chooseContent(it)"
        class="button-reset "
      >
        <strong>{{ it.title }}</strong>
      </button>
    </div>
    <div   class="split_content">
      <div v-if="current"  class="editor-wrap">
        <item-vier-and-endit  v-model:id="current.id"  v-model:content="current.content"></item-vier-and-endit>
      </div>
      <div v-else>
        <em>加载中...</em>
      </div>
    </div>
   
  </div>
</template>

<style scoped>
.split {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;

}

.split_title{
  width: 20%;
   height: 100%;
   display: flex;        
  flex-direction: column; 
  gap: 8px;
  padding-right: 5%;
  overflow: auto; 
}
.split_title > div{
  display: flex;
  flex-direction: row;
}

.split_content {
  display: flex;
  width: 75%;
  height: 100%;

}


.editor-wrap {
  flex: 1;           
}










</style>
