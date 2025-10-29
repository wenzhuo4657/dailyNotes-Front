<script setup lang="ts">
import { EventBus, Events } from '@/envBus/envBus';
import { DownLoadFile, upload } from '@/services/request';
import { ref } from 'vue';

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()


const toggle = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('locale', locale.value) // 持久化
}

let isPreview = true;
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const progress = ref(0);

function toggleEditorMode() {
  isPreview = !isPreview;
  EventBus.$emit(Events.Button_edit, isPreview);
}

let isViewSelect=false;
function viewSelect() {
  isViewSelect = !isViewSelect;
  EventBus.$emit(Events.Button_view, isViewSelect);
}



function onClickImport() {
  fileInput.value?.click();
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;



  const fd = new FormData();

  fd.append('file', file, file.name);

  try {
    uploading.value = true;
    progress.value = 0;

    await upload(fd)

  } finally {
    uploading.value = false;
    input.value = ''; // 允许再次选择同名文件触发 change
  }
}

</script>

<template>
  <div class="buttonBar">
    <!-- <button  @click="addItem">新增</button> -->
    <button @click="toggleEditorMode">{{t('edit')}}</button>
    <button   @click="viewSelect">{{t('view')}}</button>
    <button @click="toggle">{{ $t('switch') }}</button>
    <!-- ui优化 -->
     <!-- 1， 默认的滑动栏太丑了 -->

    <!-- TODO 懒加载 -->
     <!-- 目前的预览和编辑都不会等待md文档接口返回，这是非常致命的缺陷 -->


<!-- 按钮布局优化，   -->
 <!--  常用： 编辑/预览、文档类型选择、文档选择  -->
   <!-- 不常用 ： 导入、导出 -->
    <!-- 考虑做一个边栏，用于选择、改变视图状态， -->

    <button @click="DownLoadFile">{{t('export')}}</button>
    <button @click="onClickImport" :disabled="uploading">{{t('import')}}</button>


    <!-- 隐藏的文件选择框 -->
      <input
    ref="fileInput"
    type="file"
    style="display: none;"
    accept=".db"  
    @change="onFileChange"
  />

  </div>
</template>

<style>

.buttonBar{
     justify-items: center;
     display: flex;
     gap: 10px; 

}


</style>
