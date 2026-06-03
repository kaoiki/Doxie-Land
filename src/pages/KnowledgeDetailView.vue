<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { httpRequest, getToken } from '../utils/http'
import { marked } from 'marked'

const CATEGORY_NAMES: Record<string, string> = {
  prepare: 'Prepare', new_owner: 'New Owner', common: 'Common', health: 'Health & Risks', practice: 'My Practice'
}
const SOURCE_LABELS: Record<string, string> = {
  official: 'Official', practice: 'My Practice', review: 'Review', reference: 'Reference'
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const slug = computed(() => String(route.params.slug ?? ''))

const article = ref({
  id: '', title: '', slug: '', category: '', summary: '',
  contentMarkdown: '', coverImage: '', sourceType: 'official',
  viewCount: 0, isFeatured: false, isHot: false, requireLogin: false, createdAt: '', updatedAt: ''
})
const loading = ref(true)
const loginRequired = ref(false)

const renderedContent = computed(() => {
  if (!article.value.contentMarkdown) return ''
  try {
    return marked(article.value.contentMarkdown)
  } catch {
    return article.value.contentMarkdown
  }
})

async function fetchArticle() {
  if (!slug.value) return
  loading.value = true
  loginRequired.value = false

  try {
    const res = await httpRequest<{ code: number; data: { article: any } }>(
      `/api/v1/knowledge/articles/slug/${slug.value}`
    )
    const item = res.data?.article
    if (!item) throw new Error('Article not found.')
    article.value = {
      id: item.id, title: item.title || '', slug: item.slug || '', category: item.category || '',
      summary: item.summary || '', contentMarkdown: item.content_markdown || '',
      coverImage: item.cover_image || '', sourceType: item.source_type || 'official',
      viewCount: item.view_count || 0, isFeatured: item.is_featured || false,
      isHot: item.is_hot || false, requireLogin: item.require_login || false,
      createdAt: item.created_at || '', updatedAt: item.updated_at || ''
    }
  } catch (e: any) {
    const msg = e?.message?.toLowerCase() || ''
    if (msg.includes('login required') || msg.includes('401') || msg.includes('token')) {
      loginRequired.value = true
    } else {
      toast.add({ title: 'Load failed', description: e instanceof Error ? e.message : 'Failed to load.', color: 'error' })
    }
  } finally { loading.value = false }
}

function goBack() {
  router.push('/knowledge')
}

function goToLogin() {
  router.push('/login')
}

function formatDate(v?: string) {
  if (!v) return '-'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => { fetchArticle() })
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Back -->
    <section class="mb-6">
      <UButton color="neutral" variant="soft" icon="i-lucide-arrow-left" @click="goBack">Back to Knowledge</UButton>
    </section>

    <!-- Loading -->
    <section v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-lucide-loader-circle" class="h-8 w-8 animate-spin text-slate-400" />
    </section>

    <!-- Article -->
    <template v-else-if="article.title">
      <section class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <!-- Cover -->
        <div v-if="article.coverImage" class="h-64 w-full overflow-hidden sm:h-80">
          <img :src="article.coverImage" class="h-full w-full object-cover" />
        </div>

        <!-- Header -->
        <div class="px-6 pb-2 pt-8 sm:px-10">
          <div class="mb-4 flex flex-wrap gap-2">
            <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              {{ CATEGORY_NAMES[article.category] || article.category }}
            </span>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {{ SOURCE_LABELS[article.sourceType] || article.sourceType }}
            </span>
            <span v-if="article.isFeatured" class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              <UIcon name="i-lucide-star" class="mr-0.5 inline h-3 w-3" /> Featured
            </span>
            <span v-if="article.isHot" class="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
              <UIcon name="i-lucide-flame" class="mr-0.5 inline h-3 w-3" /> Hot
            </span>
            <span v-if="article.requireLogin" class="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              <UIcon name="i-lucide-lock" class="mr-0.5 inline h-3 w-3" /> Requires login
            </span>
          </div>

          <h1 class="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">{{ article.title }}</h1>

          <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span class="flex items-center gap-1.5"><UIcon name="i-lucide-eye" class="h-4 w-4" /> {{ article.viewCount }} views</span>
            <span class="flex items-center gap-1.5"><UIcon name="i-lucide-calendar" class="h-4 w-4" /> {{ formatDate(article.createdAt) }}</span>
            <span v-if="article.updatedAt && article.updatedAt !== article.createdAt" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-refresh-cw" class="h-4 w-4" /> Updated {{ formatDate(article.updatedAt) }}
            </span>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="article.summary" class="mx-6 mt-6 rounded-2xl bg-blue-50 px-5 py-4 text-sm leading-6 text-slate-700 sm:mx-10">
          <p class="font-semibold text-slate-900">Summary</p>
          <p class="mt-1">{{ article.summary }}</p>
        </div>

        <!-- Content or login prompt -->
        <div class="px-6 py-8 sm:px-10 sm:py-10">
          <div v-if="article.requireLogin && !getToken()" class="flex flex-col items-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 px-6 py-12 text-center">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <UIcon name="i-lucide-lock" class="h-7 w-7 text-blue-600" />
            </div>
            <h3 class="mt-4 text-xl font-black text-slate-900">Login Required</h3>
            <p class="mt-2 max-w-md text-sm leading-6 text-slate-600">This article requires an account to view the full content. Please log in or register to continue reading.</p>
            <div class="mt-6 flex gap-3">
              <UButton color="neutral" variant="soft" icon="i-heroicons-arrow-right-on-rectangle" @click="goToLogin">Login</UButton>
              <UButton icon="i-lucide-user-plus" @click="router.push('/register')">Register</UButton>
            </div>
          </div>
          <div
            v-else
            class="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-a:text-blue-700 prose-img:rounded-2xl prose-blockquote:border-blue-500"
            v-html="renderedContent"
          />
        </div>
      </section>
    </template>

    <!-- Not found -->
    <section v-else class="flex flex-col items-center py-20 text-slate-400">
      <UIcon name="i-lucide-file-question" class="h-12 w-12" />
      <p class="mt-4 text-sm font-semibold">Article not found.</p>
    </section>
  </main>
</template>
