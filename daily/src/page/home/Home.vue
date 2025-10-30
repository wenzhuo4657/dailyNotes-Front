<script setup>
import ButtonBar from '@/page/home/components/button/ButtonBar.vue'
import Banner from '@/page/home/components/banner.vue'

</script>

<template>
  <div class="any">
    <div class="bar">
      <ButtonBar />
    </div>
    <div class="banner">
      <Banner />
    </div>
  </div>

</template>

<style scoped>
.any {
  width: 100vw;
  height: 100vh;
  display: flex;
  grid-template-columns: 20% 80%;
  background: rgb(222, 215, 171);
}
.banner {
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>

