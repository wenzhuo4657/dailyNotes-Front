<script setup lang="ts">
import dailyBanner from '@/page/home/components/typeDaily/daily/dailyBanner.vue'
import checklistBanner from '@/page/home/components/typeDaily/checklist/checklistBanner.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { EventBus, Events } from '@/envBus/envBus';

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

//  TODO 索引名称需要前后端约定
const STORAGE_KEY = 'view.current'


// vue组件生命周期：组件挂载完成后执
onMounted(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved && saved in compMap) {
        // @ts-ignore
        current.value = saved
      }
    } catch {}
    EventBus.$on(Events.Button_view,handleEditorToggle)
})
// vue组件生命周期：在组件实例被卸载之前调用
onBeforeUnmount(() => {
    EventBus.$off(Events.Button_view,handleEditorToggle)

})

const handleEditorToggle = (nextState) => {
  current.value = nextState
  try { sessionStorage.setItem(STORAGE_KEY, String(current.value)) } catch {}
}


const current = ref("dailyBase"); // 控制显示哪个
const compMap = {
  dailyBase: dailyBanner,
  checklist: checklistBanner,
} as const;
</script>
<template>
  <div class="all banner  banner-size">
   
   
    <div  class="">
          <component :is="compMap[current]" />
    </div>
  </div>





   

</template>

<style>
.all{
  display: flex;
  flex-direction: column

}

.banner{
  background-image: var(--cdn-url);  

  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
}

.banner-size{

  display: block;
  width: 100%;
  height: 100%;
  overflow: auto; 
}


</style>
