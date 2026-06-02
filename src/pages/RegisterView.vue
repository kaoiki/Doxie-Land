<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest } from '../utils/http'

const router = useRouter()
const toast = useToast()

const name = ref('')
const email = ref('')
const code = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const codeSending = ref(false)
const codeSent = ref(false)
const codeCountdown = ref(0)
const errorMsg = ref('')
let countdownTimer: ReturnType<typeof setInterval> | null = null

const passwordType = computed(() => (showPassword.value ? 'text' : 'password'))

function clearCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function startCountdown() {
  codeCountdown.value = 60
  clearCountdown()
  countdownTimer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearCountdown()
    }
  }, 1000)
}

async function sendCode() {
  errorMsg.value = ''

  if (!email.value.trim()) {
    errorMsg.value = 'Please enter your email first.'
    return
  }

  codeSending.value = true

  try {
    await httpRequest('/api/auth/register/send-code', {
      method: 'POST',
      body: { email: email.value.trim() },
      skipLoading: true
    })

    codeSent.value = true
    startCountdown()
    toast.add({
      title: 'Code sent',
      description: 'A 6-digit code has been sent to your email.',
      color: 'success'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send code.'
    errorMsg.value = message
    toast.add({
      title: 'Failed to send code',
      description: message,
      color: 'error'
    })
  } finally {
    codeSending.value = false
  }
}

async function handleRegister() {
  errorMsg.value = ''

  if (!name.value.trim()) {
    errorMsg.value = 'Please enter your name.'
    return
  }
  if (!email.value.trim()) {
    errorMsg.value = 'Please enter your email.'
    return
  }
  if (!code.value.trim()) {
    errorMsg.value = 'Please enter the verification code.'
    return
  }
  if (!password.value) {
    errorMsg.value = 'Please create a password.'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }

  loading.value = true

  try {
    await httpRequest('/api/auth/register', {
      method: 'POST',
      body: {
        email: email.value.trim(),
        code: code.value.trim(),
        password: password.value
      },
      skipLoading: true
    })

    toast.add({
      title: 'Account created!',
      description: 'You can now log in with your credentials.',
      color: 'success'
    })

    await router.push('/login')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed.'
    errorMsg.value = message
    toast.add({
      title: 'Registration failed',
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
            <h1 class="text-3xl font-extrabold text-slate-900">Register</h1>
            <p class="mt-2 text-slate-500">Create your DoxieLand account.</p>
          </div>

          <form class="space-y-5" @submit.prevent="handleRegister">
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
              <label class="mb-2 block text-sm font-medium text-slate-700">Verification Code</label>
              <div class="flex gap-3">
                <UInput
                  v-model="code"
                  type="text"
                  placeholder="6-digit code"
                  size="xl"
                  color="success"
                  variant="outline"
                  class="flex-1"
                  :ui="{
                    base: 'bg-white text-slate-900 placeholder:text-slate-400',
                    trailing: 'pe-1'
                  }"
                >
                  <template #trailing>
                    <UButton
                      v-if="code"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-x"
                      size="sm"
                      @click="code = ''"
                    />
                  </template>
                </UInput>
                <UButton
                  type="button"
                  size="xl"
                  color="success"
                  variant="outline"
                  class="shrink-0 font-bold"
                  :disabled="codeSending || codeCountdown > 0"
                  :loading="codeSending"
                  @click="sendCode"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}s` : 'Send Code' }}
                </UButton>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <UInput
                v-model="password"
                :type="passwordType"
                placeholder="Create a password (min 6 chars)"
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