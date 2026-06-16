<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest, getToken, clearToken } from '../utils/http'

const ADMIN_UID = 'f1ce03a5-4aa5-4531-b096-5798c25cc332'

const router = useRouter()
const toast = useToast()

const isAdmin = computed(() => {
  return localStorage.getItem('doxie_uid') === ADMIN_UID
})

// Profile
const nickname = ref('')
const email = ref('')
const avatar = ref('')
const bio = ref('')
const profileLoading = ref(true)

// Edit nickname + bio
const newNickname = ref('')
const newBio = ref('')
const profileSaving = ref(false)
const profileError = ref('')

// Password
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)

// Delete account
const showDeleteConfirm = ref(false)
const deletePassword = ref('')
const deleteLoading = ref(false)
const deleteError = ref('')

const userAvatar = computed(() => {
  const a = avatar.value
  if (!a || a.includes('default.webp') || a.includes('placehold.co')) return ''
  return a
})

async function fetchProfile() {
  profileLoading.value = true
  try {
    const res = await httpRequest<{ code: number; data: { nickname: string; avatar: string; bio: string | null } }>('/api/profile')
    const d = res.data
    nickname.value = d.nickname || ''
    avatar.value = d.avatar || ''
    bio.value = d.bio || ''
    newNickname.value = d.nickname || ''
    newBio.value = d.bio || ''
    // Sync localStorage
    if (d.nickname) localStorage.setItem('doxie_nickname', d.nickname)
    if (d.avatar) localStorage.setItem('doxie_avatar', d.avatar)
  } catch {
    // Fallback to localStorage
    nickname.value = localStorage.getItem('doxie_nickname') || ''
    email.value = localStorage.getItem('doxie_email') || ''
    avatar.value = localStorage.getItem('doxie_avatar') || ''
    newNickname.value = nickname.value
  } finally {
    profileLoading.value = false
  }
}

async function saveProfile() {
  profileError.value = ''
  if (!newNickname.value.trim()) {
    profileError.value = 'Nickname cannot be empty.'
    return
  }

  profileSaving.value = true
  try {
    const res = await httpRequest<{ code: number; data: { nickname: string; bio: string | null } }>('/api/profile', {
      method: 'PUT',
      body: { nickname: newNickname.value.trim(), bio: newBio.value.trim() },
      skipLoading: true
    })
    nickname.value = res.data.nickname
    bio.value = res.data.bio || ''
    localStorage.setItem('doxie_nickname', res.data.nickname)
    toast.add({ title: 'Profile updated', description: 'Your profile has been saved.', color: 'success' })
  } catch (e) {
    profileError.value = e instanceof Error ? e.message : 'Failed to update profile.'
    toast.add({ title: 'Update failed', description: profileError.value, color: 'error' })
  } finally {
    profileSaving.value = false
  }
}

async function updatePassword() {
  passwordError.value = ''
  passwordSuccess.value = false

  if (!currentPassword.value) { passwordError.value = 'Please enter your current password.'; return }
  if (!newPassword.value) { passwordError.value = 'Please enter a new password.'; return }
  if (newPassword.value.length < 8) { passwordError.value = 'New password must be at least 8 characters.'; return }
  if (newPassword.value !== confirmPassword.value) { passwordError.value = 'Passwords do not match.'; return }

  passwordLoading.value = true
  try {
    await httpRequest('/api/auth/password/change', {
      method: 'PUT',
      body: { current_password: currentPassword.value, new_password: newPassword.value },
      skipLoading: true
    })
    passwordSuccess.value = true
    currentPassword.value = ''; newPassword.value = ''; confirmPassword.value = ''
    toast.add({ title: 'Password updated', description: 'Your password has been changed.', color: 'success' })
  } catch (e) {
    passwordError.value = e instanceof Error ? e.message : 'Failed to update password.'
    toast.add({ title: 'Update failed', description: passwordError.value, color: 'error' })
  } finally {
    passwordLoading.value = false
  }
}

function openDeleteConfirm() { showDeleteConfirm.value = true; deletePassword.value = ''; deleteError.value = '' }
function closeDeleteConfirm() { showDeleteConfirm.value = false; deletePassword.value = ''; deleteError.value = '' }

