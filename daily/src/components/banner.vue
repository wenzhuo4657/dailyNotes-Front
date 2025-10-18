<script setup lang="ts">
import dailyBanner from '@/components/typeDaily/daily/dailyBanner.vue'
import checklistBanner from '@/components/typeDaily/checklist/checklistBanner.vue';
import { ref } from 'vue';


const viewList = ['daily', 'Checklist'] as const;
const awesome=ref(false)



const current = ref("daily"); // 控制显示哪个
const compMap = {
  daily: dailyBanner,
  checklist: checklistBanner,
} as const;
</script>
<template>
    <div v-if="awesome" class="select">
      <el-radio v-model="current" :label="viewList[0]">{{  viewList[0]}}</el-radio>
      <el-radio v-model="current" :label="viewList[1]">{{  viewList[1]}}</el-radio>

      <br></br>
      <strong>当前选择： {{ current }}</strong>
    </div>
   
    <div v-else class="banner  banner-size">
          <component :is="compMap[current]" />
    </div>




   

</template>

<style>
.select{

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
