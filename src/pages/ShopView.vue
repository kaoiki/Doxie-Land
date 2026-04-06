<script setup lang="ts">
const products = [
  {
    id: 1,
    name: 'Cooling Summer Vest',
    tag: 'Cross-border Group Buy',
    score: '4.8',
    summary: 'Breathable fabric, light fit, good for warm weather walks.'
  },
  {
    id: 2,
    name: 'Portable Paw Cleaner',
    tag: 'Popular Pick',
    score: '4.6',
    summary: 'Easy cleanup after rain and park trips.'
  },
  {
    id: 3,
    name: 'Orthopedic Mini Bed',
    tag: 'Buy Together',
    score: '4.9',
    summary: 'Comfortable for older dogs and long nap hours.'
  }
]
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Dog Gear Reviews</h1>
        <p class="mt-2 text-slate-500">Review dog products and organize cross-border group buying.</p>
      </div>

      <div class="flex gap-3">
        <UButton variant="soft" icon="i-lucide-star">
          Write Review
        </UButton>
        <UButton icon="i-lucide-shopping-cart">
          Start Group Buy
        </UButton>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="product in products"
        :key="product.id"
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900">{{ product.name }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ product.tag }}</p>
          </div>

          <div class="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            {{ product.score }}
          </div>
        </div>

        <p class="text-slate-700">{{ product.summary }}</p>

        <div class="mt-5 flex gap-3">
          <UButton size="sm" variant="soft">Read Reviews</UButton>
          <UButton size="sm" variant="ghost">Join Buy</UButton>
        </div>
      </div>
    </div>
  </main>
</template>