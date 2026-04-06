<script setup lang="ts">
import { computed, ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))
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
            <h1 class="text-3xl font-extrabold text-slate-900">Register</h1>
            <p class="mt-2 text-slate-500">Create your DoxieLand account.</p>
          </div>

          <form class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <UInput
                v-model="name"
                type="text"
                placeholder="Your name"
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
                    v-if="name"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    size="sm"
                    @click="name = ''"
                  />
                </template>
              </UInput>
            </div>

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

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <UInput
                v-model="password"
                :type="passwordType"
                placeholder="Create a password"
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
                  <div class="flex items-center gap-1">
                    <UButton
                      v-if="password"
                      color="neutral"
                      variant="ghost"
                      :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      size="sm"
                      @click="showPassword = !showPassword"
                    />
                    <UButton
                      v-if="password"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-x"
                      size="sm"
                      @click="password = ''"
                    />
                  </div>
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
              Create Account
            </UButton>
          </form>

          <div class="mt-6 text-sm">
            <RouterLink
              to="/login"
              class="font-semibold text-green-700 transition hover:text-green-800 hover:underline"
            >
              Already have an account? Login
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>