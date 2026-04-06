<script setup lang="ts">
const suggestions = [
  'My dog refuses to eat after travel. What should I check first?',
  'How can I build a healthier walking routine for a dachshund?',
  'What toys are safer for aggressive chewers?'
]
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">AI Care Assistant</h1>
        <p class="mt-2 text-slate-500">Ask daily care questions and get AI guidance for your dog routine.</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          <span class="material-symbols-outlined text-[18px] text-primary">smart_toy</span>
          <span>Model</span>
          <span class="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
            DeepSeek
          </span>
        </div>

        <div class="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span>Status</span>
          <span class="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-red-700">
            Offline
          </span>
        </div>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <aside class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">Suggested Questions</h2>

        <div class="mt-4 space-y-3">
          <button
            v-for="item in suggestions"
            :key="item"
            class="w-full rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-primary/10 hover:text-primary"
          >
            {{ item }}
          </button>
        </div>
      </aside>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="space-y-4">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">User</p>
            <p class="mt-2 text-slate-700">How do I know whether my dog is just picky or actually sick?</p>
          </div>

          <div class="rounded-2xl bg-primary/5 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">AI Reply</p>
            <p class="mt-2 text-slate-700">
              Start by checking appetite duration, water intake, stool quality, energy level, vomiting, and fever signs.
              If the change is sudden or lasts more than a day, you should contact a vet.
            </p>
          </div>

          <UTextarea placeholder="Ask something about your dog..." :rows="6" />
          <UButton block size="lg" icon="i-lucide-sparkles">
            Ask AI
          </UButton>
        </div>
      </section>
    </div>
  </main>
</template>