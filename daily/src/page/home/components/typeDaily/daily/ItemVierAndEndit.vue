<script setup lang="ts">
import { EventBus, Events } from '@/envBus/envBus'
import { updateItem } from '@/services/request'
import mdView from '@/page/home/components/content/markdownView.vue'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'


const id = defineModel<number | null>('id')
const content = defineModel<string>('content')


const awesome=ref(true)


// vue组件生命周期：组件挂载完成后执
onMounted(() => {
    EventBus.$on(Events.Button_edit,handleEditorToggle)
})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {
    EventBus.$off(Events.Button_edit,handleEditorToggle)

})

const handleEditorToggle = (nextState) => {
  awesome.value = Boolean(nextState)
}

watch(awesome, (newVal, oldVal) => {
  if (oldVal === false && newVal === true) {
    saveContent();
  }
})

const isSaving = ref(false)
async function saveContent() {
  if (isSaving.value) {//防止重复提交
    return
  }

  isSaving.value = true
  try {
    type Item={id:number,content:String}
    const data: Item = { id: id.value, content: content.value };
    await updateItem(data);
  } finally {
    isSaving.value = false
  }
}
</script>

<template>


    <div  class="sqlit">
    <!-- 换行失效 -->
        <div v-if="awesome">
          <md-view v-model="content"></md-view>
        </div>
        <div v-else  class="editor-wrap">
            <textarea v-model="content"   class="edit_sqlit"></textarea>
        </div>
            
    </div>


</template>

<style>

.sqlit{
    width:  100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.editor-wrap {
  flex: 1;           
  display: flex;
}
.edit_sqlit{
    display: block;
    width: 80%;
    height: 80%;
    flex: 1;           
    resize: none
}


</style>


