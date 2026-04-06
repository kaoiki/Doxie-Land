<script setup lang="ts">
const articles = [
  {
    id: 1,
    title: 'Dachshund Back Care Basics',
    desc: 'A starter guide to protecting the spine during daily life.'
  },
  {
    id: 2,
    title: 'Puppy Vaccination Timeline',
    desc: 'A simple knowledge card for early-stage health management.'
  },
  {
    id: 3,
    title: 'Food Allergies and Warning Signs',
    desc: 'Common triggers, observations, and what to record.'
  }
]
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Knowledge Base</h1>
        <p class="mt-2 text-slate-500">Collect care guides, feeding notes, and common health references.</p>
      </div>

      <div class="w-full sm:w-80">
        <UInput icon="i-lucide-search" placeholder="Search articles..." size="lg" />
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="article in articles"
        :key="article.id"
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 class="text-lg font-bold text-slate-900">{{ article.title }}</h2>
        <p class="mt-3 text-slate-600">{{ article.desc }}</p>
        <UButton class="mt-5" variant="soft" size="sm">
          Read More
        </UButton>
      </article>
    </div>
  </main>
</template>