<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
    <div class="flex min-h-[calc(100vh-3rem)] items-center justify-center sm:min-h-[calc(100vh-4rem)]">
      <div class="w-full max-w-md">
        <div class="rounded-3xl border border-green-200 bg-white p-6 shadow-sm sm:p-8">
          <div class="mb-6">
            <RouterLink
              to="/"
              class="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800 hover:underline"
            >
              <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
              Back to Home
            </RouterLink>
          </div>

          <div class="mb-6">
            <h1 class="text-3xl font-extrabold text-slate-900">Forgot Password</h1>
            <p class="mt-2 text-slate-500">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          <form class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <UInput
                v-model="email"
                type="email"
                placeholder="you@example.com"
                size="xl"
                color="success"
                variant="outline"
                :ui="{
                  base: 'bg-white text-slate-900 placeholder:text-slate-400',
                  trailing: 'pe-1'
                }"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    v-if="email"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    size="sm"
                    @click="email = ''"
                  />
                </template>
              </UInput>
            </div>

            <UButton
              type="submit"
              size="xl"
              block
              color="success"
              class="justify-center font-bold"
            >
              Send Reset Link
            </UButton>
          </form>

          <div class="mt-6 text-sm">
            <RouterLink
              to="/login"
              class="font-semibold text-green-700 transition hover:text-green-800 hover:underline"
            >
              Back to Login
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>