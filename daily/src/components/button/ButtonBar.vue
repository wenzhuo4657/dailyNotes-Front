<script setup>
import { EventBus, Events } from '@/envBus/envBus';

let isPreview = true; // true 预览状态 false 编辑状态

function toggleEditorMode() {
  isPreview = !isPreview;
  EventBus.$emit(Events.Button_edit, isPreview);
}
</script>

<template>
  <div class="buttonBar">
    <button @click="toggleEditorMode">编辑/预览</button>

    <!-- TODO 这里应当做成服务器中获取，因为后续可能在浏览器端不会获取全部的文档，总不能越存越大吧，后续要实现懒加载 -->
     <!-- 导入： 从文件系统中选一个文件上传  暂定：可能会改成一个zip压缩包 -->
      <!-- 导出： 从服务器中下载一个文件    暂定： 后续可能会改成下载一个zip压缩包 -->
    <button @click="toggleEditorMode">导出</button>
    <button @click="toggleEditorMode">导入</button>

  </div>
</template>

<style>

.buttonBar{
     justify-items: center;
     display: flex;
     gap: 10px; 

}


</style>
