<script setup>
import { useI18n } from 'vue-i18n'
import { EventBus, Events } from '@/envBus/envBus'

const { t } = useI18n()

let isPreview = true

function toggleEditorMode() {
  isPreview = !isPreview
  EventBus.$emit(Events.Button_edit, isPreview)
}

</script>

<template>
  <el-button type="success" plain  @click="toggleEditorMode">
    <strong>{{ $t('edit') }}</strong>
  </el-button>
</template>
<style>
</style>