async function deleteAccount() {
  deleteError.value = ''
  if (!deletePassword.value) { deleteError.value = 'Please enter your password to confirm.'; return }

  deleteLoading.value = true
  try {
    await httpRequest('/api/account', {
      method: 'DELETE',
      body: { password: deletePassword.value },
      skipLoading: true
    })
    clearToken()
    localStorage.clear()
    toast.add({ title: 'Account deleted', description: 'Your account has been deactivated.', color: 'success' })
    await router.push('/')
  } catch (e) {
    deleteError.value = e instanceof Error ? e.message : 'Failed to delete account.'
    toast.add({ title: 'Failed', description: deleteError.value, color: 'error' })
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  if (!getToken()) { router.push('/login'); return }
  email.value = localStorage.getItem('doxie_email') || ''
  fetchProfile()
})
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

    <!-- Profile (Nickname + Bio) -->
    <section class="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4">
        <h2 class="text-lg font-black text-slate-900">Profile</h2>
        <p class="mt-0.5 text-sm text-slate-500">Your nickname and bio are visible to others.</p>
      </div>
      <div class="px-6 py-5 space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-bold text-slate-700">Nickname</label>
          <input v-model="newNickname" type="text" placeholder="Your nickname" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-bold text-slate-700">Bio</label>
          <textarea v-model="newBio" rows="3" placeholder="Tell others a little about yourself..." class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
        </div>
        <p v-if="profileError" class="text-sm font-semibold text-rose-500">{{ profileError }}</p>
        <div class="flex justify-end">
          <UButton icon="i-lucide-save" :loading="profileSaving" @click="saveProfile">Save</UButton>
        </div>
      </div>
    </section>

    <!-- Manage Articles (admin only) -->
    <section v-if="isAdmin" class="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center justify-between px-6 py-5">
        <div>
          <h2 class="text-lg font-black text-slate-900">Knowledge Base</h2>
          <p class="mt-0.5 text-sm text-slate-500">Only administrators can submit or edit articles.</p>
        </div>
        <RouterLink to="/admin/knowledge">
          <UButton icon="i-lucide-book-open">Manage Articles</UButton>
        </RouterLink>
      </div>
    </section>

    <!-- Password -->
    <section class="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4">
        <h2 class="text-lg font-black text-slate-900">Password</h2>
        <p class="mt-0.5 text-sm text-slate-500">Update your password. Must be at least 8 characters.</p>
      </div>
      <div class="px-6 py-5">
        <div v-if="passwordSuccess" class="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">Password updated successfully.</div>
        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Current Password</label>
            <input v-model="currentPassword" type="password" placeholder="Enter current password" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">New Password</label>
            <input v-model="newPassword" type="password" placeholder="At least 8 characters" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Confirm New Password</label>
            <input v-model="confirmPassword" type="password" placeholder="Re-enter new password" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <p v-if="passwordError" class="text-sm font-semibold text-rose-500">{{ passwordError }}</p>
          <UButton icon="i-lucide-save" :loading="passwordLoading" @click="updatePassword">Update Password</UButton>
        </div>
      </div>
    </section>

    <!-- Delete Account -->
    <section class="overflow-hidden rounded-[28px] border border-red-200 bg-white shadow-sm">
      <div class="border-b border-red-100 px-6 py-4">
        <h2 class="text-lg font-black text-red-700">Danger Zone</h2>
        <p class="mt-0.5 text-sm text-slate-500">Once you delete your account, it cannot be recovered.</p>
      </div>
      <div class="px-6 py-5">
        <UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="openDeleteConfirm">Delete Account</UButton>
      </div>
    </section>

    <!-- Delete confirm modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      <div class="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.25)] sm:p-7">
        <div class="text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <UIcon name="i-lucide-alert-triangle" class="h-7 w-7 text-red-600" />
          </div>
          <h2 class="mt-4 text-2xl font-black text-slate-900">Delete Account</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">This action is irreversible. Enter your password to confirm.</p>
        </div>
        <div class="mt-5">
          <input v-model="deletePassword" type="password" placeholder="Enter your password" class="w-full rounded-2xl border border-red-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100" />
          <p v-if="deleteError" class="mt-2 text-sm font-semibold text-rose-500">{{ deleteError }}</p>
        </div>
        <div class="mt-6 flex justify-center gap-3">
          <UButton color="neutral" variant="soft" :disabled="deleteLoading" @click="closeDeleteConfirm">Cancel</UButton>
          <UButton color="error" icon="i-lucide-trash-2" :loading="deleteLoading" @click="deleteAccount">Delete My Account</UButton>
        </div>
      </div>
    </div>
  </main>
</template>
