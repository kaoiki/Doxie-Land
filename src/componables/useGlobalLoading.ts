import { computed, ref } from 'vue'

const loadingCount = ref(0)

function startLoading() {
  loadingCount.value += 1
}

function endLoading() {
  if (loadingCount.value > 0) {
    loadingCount.value -= 1
  }
}

function resetLoading() {
  loadingCount.value = 0
}

const isGlobalLoading = computed(() => loadingCount.value > 0)

export function useGlobalLoading() {
  return {
    isGlobalLoading,
    startLoading,
    endLoading,
    resetLoading
  }
}