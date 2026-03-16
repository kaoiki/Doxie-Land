<template>
  <UApp>
    <main class="relative min-h-screen overflow-hidden bg-[#070b14] text-white">
      <!-- Animated colorful background -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="aurora aurora-1"></div>
        <div class="aurora aurora-2"></div>
        <div class="aurora aurora-3"></div>
        <div class="aurora aurora-4"></div>
        <div class="grid-mask"></div>
      </div>

      <!-- Content -->
      <section class="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <!-- Header -->
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold backdrop-blur-md"
            >
              D
            </div>

            <div>
              <p class="text-lg font-semibold tracking-wide">Doxieland</p>
              <p class="text-xs text-white/60">Coming soon for dachshund lovers</p>
            </div>
          </div>

          <UBadge color="primary" variant="soft">
            Coming Soon
          </UBadge>
        </header>

        <!-- Hero -->
        <div class="flex flex-1 items-center">
          <div class="grid w-full items-center gap-14 lg:grid-cols-2">
            <!-- Left -->
            <div>
              <UBadge color="primary" variant="soft" class="mb-6">
                A new community is on the way
              </UBadge>

              <h1
                class="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
              >
                🐕 A warm new home for
                <span class="bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                  every doxie story
                </span>
              </h1>

              <p class="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                Doxieland is a dachshund-first community for sharing daily life,
                building dog profiles, learning better care, and joining a space
                made just for long-bodied little legends.
              </p>

              <div class="mt-8 flex flex-wrap gap-4">
                <UButton size="xl" color="primary">
                  Join Waitlist
                </UButton>

                <UButton size="xl" variant="outline" color="neutral">
                  Explore Preview
                </UButton>
              </div>

              <div class="mt-8 flex flex-wrap gap-3">
                <UBadge color="neutral" variant="subtle">Dog profiles</UBadge>
                <UBadge color="neutral" variant="subtle">Community posts</UBadge>
                <UBadge color="neutral" variant="subtle">Care tips</UBadge>
                <UBadge color="neutral" variant="subtle">Q&amp;A</UBadge>
                <UBadge color="neutral" variant="subtle">Events</UBadge>
              </div>

              <p class="mt-6 text-sm text-white/55">
                Early members will get first access when Doxieland opens.
              </p>
            </div>

            <!-- Right -->
            <div class="relative">
              <div class="absolute -inset-6 rounded-[2rem] bg-white/5 blur-2xl"></div>

              <UCard class="relative border-white/10 bg-white/8 backdrop-blur-xl">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-white/55">Launch preview</p>
                      <h2 class="mt-1 text-xl font-semibold text-white">
                        What’s coming soon
                      </h2>
                    </div>

                    <UBadge color="primary" variant="soft">
                      MVP
                    </UBadge>
                  </div>
                </template>

                <div class="space-y-4">
                  <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p class="text-sm text-white/55">01 · Dog Archive</p>
                    <p class="mt-2 text-base font-medium text-white">
                      Build a simple profile for your dachshund with habits,
                      milestones, health notes and memories.
                    </p>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p class="text-sm text-white/55">02 · Community Feed</p>
                    <p class="mt-2 text-base font-medium text-white">
                      Share daily stories, photos, questions and small moments
                      with other doxie owners.
                    </p>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p class="text-sm text-white/55">03 · Care & Knowledge</p>
                    <p class="mt-2 text-base font-medium text-white">
                      Discover better feeding, back care, routines and
                      dachshund-specific experience.
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature teaser -->
      <section class="relative border-t border-white/10">
        <div class="mx-auto max-w-7xl px-6 py-20">
          <div class="mx-auto max-w-2xl text-center">
            <UBadge color="neutral" variant="subtle" class="mb-4">
              Launch Preview
            </UBadge>

            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
              Small at launch, meaningful from day one
            </h2>

            <p class="mt-4 text-lg text-white/65">
              Doxieland starts as a focused MVP: warm, useful, and built for a
              real doxie-loving community.
            </p>
          </div>

          <div class="mt-12 grid gap-6 md:grid-cols-3">
            <UCard class="border-white/10 bg-white/6 backdrop-blur-md">
              <template #header>
                <UBadge color="primary" variant="subtle">Profiles</UBadge>
              </template>
              <h3 class="text-lg font-semibold text-white">Keep your doxie’s story</h3>
              <p class="mt-3 text-sm leading-6 text-white/65">
                Save milestones, habits, health notes and the small details that matter.
              </p>
            </UCard>

            <UCard class="border-white/10 bg-white/6 backdrop-blur-md">
              <template #header>
                <UBadge color="primary" variant="subtle">Community</UBadge>
              </template>
              <h3 class="text-lg font-semibold text-white">Meet people who get it</h3>
              <p class="mt-3 text-sm leading-6 text-white/65">
                Connect with owners who truly understand dachshund quirks, needs and joy.
              </p>
            </UCard>

            <UCard class="border-white/10 bg-white/6 backdrop-blur-md">
              <template #header>
                <UBadge color="primary" variant="subtle">Knowledge</UBadge>
              </template>
              <h3 class="text-lg font-semibold text-white">Learn better care</h3>
              <p class="mt-3 text-sm leading-6 text-white/65">
                Find practical tips about feeding, training, routines and back protection.
              </p>
            </UCard>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="relative border-t border-white/10">
        <div class="mx-auto max-w-7xl px-6 py-20">
          <div
            class="rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl md:p-12"
          >
            <div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div class="max-w-2xl">
                <UBadge color="primary" variant="soft" class="mb-4">
                  Early Access
                </UBadge>

                <h3 class="text-3xl font-bold tracking-tight text-white">
                  Join the waitlist before launch
                </h3>

                <p class="mt-4 text-lg text-white/70">
                  Be first in line when Doxieland opens. Early members will get
                  launch updates and first access to the community.
                </p>
              </div>

              <div class="flex flex-wrap gap-4">
                <UButton size="xl" color="primary">
                  Join Waitlist
                </UButton>

                <UButton size="xl" variant="outline" color="neutral">
                  Contact Us
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="relative border-t border-white/10">
        <div
          class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between"
        >
          <p>© 2026 Doxieland. A coming soon community for dachshund lovers.</p>

          <div class="flex gap-6">
            <a class="transition hover:text-white">About</a>
            <a class="transition hover:text-white">Waitlist</a>
            <a class="transition hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  </UApp>
