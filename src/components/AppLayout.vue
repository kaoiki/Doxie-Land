<script setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div class="text-slate-900" style="background-color: #f8f6f6;">
    <Header />
    <slot />
    <Footer />
  </div>
</template>