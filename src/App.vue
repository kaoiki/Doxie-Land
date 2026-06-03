<script setup lang="ts">
import GlobalLoadingBar from './components/common/GlobalLoadingBar.vue'
import CookieConsent from './components/CookieConsent.vue'
</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <GlobalLoadingBar />
    <RouterView />
    <CookieConsent />
  </UApp>
</template>