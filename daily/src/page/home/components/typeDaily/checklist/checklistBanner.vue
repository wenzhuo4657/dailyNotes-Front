<script setup lang="ts">

import { addItemByType, getMdByType, updateCheckListStatus, updateCheckListTitle, updateItemByType } from '@/services/request';
import {
  Check,
  Plus
} from '@element-plus/icons-vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ChecklistItem } from '@/type/DailyItem';
import { useI18n } from 'vue-i18n'
import { EventBus, Events } from '@/envBus/envBus'

const { t, locale } = useI18n()

// 展示变量  
const items = ref<ChecklistItem[]>([])
const current = ref<ChecklistItem | null>(null)
const selectedTypeId = ref<number>(1)
const selectedContentNameId = ref<number>(1)



// 所有数据，通过计算属性动态更新
const all=ref<ChecklistItem[]>([])


const finishs = computed(
  ()=>{
    return all.value.filter( item=> item.expand === 'true')
  }
)
const notCompleted=computed(
  ()=>{
    return all.value.filter(item => item.expand === 'false')
  }
)

// 获取远程服务器上的列表
async function fetchContent() {
  const json = await getMdByType({ contentNameId: selectedContentNameId.value ?? 1, type: selectedTypeId.value ?? 1 });
  const list = Array.isArray(json) ? json : json.data;
  if (!Array.isArray(list)) throw new Error('返回不是数组或 data 数组')

  all.value = list.map(({ id, title, content ,expand}) => ({ id, title, content,expand,editing: false   }))
  items.value=all.value
  current.value = items.value[0] ?? null


  
}



// 动态切换items
function changeItems(data){
  if(data==1){
    items.value=all.value
  }
  if(data==2){
    items.value=notCompleted.value
  }
  if(data==3){
    
    items.value=finishs.value
  }



}

// vue组件生命周期：组件挂载完成后执
onMounted(() => {
  try {
    const typeSaved = Number(sessionStorage.getItem('view.typeId'))
    if (!Number.isNaN(typeSaved)) selectedTypeId.value = typeSaved
    const cnSaved = Number(sessionStorage.getItem('view.contentNameId'))
    if (!Number.isNaN(cnSaved)) selectedContentNameId.value = cnSaved
  } catch {}
  fetchContent()
  EventBus.$on(Events.Button_type, onTypeChanged)
  EventBus.$on(Events.Button_contentName, onContentNameChanged)

})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {
  EventBus.$off(Events.Button_type, onTypeChanged)
  EventBus.$off(Events.Button_contentName, onContentNameChanged)

})


 function isSuccess(item:ChecklistItem){
  console.log("改变status")
  updateCheckListStatus(item.id);
}

function addItem(){
  const data={ contentNameId: selectedContentNameId.value ?? 1, type: selectedTypeId.value ?? 1 }
  const res=addItemByType(data);
  fetchContent()
}

function updateContent(item:ChecklistItem){
    let typeId = 1
    try {
      const saved = Number(sessionStorage.getItem('view.typeId'))
      if (!Number.isNaN(saved)) typeId = saved
    } catch {}
    const vo = { id: item.id, type: typeId, content: item.content };
    updateItemByType(vo);
    console.log(item)
}


function updateTitle(item:ChecklistItem){
    type data={id:number,title:String}
    const vo: data = { id: item.id, title: item.title };
    updateCheckListTitle(vo);
}

// 监听来自按钮栏的筛选
function onTypeChanged(payload){
  const id = typeof payload === 'number' ? payload : payload?.id
  if (typeof id === 'number') {
    selectedTypeId.value = id
  }
}
function onContentNameChanged(payload){
  const id = typeof payload === 'number' ? payload : payload?.id
  if (typeof id === 'number') {
    selectedContentNameId.value = id
    fetchContent()
  }
}




</script>


<!--  -->
<!--TODO   搞这种东西总是想要想要时间视图，但真的有必要吗？暂时先不做时间视图 -->
<template>
    <div  class="banner">
        <el-button type="success" :icon="Plus"  @click="addItem" circle />
        <el-button  @click="changeItems(2)">{{t('todo')}}</el-button>
        <el-button  @click="changeItems(3)">{{t('finishs')}}</el-button>

        
    </div>
    <div>
     
        <div v-for="item in items"  class="item-layout">
             <!-- 左侧：标题/输入区域（宽度固定或自适应） -->
      <div   class="item-content" >
        <div>
             <!-- 只读态 -->
        <div
          v-show="!item.editing"
          class=" glass-card"
          @click="item.editing = true"
        >
          {{ item.title || '（点击编辑）' }}
        </div>

        <!-- 编辑态 -->

         <el-input   v-show="item.editing" v-model="item.title"   placeholder="Please input" />
        </div>
      
  
      </div>
        <!-- 右侧：操作按钮 -->
        <div class="item-actions">
        <el-button
          v-if="!item.editing"
          type="success"
          :icon="Check"
          @click="isSuccess(item)"
          circle
        />
        <el-button
          v-else
          @click="item.editing=!item.editing;updateTitle(item)"
        >保存</el-button>
      </div>
    </div>
                 
     

     
   
       
    </div>
</template>

<style>
.banner{
  width: 10%;
  display: flex;
  flex-direction: row;
}
.item-layout{
  display: flex;
  flex-direction: row;


}
.item-content{
  width: 30%;
}

.item-content > div{
  width: 90%;

}

.item-content  > textarea{
  width: 100%;
}

.item-actions{
  width: 5%;
}


/* 毛玻璃样式 */
.glass-card{
  /* 半透明底色，建议用白/黑加透明度 */
  background: rgba(255,255,255,.12);
  /* 让背后的内容模糊、稍微提亮/饱和 */
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%); /* Safari */
  /* 细节边框与投影，增强“玻璃边缘”观感 */
  border: 1px solid rgba(255,255,255,.25);
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  border-radius: 12px;
  padding: 16px;
}

</style>
