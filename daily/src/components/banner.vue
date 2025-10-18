<script setup lang="ts">
import dailyBanner from '@/components/typeDaily/daily/dailyBanner.vue'
import checklistBanner from '@/components/typeDaily/checklist/checklistBanner.vue';
import { ref } from 'vue';




type ViewKey = 'daily' | 'Checklist' ;

const current = ref<ViewKey>('daily'); // 控制显示哪个
const compMap = {
  daily: dailyBanner,
  checklist: checklistBanner,
} as const;
</script>

<!-- TODO 文档类型，多文档引入，该组件用于选择不同视图类型 -->
<template>
    <div class="banner  banner-size">
             <component :is="compMap[current]" />
    </div>




   

</template>

<style>
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