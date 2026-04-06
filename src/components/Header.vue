<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const loginStatus = ref(false)

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Forum', to: '/forum' },
  { label: 'Shop', to: '/shop' },
  { label: 'AI Care', to: '/ai-care' },
  { label: 'Knowledge', to: '/knowledge' },
  { label: 'Profiles', to: '/profiles' }
]

const readLoginStatus = () => {
  loginStatus.value = localStorage.getItem('doxie_loginstatu') === 'true'
}

const isActive = (path: string) => {
  return route.path === path
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const accountItems = computed(() => {
  if (loginStatus.value) {
    return [
      [
        {
          label: 'Logout',
          icon: 'i-lucide-log-out',
          click: async () => {
            localStorage.removeItem('doxie_loginstatu')
            loginStatus.value = false
            await router.push('/')
          }
        }
      ]
    ]
  }

  return [
    [
      {
        label: 'Login',
        icon: 'i-lucide-log-in',
        to: '/login'
      },
      {
        label: 'Register',
        icon: 'i-lucide-user-plus',
        to: '/register'
      }
    ]
  ]
})

const handleLogout = async () => {
  localStorage.removeItem('doxie_loginstatu')
  loginStatus.value = false
  closeMobileMenu()
  await router.push('/')
}

onMounted(() => {
  readLoginStatus()
  window.addEventListener('storage', readLoginStatus)
})

defineExpose({
  readLoginStatus
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3" @click="closeMobileMenu">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <span class="material-symbols-outlined text-[24px] leading-none text-primary">pets</span>
        </div>

        <div class="leading-tight">
          <div class="text-lg font-extrabold tracking-tight text-slate-900">DoxieLand</div>
          <div class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Life &amp; Care</div>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-8 md:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="text-sm font-semibold transition-colors"
          :class="isActive(item.to) ? 'text-primary' : 'text-slate-700 hover:text-primary'"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <UDropdownMenu
          :items="accountItems"
          :content="{
            align: 'end',
            side: 'bottom',
            sideOffset: 14
          }"
          :ui="{
            content: 'z-[120] w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-0 outline-none',
            item: 'rounded-xl text-slate-700 data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary'
          }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            class="group flex h-11 w-11 items-center justify-center rounded-full p-0 ring-1 ring-slate-200 hover:bg-transparent hover:ring-primary/40 active:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent"
            :ui="{
              base: 'bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent'
            }"
          >
            <img
              v-if="loginStatus"
              src="https://placehold.co/80x80/png"
              alt="User avatar"
              class="h-9 w-9 rounded-full object-cover"
            />
            <span
              v-else
              class="material-symbols-outlined text-[24px] leading-none text-slate-700 transition-colors group-hover:text-primary"
            >
              account_circle
            </span>
          </UButton>
        </UDropdownMenu>
      </div>

      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-primary/30 hover:text-primary md:hidden"
        @click="toggleMobileMenu"
      >
        <span class="material-symbols-outlined text-[26px]">
          {{ isMobileMenuOpen ? 'close' : 'menu' }}
        </span>
      </button>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="border-t border-slate-200 bg-white px-4 py-4 md:hidden"
    >
      <nav class="flex flex-col gap-2">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
          :class="isActive(item.to) ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="mt-4 border-t border-slate-100 pt-4">
        <div class="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Account
        </div>

        <div class="flex flex-col gap-2">
          <RouterLink
            v-if="!loginStatus"
            to="/login"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined text-[20px]">login</span>
            <span>Login</span>
          </RouterLink>

          <RouterLink
            v-if="!loginStatus"
            to="/register"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary"
            @click="closeMobileMenu"
          >
            <span class="material-symbols-outlined text-[20px]">person_add</span>
            <span>Register</span>
          </RouterLink>

          <button
            v-if="loginStatus"
            type="button"
            class="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>