</template>

<script setup lang="ts">
</script>

<style scoped>
.aurora {
  position: absolute;
  filter: blur(80px);
  opacity: 0.7;
  mix-blend-mode: screen;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.aurora-1 {
  width: 40rem;
  height: 40rem;
  top: -8rem;
  left: -6rem;
  background: radial-gradient(circle, rgba(255, 95, 109, 0.45) 0%, rgba(255, 95, 109, 0) 70%);
  animation: floatOne 11s infinite;
}

.aurora-2 {
  width: 36rem;
  height: 36rem;
  top: 8rem;
  right: -8rem;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%);
  animation: floatTwo 14s infinite;
}

.aurora-3 {
  width: 34rem;
  height: 34rem;
  bottom: 6rem;
  left: 18%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.38) 0%, rgba(16, 185, 129, 0) 70%);
  animation: floatThree 13s infinite;
}

.aurora-4 {
  width: 42rem;
  height: 42rem;
  bottom: -10rem;
  right: 12%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.32) 0%, rgba(251, 191, 36, 0) 72%);
  animation: floatFour 16s infinite;
}

.grid-mask {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(circle at center, black 35%, transparent 85%);
  -webkit-mask-image: radial-gradient(circle at center, black 35%, transparent 85%);
}

@keyframes floatOne {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(80px, 60px) scale(1.12);
  }
}

@keyframes floatTwo {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(-90px, 70px) scale(1.08);
  }
}

@keyframes floatThree {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(70px, -50px) scale(1.1);
  }
}

@keyframes floatFour {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(-60px, -80px) scale(1.14);
  }
}
</style>