<template>
  <footer class="bg-slate-900 text-white py-10 px-6 lg:px-20">
    <div class="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-2xl text-primary">pets</span>
        <span class="text-lg font-bold">DoxieLand</span>
      </div>

      <div class="flex gap-6 text-xs text-slate-500">
        <RouterLink to="/forum" class="hover:text-white transition-colors">Forum</RouterLink>
        <RouterLink to="/reviews" class="hover:text-white transition-colors">Reviews</RouterLink>
        <RouterLink to="/services" class="hover:text-white transition-colors">Services</RouterLink>
        <RouterLink to="/knowledge" class="hover:text-white transition-colors">Knowledge</RouterLink>
        <RouterLink to="/privacy" class="hover:text-white transition-colors">Privacy</RouterLink>
        <RouterLink to="/terms" class="hover:text-white transition-colors">Terms</RouterLink>
      </div>

      <p class="text-slate-500 text-xs">
        &copy; 2026 DoxieLand. All rights reserved.
      </p>
    </div>
  </footer>
</template>