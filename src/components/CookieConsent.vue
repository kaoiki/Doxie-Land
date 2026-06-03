<script setup lang="ts">
import { onMounted, ref } from 'vue'

const COOKIE_KEY = 'doxie_cookie_consent'
const visible = ref(false)

function accept() {
  localStorage.setItem(COOKIE_KEY, 'accepted')
  visible.value = false
}

onMounted(() => {
  if (localStorage.getItem(COOKIE_KEY) !== 'accepted') {
    visible.value = true
  }
})
</script>

<template>
  <div
    v-if="visible"
    class="fixed bottom-0 left-0 right-0 z-[400] border-t border-slate-200 bg-white/95 backdrop-blur shadow-[0_-4px_20px_rgba(15,23,42,0.08)]"
  >
    <div class="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="text-sm leading-6 text-slate-600">
        <p>
          We use essential cookies to keep you logged in and provide a smooth experience.
          <RouterLink to="/privacy" class="font-semibold text-blue-700 underline hover:text-blue-800">Learn more</RouterLink>
          about how we handle your data.
        </p>
      </div>
      <div class="flex shrink-0 gap-3">
        <UButton color="primary" @click="accept">Accept</UButton>
      </div>
    </div>
  </div>
</template>
