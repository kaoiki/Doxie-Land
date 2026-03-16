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

      <!-- Main -->
      <section class="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        <!-- Header -->
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold backdrop-blur-md"
            >
              <UIcon name="i-mdi-paw" class="text-xl" />
            </div>

            <div>
              <p class="text-lg font-semibold tracking-wide">Doxieland</p>
              <p class="text-xs text-white/60">A new dachshund community is coming soon</p>
            </div>
          </div>

          <UBadge color="primary" variant="soft">
            Coming Soon
          </UBadge>
        </header>

        <!-- Hero -->
        <div class="flex flex-1 items-center justify-center">
          <div class="w-full max-w-5xl">
            <div class="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <!-- Left -->
              <div>
                <UBadge color="primary" variant="soft" class="mb-5">
                  Launching Soon
                </UBadge>

                <h1
                  class="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                >
                  🐕 A warm little world for
                  <span class="bg-linear-to-r from-amber-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                    dachshund lovers
                  </span>
                </h1>

                <p class="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                  Doxieland is on the way — a cozy community for sharing daily doxie life,
                  building dog profiles, learning better care, and meeting people who truly get it.
                </p>

                <div class="mt-6 flex flex-wrap gap-3">
                  <UBadge color="neutral" variant="subtle">Dog profiles</UBadge>
                  <UBadge color="neutral" variant="subtle">Community posts</UBadge>
                  <UBadge color="neutral" variant="subtle">Care tips</UBadge>
                  <UBadge color="neutral" variant="subtle">Q&amp;A</UBadge>
                  <UBadge color="neutral" variant="subtle">Events</UBadge>
                </div>

                <p class="mt-5 text-sm text-white/55">
                  Early members will get first access when Doxieland opens.
                </p>
              </div>

              <!-- Right -->
              <div class="relative">
                <div class="absolute -inset-4 rounded-4xl bg-white/5 blur-2xl"></div>

                <UCard class="relative border-white/10 bg-white/8 backdrop-blur-xl">
                  <div class="space-y-5">
                    <div>
                      <p class="text-sm text-white/55">Waitlist</p>
                      <h2 class="mt-1 text-2xl font-semibold text-white">
                        Join before launch
                      </h2>
                      <p class="mt-3 text-sm leading-6 text-white/65">
                        Get launch updates and be among the first to enter the community.
                      </p>
                    </div>

                    <div class="space-y-3">
                      <UInput
                        v-model="email"
                        size="xl"
                        type="email"
                        placeholder="Enter your email"
                        class="w-full"
                      />

                      <UButton
                        block
                        size="xl"
                        color="primary"
                        :loading="loading"
                        @click="joinWaitlist"
                      >
                        Join Waitlist
                      </UButton>
                    </div>

                    <p v-if="message" class="text-sm text-white/70">
                      {{ message }}
                    </p>

                    <div class="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <p class="text-sm text-white/55">Coming soon</p>
                      <p class="mt-2 text-sm leading-6 text-white/75">
                        Profiles, community posts, care knowledge, and a warm place built
                        just for doxies and the people who love them.
                      </p>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer
          class="flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/55 md:flex-row md:items-center md:justify-between"
        >
          <p>© 2026 Doxieland. Coming soon for dachshund lovers.</p>

          <div class="flex gap-6">
            <a href="#" class="transition hover:text-white">About</a>
            <a href="#" class="transition hover:text-white">Waitlist</a>
            <a href="#" class="transition hover:text-white">Privacy</a>
          </div>
        </footer>
      </section>
    </main>
  </UApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const message = ref('')

const joinWaitlist = async () => {
  if (!email.value) {
    message.value = 'Please enter your email.'
    return
  }

  loading.value = true
  message.value = ''

  try {
    // TODO: replace with your real API request
    await new Promise(resolve => setTimeout(resolve, 800))

    message.value = 'Thanks! You’ve been added to the waitlist.'
    email.value = ''
  } catch (error) {
    message.value = 'Something went wrong. Please try again later.'
  } finally {
    loading.value = false
  }
}
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