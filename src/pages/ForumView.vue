<script setup lang="ts">
const posts = [
  {
    id: 1,
    title: 'My dachshund keeps hiding toys under the sofa',
    author: 'MiloMom',
    content: 'Anyone else dealing with this? He acts so proud every time.',
    replies: 12
  },
  {
    id: 2,
    title: 'Best walking harness for short legs?',
    author: 'SausageDaily',
    content: 'Need something comfortable for daily city walks.',
    replies: 8
  }
]

const comments = [
  { id: 1, author: 'PawPal', content: 'Mine does that too. It became his treasure cave.' },
  { id: 2, author: 'DoxieDad', content: 'Try a toy basket near the sofa first.' }
]
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900">Community Forum</h1>
        <p class="mt-2 text-slate-500">Post questions, share moments, and reply to other dog parents.</p>
      </div>

      <UButton size="lg" icon="i-lucide-plus-circle">
        New Post
      </UButton>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
      <section class="space-y-5">
        <div
          v-for="post in posts"
          :key="post.id"
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div class="mb-3 flex items-center justify-between gap-4">
            <h2 class="text-xl font-bold text-slate-900">{{ post.title }}</h2>
            <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {{ post.replies }} replies
            </span>
          </div>

          <p class="mb-4 text-sm text-slate-500">by {{ post.author }}</p>
          <p class="text-slate-700">{{ post.content }}</p>

          <div class="mt-5 flex gap-3">
            <UButton variant="soft" size="sm" icon="i-lucide-message-circle">
              Reply
            </UButton>
            <UButton variant="ghost" size="sm" icon="i-lucide-heart">
              Like
            </UButton>
          </div>
        </div>
      </section>

      <aside class="space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900">Quick Reply</h3>
          <div class="mt-4 space-y-3">
            <UTextarea placeholder="Write your reply..." :rows="5" />
            <UButton block>Send Reply</UButton>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900">Recent Replies</h3>
          <div class="mt-4 space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="rounded-2xl bg-slate-50 p-4">
              <p class="text-sm font-semibold text-slate-900">{{ comment.author }}</p>
              <p class="mt-1 text-sm text-slate-600">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>