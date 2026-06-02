<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest } from '../utils/http'

const router = useRouter()
const toast = useToast()

const email = ref('')
const code = ref('')
const newPassword = ref('')
const showPassword = ref(false)
const step = ref<'email' | 'reset'>('email')

const loading = ref(false)
const codeSending = ref(false)
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
    errorMsg.value = 'Please enter your email.'
    return
  }

  codeSending.value = true

  try {
    await httpRequest('/api/auth/password/send-code', {
      method: 'POST',
      body: { email: email.value.trim() },
      skipLoading: true
    })

    startCountdown()
    step.value = 'reset'
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

async function resetPassword() {
  errorMsg.value = ''

  if (!code.value.trim()) {
    errorMsg.value = 'Please enter the verification code.'
    return
  }
  if (!newPassword.value) {
    errorMsg.value = 'Please enter a new password.'
    return
  }
  if (newPassword.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }

  loading.value = true

  try {
    await httpRequest('/api/auth/password/reset', {
      method: 'POST',
      body: {
        email: email.value.trim(),
        code: code.value.trim(),
        new_password: newPassword.value
      },
      skipLoading: true
    })

    toast.add({
      title: 'Password reset',
      description: 'Your password has been updated. You can now log in.',
      color: 'success'
    })

    await router.push('/login')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reset password.'
    errorMsg.value = message
    toast.add({
      title: 'Reset failed',
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
            <h1 class="text-3xl font-extrabold text-slate-900">Forgot Password</h1>
            <p v-if="step === 'email'" class="mt-2 text-slate-500">
              Enter your email and we'll send you a verification code.
            </p>
            <p v-else class="mt-2 text-slate-500">
              A code was sent to <strong class="text-slate-700">{{ email }}</strong>. Enter it below to reset your password.
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="step === 'email' ? sendCode() : resetPassword()">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <UInput
                v-model="email"
                type="email"
                placeholder="you@example.com"
                size="xl"
                color="success"
                variant="outline"
                :disabled="step === 'reset'"
                :ui="{
                  base: 'bg-white text-slate-900 placeholder:text-slate-400',
                  trailing: 'pe-1'
                }"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    v-if="email && step === 'email'"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-x"
                    size="sm"
                    @click="email = ''"
                  />
                </template>
              </UInput>
            </div>

            <template v-if="step === 'reset'">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">Verification Code</label>
                <UInput
                  v-model="code"
                  type="text"
                  placeholder="6-digit code"
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
                      v-if="code"
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-x"
                      size="sm"
                      @click="code = ''"
                    />
                  </template>
                </UInput>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700">New Password</label>
                <UInput
                  v-model="newPassword"
                  :type="passwordType"
                  placeholder="At least 6 characters"
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
                        v-if="newPassword"
                        color="neutral"
                        variant="ghost"
                        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        size="sm"
                        @click="showPassword = !showPassword"
                      />
                      <UButton
                        v-if="newPassword"
                        color="neutral"
                        variant="ghost"
                        icon="i-lucide-x"
                        size="sm"
                        @click="newPassword = ''"
                      />
                    </div>
                  </template>
                </UInput>
              </div>

              <div class="flex gap-3">
                <UButton
                  type="button"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  :disabled="codeSending || codeCountdown > 0"
                  :loading="codeSending"
                  @click="sendCode"
                >
                  {{ codeCountdown > 0 ? `Resend (${codeCountdown}s)` : 'Resend Code' }}
                </UButton>
              </div>
            </template>

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
              {{ step === 'email' ? 'Send Code' : 'Reset Password' }}
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
