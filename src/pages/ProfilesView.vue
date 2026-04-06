<script setup lang="ts">
const records = [
  { date: '2026-04-01', type: 'Weight', value: '5.8 kg' },
  { date: '2026-04-03', type: 'Meal', value: 'Chicken + pumpkin' },
  { date: '2026-04-05', type: 'Walk', value: '32 minutes' }
]
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Dog Profiles</h1>
        <p class="mt-2 text-slate-500">Create a dog profile and keep daily records anytime.</p>
      </div>

      <UButton size="lg" icon="i-lucide-plus">
        New Profile
      </UButton>
    </div>

    <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <img
            src="https://placehold.co/120x120/png"
            alt="Dog avatar"
            class="h-20 w-20 rounded-2xl object-cover"
          />
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Nori</h2>
            <p class="text-slate-500">Mini Dachshund · 3 years old</p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Weight</p>
            <p class="mt-2 text-lg font-bold text-slate-900">5.8 kg</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Diet</p>
            <p class="mt-2 text-lg font-bold text-slate-900">Mixed fresh meal</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Allergy</p>
            <p class="mt-2 text-lg font-bold text-slate-900">None</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Vaccination</p>
            <p class="mt-2 text-lg font-bold text-slate-900">Up to date</p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900">Daily Records</h2>
          <UButton variant="soft" size="sm" icon="i-lucide-file-plus-2">
            Add Record
          </UButton>
        </div>

        <div class="mt-5 space-y-4">
          <div
            v-for="record in records"
            :key="`${record.date}-${record.type}`"
            class="rounded-2xl bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="font-semibold text-slate-900">{{ record.type }}</p>
                <p class="text-sm text-slate-500">{{ record.date }}</p>
              </div>
              <p class="text-sm font-bold text-primary">{{ record.value }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>