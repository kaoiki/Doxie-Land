<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest, getToken } from '../utils/http'

const router = useRouter()
const toast = useToast()

const nickname = ref(localStorage.getItem('doxie_nickname') || '')
const email = ref(localStorage.getItem('doxie_email') || '')
const avatar = ref(localStorage.getItem('doxie_avatar') || '')

const newNickname = ref('')
const nicknameLoading = ref(false)
const nicknameError = ref('')

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)

const userAvatar = computed(() => {
  const a = avatar.value
  if (!a || a.includes('default.webp') || a.includes('placehold.co')) return ''
  return a
})

onMounted(() => {
  if (!getToken()) {
    router.push('/login')
    return
  }
  newNickname.value = nickname.value
})

async function updateNickname() {
  nicknameError.value = ''
  if (!newNickname.value.trim()) {
    nicknameError.value = 'Nickname cannot be empty.'
    return
  }

  nicknameLoading.value = true
  try {
    const res = await httpRequest<{ code: number; data: { nickname: string } }>('/api/auth/profile', {
      method: 'PUT',
      body: { nickname: newNickname.value.trim() },
      skipLoading: true
    })

    const updated = res.data?.nickname || newNickname.value.trim()
    nickname.value = updated
    localStorage.setItem('doxie_nickname', updated)

    toast.add({ title: 'Nickname updated', description: 'Your nickname has been changed.', color: 'success' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to update nickname.'
    nicknameError.value = msg
    toast.add({ title: 'Update failed', description: msg, color: 'error' })
  } finally {
    nicknameLoading.value = false
  }
}

async function updatePassword() {
  passwordError.value = ''
  passwordSuccess.value = false

  if (!oldPassword.value) {
    passwordError.value = 'Please enter your current password.'
    return
  }
  if (!newPassword.value) {
    passwordError.value = 'Please enter a new password.'
    return
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'New password must be at least 6 characters.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match.'
    return
  }

  passwordLoading.value = true
  try {
    await httpRequest('/api/auth/password', {
      method: 'PUT',
      body: {
        old_password: oldPassword.value,
        new_password: newPassword.value
      },
      skipLoading: true
    })

    passwordSuccess.value = true
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    toast.add({ title: 'Password updated', description: 'Your password has been changed.', color: 'success' })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to update password.'
    passwordError.value = msg
    toast.add({ title: 'Update failed', description: msg, color: 'error' })
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-slate-900">Settings</h1>
      <p class="mt-2 text-slate-500">Manage your account settings.</p>
    </div>

    <!-- Profile summary -->
    <section class="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center gap-5 px-6 py-6">
        <div v-if="userAvatar" class="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white shadow-sm">
          <img :src="userAvatar" alt="avatar" class="h-full w-full object-cover" />
        </div>
        <div v-else class="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
          <UIcon name="i-lucide-paw-print" class="h-8 w-8" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">{{ nickname || 'Doxie Member' }}</h2>
          <p class="text-sm text-slate-500">{{ email }}</p>
        </div>
      </div>
    </section>

    <!-- Nickname -->
    <section class="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4">
        <h2 class="text-lg font-black text-slate-900">Nickname</h2>
        <p class="mt-0.5 text-sm text-slate-500">This is how others see you.</p>
      </div>
      <div class="px-6 py-5">
        <div class="flex gap-3">
          <input
            v-model="newNickname"
            type="text"
            placeholder="Your nickname"
            class="flex-1 rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
          <UButton
            icon="i-lucide-save"
            :loading="nicknameLoading"
            @click="updateNickname"
          >
            Save
          </UButton>
        </div>
        <p v-if="nicknameError" class="mt-2 text-sm font-semibold text-rose-500">{{ nicknameError }}</p>
      </div>
    </section>

    <!-- Password -->
    <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4">
        <h2 class="text-lg font-black text-slate-900">Password</h2>
        <p class="mt-0.5 text-sm text-slate-500">Update your password. Must be at least 6 characters.</p>
      </div>
      <div class="px-6 py-5">
        <div v-if="passwordSuccess" class="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          Password updated successfully.
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Current Password</label>
            <input
              v-model="oldPassword"
              type="password"
              placeholder="Enter current password"
              class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">New Password</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="At least 6 characters"
              class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Confirm New Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <p v-if="passwordError" class="text-sm font-semibold text-rose-500">{{ passwordError }}</p>

          <UButton
            icon="i-lucide-save"
            :loading="passwordLoading"
            @click="updatePassword"
          >
            Update Password
          </UButton>
        </div>
      </div>
    </section>
  </main>
</template>
