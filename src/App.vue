<script setup lang="ts">
import GlobalLoadingBar from './components/common/GlobalLoadingBar.vue'
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <GlobalLoadingBar />
    <RouterView />
  </UApp>
</template>