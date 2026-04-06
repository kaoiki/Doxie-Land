<script setup lang="ts">
import doxieHero from '../assets/doxie-hero.png'
import doxieSide from '../assets/doxie-side.png'
import doxieCard1 from '../assets/doxie-card-1.png'
import doxieCard2 from '../assets/doxie-card-2.png'
import doxieBanner from '../assets/doxie-banner.png'
</script>

<template>
  <main class="flex flex-col bg-slate-50">
    <section class="px-6 py-8 lg:px-20 lg:py-10">
      <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <!-- Left hero -->
        <div class="h-full overflow-hidden rounded-3xl border border-green-200 shadow-sm">
          <div class="relative h-full min-h-[620px] lg:min-h-[700px]">
            <img
              :src="doxieHero"
              alt="Dachshund hero image"
              class="absolute inset-0 h-full w-full object-cover"
            />

            <div class="absolute inset-0 bg-gradient-to-r from-black/78 via-black/48 to-black/18"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/12 to-transparent"></div>

            <div class="relative z-10 flex h-full min-h-[620px] flex-col justify-between lg:min-h-[700px]">
              <div class="px-8 pb-8 pt-8 lg:px-12 lg:pt-12">
                <div class="max-w-2xl">
                  <div
                    class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                  >
                    <UIcon name="i-lucide-badge-check" class="h-4 w-4" />
                    Built for dachshund lovers
                  </div>

                  <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                    One cozy place for dachshund life, care, records, and community
                  </h1>

                  <p class="mt-5 max-w-xl text-base leading-7 text-white/90 md:text-lg">
                    Join discussions, review products, ask AI for help, collect useful knowledge,
                    and keep your dog’s profile and daily records all in one warm little world.
                  </p>
                </div>
              </div>

              <div class="bg-gradient-to-r from-black/72 via-black/50 to-black/24 px-8 py-5 lg:px-12 lg:py-6">
                <div class="flex flex-wrap gap-4">
                  <RouterLink
                    to="/forum"
                    class="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    <UIcon name="i-lucide-messages-square" class="h-4 w-4" />
                    Explore Forum
                  </RouterLink>

                  <RouterLink
                    to="/register"
                    class="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <UIcon name="i-lucide-user-plus" class="h-4 w-4" />
                    Join DoxieLand
                  </RouterLink>
                </div>

                <div class="mt-5 flex flex-wrap gap-3">
                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
                  >
                    <UIcon name="i-lucide-message-circle-more" class="h-4 w-4" />
                    Forum
                  </span>

                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
                  >
                    <UIcon name="i-lucide-star" class="h-4 w-4" />
                    Reviews
                  </span>

                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
                  >
                    <UIcon name="i-lucide-bot" class="h-4 w-4" />
                    AI Care
                  </span>

                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
                  >
                    <UIcon name="i-lucide-book-open-text" class="h-4 w-4" />
                    Knowledge
                  </span>

                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
                  >
                    <UIcon name="i-lucide-id-card" class="h-4 w-4" />
                    Dog Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="grid h-full gap-6">
          <div class="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm">
            <img
              :src="doxieSide"
              alt="Dachshund portrait"
              class="h-64 w-full object-cover"
            />
            <div class="p-6">
              <div
                class="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700"
              >
                <UIcon name="i-lucide-heart-handshake" class="h-4 w-4" />
                Daily companion tools
              </div>

              <h2 class="text-2xl font-extrabold text-slate-900">
                Keep your dachshund life organized and easier
              </h2>

              <p class="mt-3 text-sm leading-6 text-slate-600">
                Save records, ask questions, compare products, and share real experiences with other owners.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div
                class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
              >
                <UIcon name="i-lucide-messages-square" class="h-5 w-5" />
              </div>
              <h3 class="font-bold text-slate-900">Community</h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                Post, reply, and talk with other doxie owners.
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div
                class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
              >
                <UIcon name="i-lucide-shield-plus" class="h-5 w-5" />
              </div>
              <h3 class="font-bold text-slate-900">Support</h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                Get quick AI help for daily care questions.
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div
                class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
              >
                <UIcon name="i-lucide-notebook-pen" class="h-5 w-5" />
              </div>
              <h3 class="font-bold text-slate-900">Records</h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                Build and update your dog’s archive anytime.
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div
                class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
              >
                <UIcon name="i-lucide-book-open-text" class="h-5 w-5" />
              </div>
              <h3 class="font-bold text-slate-900">Knowledge</h3>
              <p class="mt-2 text-sm leading-6 text-slate-500">
                Collect useful tips and breed-specific notes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 py-6 lg:px-20 lg:py-10">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.18em] text-green-700">Main Areas</p>
          <h2 class="mt-2 text-3xl font-extrabold text-slate-900">Everything important, right up front</h2>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <RouterLink
          to="/forum"
          class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
        >
          <img
            :src="doxieCard1"
            alt="Forum section"
            class="h-44 w-full object-cover"
          />
          <div class="p-5">
            <div
              class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
            >
              <UIcon name="i-lucide-message-square-text" class="h-5 w-5" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Forum</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              A lightweight space to post, reply, and share dachshund life.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/reviews"
          class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
        >
          <img
            :src="doxieCard2"
            alt="Reviews section"
            class="h-44 w-full object-cover"
          />
          <div class="p-5">
            <div
              class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
            >
              <UIcon name="i-lucide-star" class="h-5 w-5" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Reviews</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Review dog gear, products, and purchase experiences.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/aicare"
          class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
        >
          <img
            :src="doxieCard1"
            alt="AI Care section"
            class="h-44 w-full object-cover"
          />
          <div class="p-5">
            <div
              class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
            >
              <UIcon name="i-lucide-bot" class="h-5 w-5" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">AI Care</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Ask AI for quick answers and simple care guidance.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/knowledge"
          class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
        >
          <img
            :src="doxieCard2"
            alt="Knowledge section"
            class="h-44 w-full object-cover"
          />
          <div class="p-5">
            <div
              class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
            >
              <UIcon name="i-lucide-library-big" class="h-5 w-5" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Knowledge</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Save and browse useful dachshund knowledge and notes.
            </p>
          </div>
        </RouterLink>

        <RouterLink
          to="/dog-profile"
          class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
        >
          <img
            :src="doxieSide"
            alt="Dog profile section"
            class="h-44 w-full object-cover"
          />
          <div class="p-5">
            <div
              class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700"
            >
              <UIcon name="i-lucide-id-card" class="h-5 w-5" />
            </div>
            <h3 class="text-lg font-bold text-slate-900">Dog Profile</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Build a profile and keep track of life records over time.
            </p>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="px-6 py-8 lg:px-20 lg:py-12">
      <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div
            class="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700"
          >
            <UIcon name="i-lucide-layout-grid" class="h-4 w-4" />
            Why DoxieLand
          </div>

          <h2 class="text-3xl font-extrabold text-slate-900">
            More useful than scattered notes, chats, and bookmarks
          </h2>

          <div class="mt-6 space-y-4">
            <div class="flex gap-3">
              <div class="mt-0.5 text-green-600">
                <UIcon name="i-lucide-check-circle-2" class="h-5 w-5" />
              </div>
              <p class="text-sm leading-7 text-slate-600">
                Keep your dog’s records in one stable place instead of random apps and screenshots.
              </p>
            </div>

            <div class="flex gap-3">
              <div class="mt-0.5 text-green-600">
                <UIcon name="i-lucide-check-circle-2" class="h-5 w-5" />
              </div>
              <p class="text-sm leading-7 text-slate-600">
                Talk with other owners and compare real product experiences more easily.
              </p>
            </div>

            <div class="flex gap-3">
              <div class="mt-0.5 text-green-600">
                <UIcon name="i-lucide-check-circle-2" class="h-5 w-5" />
              </div>
              <p class="text-sm leading-7 text-slate-600">
                Get quick AI support for common questions before moving to deeper action.
              </p>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink
              to="/login"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-green-300 bg-white px-5 text-sm font-bold text-green-700 transition hover:bg-green-50"
            >
              <UIcon name="i-lucide-log-in" class="h-4 w-4" />
              Login
            </RouterLink>

            <RouterLink
              to="/register"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-bold text-white transition hover:bg-green-700"
            >
              <UIcon name="i-lucide-user-plus" class="h-4 w-4" />
              Register
            </RouterLink>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img
              :src="doxieCard1"
              alt="Dachshund moment"
              class="h-56 w-full object-cover"
            />
            <div class="p-5">
              <h3 class="text-lg font-bold text-slate-900">Community moments</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Share milestones, routines, and the little moments that make dachshund life special.
              </p>
            </div>
          </div>

          <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img
              :src="doxieCard2"
              alt="Dachshund lifestyle"
              class="h-56 w-full object-cover"
            />
            <div class="p-5">
              <h3 class="text-lg font-bold text-slate-900">Practical reviews</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Keep track of what is actually useful, comfortable, and worth buying.
              </p>
            </div>
          </div>

          <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:col-span-2">
            <img
              :src="doxieBanner"
              alt="Dachshund lifestyle banner"
              class="h-64 w-full object-cover"
            />
            <div class="p-6">
              <div
                class="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700"
              >
                <UIcon name="i-lucide-sparkles" class="h-4 w-4" />
                Start simple
              </div>

              <h3 class="text-2xl font-extrabold text-slate-900">
                Join first, then build your own dachshund corner
              </h3>

              <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                Browse the forum, create your account, start your dog profile, and gradually fill in reviews,
                notes, and daily records at your own pace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>