<script setup lang="ts">
import { useGlobalLoading } from '../../componables/useGlobalLoading'

const { isGlobalLoading } = useGlobalLoading()
</script>

<template>
  <div
    v-if="isGlobalLoading"
    class="pointer-events-none fixed inset-x-0 top-0 z-[200]"
  >
    <UProgress
      :model-value="null"
      animation="carousel"
      size="sm"
    />
  </div>
</template>