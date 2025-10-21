<script setup lang="ts">

import { addItemByType, getMdByType, updateCheckListStatus, updateCheckListTitle, updateItemByType } from '@/services/markdown';
import {
  Check,
  Plus
} from '@element-plus/icons-vue'
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Item = { id: number; title: string; content: string;expand:string;editing: boolean }
const items = ref<Item[]>([])
const current = ref<Item | null>(null)


// 获取远程服务器上的列表
async function fetchContent() {
  const json = await getMdByType(1,1);
  const list = Array.isArray(json) ? json : json.data;
  if (!Array.isArray(list)) throw new Error('返回不是数组或 data 数组')

  items.value = list.map(({ id, title, content ,expand}) => ({ id, title, content,expand,editing: true   }))
  current.value = items.value[0] ?? null
}



// vue组件生命周期：组件挂载完成后执
onMounted(() => {
  fetchContent()
})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {

})


 function isSuccess(item:Item){
  console.log("改变status")
  updateCheckListStatus(item.id);
}

function addItem(){
  const data={content_name_Id: 1,type: 1}
  const res=addItemByType(data);
  fetchContent()
}

function updateContent(item:Item){
    type data={id:number,content:String}
    const vo: data = { id: item.id, content: item.content };
    updateItemByType(vo,1);
    console.log(item)
}


function updateTitle(item:Item){
    type data={id:number,title:String}
    const vo: data = { id: item.id, title: item.title };
    updateCheckListTitle(vo);
}




</script>
<!-- 暂时不对其进行分类，只是做一个备忘录，记录单独的事宜，同样可以title展示，详细内容记录在content，content不是必须的 -->
 <!--是否完成：可以通过属性变化展示是否已完成， 同时为了避免日后插入时间视图，注意记录创建和完成两个时间点 -->

<!--TODO   搞这种东西总是想要想要时间视图，但真的有必要吗？暂时先不做时间视图 -->
<template>
    <div>
        <el-button type="success" :icon="Plus"  @click="addItem" circle />
        <div v-for="item in items">
            

             <div>
              <!--ui  横向排列，限制高度， -->
      
                <div v-if="item.editing"  >
                  <div @click="item.editing=!item.editing">
                        {{ item.title }}
                  </div>
                 
                   <el-button type="success" :icon="Check"  @click="isSuccess(item)" circle />
      
                  
                </div>
                <div v-else>
                    <textarea v-model="item.title" ></textarea>
                    <el-button @click="item.editing=!item.editing;updateTitle(item)" >确认</el-button>
                </div>
                 
             </div>

     
        </div>
       
    </div>
</template>