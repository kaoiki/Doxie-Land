<script setup lang="ts">
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="text-slate-900" style="background-color: #f8f6f6;">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>