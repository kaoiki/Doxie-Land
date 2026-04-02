<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navItems = [
  { label: 'Home', href: '#', active: true },
  { label: 'Daily Logs', href: '#', active: false },
  { label: 'Shop', href: '#', active: false },
  { label: 'Services', href: '#', active: false },
  { label: 'Community', href: '#', active: false }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-solid border-primary/10 bg-white backdrop-blur-md"
  >
    <div class="flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-20">
      <div class="flex items-center gap-12">
        <div class="flex items-center gap-3 text-primary">
          <span
            class="material-symbols-outlined text-4xl"
            style="font-variation-settings: 'FILL' 1"
          >
            pets
          </span>
          <h2 class="text-slate-900 text-xl font-extrabold leading-tight tracking-tight">
            Doxie Life
          </h2>
        </div>

        <nav class="hidden md:flex items-center gap-8">
          <a
            v-for="item in navItems"
            :key="item.label"
            :href="item.href"
            :class="[
              'text-sm font-semibold transition-colors',
              item.active
                ? 'text-primary'
                : 'text-slate-700 hover:text-primary'
            ]"
          >
            {{ item.label }}
          </a>
        </nav>
      </div>

      <div class="flex flex-1 justify-end gap-4 items-center">
        <label class="hidden sm:flex flex-col min-w-40 h-10 max-w-64">
          <div class="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
            <div class="text-slate-400 flex bg-slate-100 items-center justify-center pl-3">
              <span class="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              class="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 focus:ring-0 h-full placeholder:text-slate-400 px-3 text-sm font-normal"
              placeholder="Search boutique..."
            />
          </div>
        </label>

        <div class="relative group hidden md:block">
          <button
            class="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <span class="material-symbols-outlined">person</span>
          </button>

          <div
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <a
              class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors"
              href="#"
            >
              <span class="material-symbols-outlined text-xl">settings</span>
              <span class="font-medium">Settings</span>
            </a>

            <a
              class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors"
              href="#"
            >
              <span class="material-symbols-outlined text-xl">logout</span>
              <span class="font-medium">Logout</span>
            </a>
          </div>
        </div>

        <button
          class="hidden md:flex items-center justify-center rounded-lg h-10 w-10 bg-primary text-white hover:bg-primary/90 transition-all"
        >
          <span class="material-symbols-outlined">shopping_bag</span>
        </button>

        <button
          class="flex md:hidden items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
          type="button"
          @click="toggleMobileMenu"
        >
          <span class="material-symbols-outlined">
            {{ mobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-primary/10 bg-white px-6 pb-4"
    >
      <nav class="flex flex-col gap-2 pt-4">
        <a
          v-for="item in navItems"
          :key="item.label"
          :href="item.href"
          :class="[
            'rounded-lg px-4 py-3 text-sm font-semibold transition-colors',
            item.active
              ? 'bg-primary text-white'
              : 'text-slate-700 hover:bg-primary/10 hover:text-primary'
          ]"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="flex items-center gap-3 pt-4">
        <button
          class="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary transition-all"
        >
          <span class="material-symbols-outlined">person</span>
        </button>

        <button
          class="flex items-center justify-center rounded-lg h-10 w-10 bg-primary text-white hover:bg-primary/90 transition-all"
        >
          <span class="material-symbols-outlined">shopping_bag</span>
        </button>
      </div>
    </div>
  </header>
</template>