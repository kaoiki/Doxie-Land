<template>
  <footer class="bg-slate-900 text-white py-16 px-6 lg:px-20">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <div class="space-y-6">
        <div class="flex items-center gap-3 text-primary">
          <span class="material-symbols-outlined text-3xl">pets</span>
          <h2 class="text-white text-xl font-bold">Doxie Life</h2>
        </div>

        <p class="text-slate-400 text-sm">
          The world's premium destination for dachshund enthusiasts. Join our pack today.
        </p>

        <div class="flex gap-4">
          <a class="text-slate-400 hover:text-white transition-colors" href="#">
            <span class="material-symbols-outlined">language</span>
          </a>
          <a class="text-slate-400 hover:text-white transition-colors" href="#">
            <span class="material-symbols-outlined">mail</span>
          </a>
          <a class="text-slate-400 hover:text-white transition-colors" href="#">
            <span class="material-symbols-outlined">share</span>
          </a>
        </div>
      </div>

      <div>
        <h4 class="font-bold mb-6">Shop</h4>
        <ul class="space-y-4 text-slate-400 text-sm">
          <li><a class="hover:text-primary transition-colors" href="#">Sweaters &amp; Coats</a></li>
          <li><a class="hover:text-primary transition-colors" href="#">Beds &amp; Ramps</a></li>
          <li><a class="hover:text-primary transition-colors" href="#">Healthy Treats</a></li>
          <li><a class="hover:text-primary transition-colors" href="#">Accessories</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">Community</h4>
        <ul class="space-y-4 text-slate-400 text-sm">
          <li><a class="hover:text-primary transition-colors" href="#">Daily Logs</a></li>
          <li><a class="hover:text-primary transition-colors" href="#">Find Playdates</a></li>
          <li><a class="hover:text-primary transition-colors" href="#">Member Stories</a></li>
          <li><a class="hover:text-primary transition-colors" href="#">Discussion Board</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold mb-6">Join our Newsletter</h4>
        <p class="text-slate-400 text-sm mb-4">
          Get weekly tips and boutique updates delivered to your inbox.
        </p>
        <div class="flex gap-2">
          <input
            class="bg-slate-800 border-none rounded-lg px-4 py-2 flex-grow text-sm focus:ring-1 focus:ring-primary"
            placeholder="Email address"
            type="email"
          />
          <button class="bg-primary px-4 py-2 rounded-lg font-bold">Join</button>
        </div>
      </div>
    </div>

    <div
      class="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs"
    >
      <p>© 2024 Doxie Life Media Group. All rights reserved.</p>

      <div class="flex gap-8">
        <a class="hover:text-white transition-colors" href="#">Privacy Policy</a>
        <a class="hover:text-white transition-colors" href="#">Terms of Service</a>
        <a class="hover:text-white transition-colors" href="#">Shipping &amp; Returns</a>
      </div>
    </div>
  </footer>
</template>