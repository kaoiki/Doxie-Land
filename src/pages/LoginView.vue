<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest, setToken } from '../utils/http'

const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))

async function handleLogin() {
  errorMsg.value = ''

  if (!email.value.trim()) {
    errorMsg.value = 'Please enter your email.'
    return
  }
  if (!password.value) {
    errorMsg.value = 'Please enter your password.'
    return
  }

  loading.value = true

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: {
        user_id: string
        email: string
        nickname: string
        avatar: string
        token: string
        expires_at: string
      }
    }>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value.trim(),
        password: password.value
      },
      skipLoading: true
    })

    const data = res.data
    setToken(data.token)
    localStorage.setItem('doxie_uid', data.user_id)
    localStorage.setItem('doxie_nickname', data.nickname)
    localStorage.setItem('doxie_avatar', data.avatar)
    localStorage.setItem('doxie_email', data.email)

    toast.add({
      title: 'Welcome back!',
      description: 'You have logged in successfully.',
      color: 'success'
    })

    await router.push('/')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed. Please try again.'
    errorMsg.value = message
    toast.add({
      title: 'Login failed',
      description: message,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
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
            <h1 class="text-3xl font-extrabold text-slate-900">Login</h1>
            <p class="mt-2 text-slate-500">Welcome back to DoxieLand.</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleLogin">
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
                placeholder="Enter your password"
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

            <p v-if="errorMsg" class="text-sm font-semibold text-rose-500">
              {{ errorMsg }}
            </p>

            <UButton
              type="submit"
              size="xl"
              block
              color="success"
              class="justify-center font-bold"
              :loading="loading"
            >
              Sign In
            </UButton>
          </form>

          <div class="mt-6 flex items-center justify-between gap-4 text-sm">
            <RouterLink
              to="/register"
              class="font-semibold text-green-700 transition hover:text-green-800 hover:underline"
            >
              Create an account
            </RouterLink>

            <RouterLink
              to="/forgot"
              class="font-semibold text-green-700 transition hover:text-green-800 hover:underline"
            >
              Forgot?
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>