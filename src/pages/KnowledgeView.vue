<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest } from '../utils/http'

type ArticleItem = {
  id: string
  title: string
  slug: string
  category: string
  summary: string
  coverImage: string
  sourceType: string
  viewCount: number
  isFeatured: boolean
  isHot: boolean
  requireLogin: boolean
  createdAt: string
}

type Category = { code: string; name: string }

const router = useRouter()

const articles = ref<ArticleItem[]>([])
const categories = ref<Category[]>([])
const activeCategory = ref('')
const keyword = ref('')
const searchInput = ref('')

const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const totalPage = ref(1)
const loading = ref(false)
const featuredArticles = ref<ArticleItem[]>([])
const hotArticles = ref<ArticleItem[]>([])
const latestArticles = ref<ArticleItem[]>([])

const CATEGORY_NAMES: Record<string, string> = {
  prepare: 'Prepare',
  new_owner: 'New Owner',
  common: 'Common',
  health: 'Health & Risks',
  practice: 'My Practice'
}
const SOURCE_LABELS: Record<string, string> = {
  official: 'Official',
  practice: 'My Practice',
  review: 'Review',
  reference: 'Reference'
}

const visiblePages = computed(() => {
  const tp = totalPage.value
  const c = page.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  if (c <= 4) return [1, 2, 3, 4, 5, 6, 7]
  if (c >= tp - 3) return [tp - 6, tp - 5, tp - 4, tp - 3, tp - 2, tp - 1, tp]
  return [c - 3, c - 2, c - 1, c, c + 1, c + 2, c + 3]
})

function formatDate(v?: string) {
  if (!v) return '-'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function mapArticle(item: any): ArticleItem {
  return {
    id: item.id,
    title: item.title || '',
    slug: item.slug || '',
    category: item.category || '',
    summary: item.summary || '',
    coverImage: item.cover_image || '',
    sourceType: item.source_type || 'official',
    viewCount: item.view_count || 0,
    isFeatured: item.is_featured || false,
    isHot: item.is_hot || false,
    requireLogin: item.require_login || false,
    createdAt: formatDate(item.created_at)
  }
}

async function fetchCategories() {
  try {
    const res = await httpRequest<{ code: number; data: Category[] }>('/api/v1/knowledge/categories')
    categories.value = res.data || []
  } catch { categories.value = [] }
}

async function fetchFeatured() {
  try {
    const res = await httpRequest<{ code: number; data: { list: any[] } }>('/api/v1/knowledge/articles/featured?limit=6')
    featuredArticles.value = (res.data?.list || []).map(mapArticle)
  } catch { featuredArticles.value = [] }
}

async function fetchHot() {
  try {
    const res = await httpRequest<{ code: number; data: { list: any[] } }>('/api/v1/knowledge/articles/hot?limit=6')
    hotArticles.value = (res.data?.list || []).map(mapArticle)
  } catch { hotArticles.value = [] }
}

async function fetchLatest() {
  try {
    const res = await httpRequest<{ code: number; data: { list: any[] } }>('/api/v1/knowledge/articles/latest?limit=6')
    latestArticles.value = (res.data?.list || []).map(mapArticle)
  } catch { latestArticles.value = [] }
}

async function fetchList() {
  loading.value = true
  let url = `/api/v1/knowledge/articles?page=${page.value}&page_size=${pageSize.value}`
  if (activeCategory.value) url += `&category=${activeCategory.value}`
  if (keyword.value) url += `&keyword=${encodeURIComponent(keyword.value)}`

  try {
    const res = await httpRequest<{ code: number; data: { list: any[]; total: number; total_page: number; page: number; page_size: number } }>(url)
    const d = res.data || { list: [], total: 0, total_page: 1, page: page.value, page_size: pageSize.value }
    articles.value = (d.list || []).map(mapArticle)
    total.value = d.total || 0
    totalPage.value = d.total_page || 1
    page.value = d.page || page.value
  } catch { articles.value = []; total.value = 0; totalPage.value = 1 }
  finally { loading.value = false }
}

function clearSearch() {
  keyword.value = ''
  searchInput.value = ''
  page.value = 1
  fetchList()
}

function selectCategory(cat: string) {
  activeCategory.value = cat
  keyword.value = ''
  searchInput.value = ''
  page.value = 1
  fetchList()
}

function doSearch() {
  keyword.value = searchInput.value.trim()
  page.value = 1
  fetchList()
}

function goDetail(slug: string) {
  router.push(`/knowledge/${slug}`)
}

function goPrev() { if (page.value > 1 && !loading.value) { page.value--; fetchList() } }
function goNext() { if (page.value < totalPage.value && !loading.value) { page.value++; fetchList() } }
function goPage(p: number) { if (p >= 1 && p <= totalPage.value && !loading.value) { page.value = p; fetchList() } }

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchFeatured(), fetchHot(), fetchLatest()])
  await fetchList()
})
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Hero -->
    <section class="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.12),transparent_22%)]" />
      <div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            <span class="h-2 w-2 rounded-full bg-blue-500" />
            Knowledge Base
          </div>
          <h1 class="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Dachshund Knowledge Base</h1>
          <p class="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Care guides, health tips, feeding notes, and everything you need to know about dachshunds.</p>
        </div>
        <div class="flex w-full gap-2 sm:w-96">
          <div class="relative flex-1">
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search articles..."
              class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              @keyup.enter="doSearch"
            />
            <UIcon name="i-lucide-search" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <button
              v-if="searchInput"
              class="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              @click="searchInput = ''; doSearch()"
            >
              <UIcon name="i-lucide-x" class="h-4 w-4" />
            </button>
          </div>
          <UButton icon="i-lucide-search" @click="doSearch">Search</UButton>
        </div>
      </div>
    </section>

    <!-- Category filter -->
    <section class="mt-6 flex flex-wrap gap-2">
      <button
        class="rounded-full px-4 py-2 text-sm font-bold transition"
        :class="!activeCategory ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        @click="selectCategory('')"
      >All</button>
      <button
        v-for="cat in categories" :key="cat.code"
        class="rounded-full px-4 py-2 text-sm font-bold transition"
        :class="activeCategory === cat.code ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
        @click="selectCategory(cat.code)"
      >{{ CATEGORY_NAMES[cat.code] || cat.name }}</button>
    </section>

    <!-- Featured section -->
    <section v-if="featuredArticles.length && !activeCategory && !keyword" class="mt-8">
      <div class="mb-4 flex items-center gap-2">
        <UIcon name="i-lucide-star" class="h-5 w-5 text-amber-500" />
        <h2 class="text-lg font-black text-slate-900">Featured</h2>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="article in featuredArticles" :key="article.id"
          class="group cursor-pointer overflow-hidden rounded-[24px] border border-amber-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
          @click="goDetail(article.slug)"
        >
          <div class="p-5">
            <div class="mb-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                <UIcon name="i-lucide-star" class="mr-0.5 inline h-3 w-3" /> Featured
              </span>
              <span class="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">{{ CATEGORY_NAMES[article.category] || article.category }}</span>
              <span v-if="article.requireLogin" class="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                <UIcon name="i-lucide-lock" class="mr-0.5 inline h-3 w-3" /> Login
              </span>
            </div>
            <h3 class="line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-blue-700">{{ article.title }}</h3>
            <p v-if="article.summary" class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ article.summary }}</p>
            <div class="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1"><UIcon name="i-lucide-eye" class="h-3.5 w-3.5" /> {{ article.viewCount }}</span>
              <span>{{ article.createdAt }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Hot + Latest sidebar for main page -->
    <div v-if="!activeCategory && !keyword" class="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <!-- Main list -->
      <div>
        <div v-if="hotArticles.length" class="mb-8">
          <div class="mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-flame" class="h-5 w-5 text-orange-500" />
            <h2 class="text-lg font-black text-slate-900">Hot Topics</h2>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="article in hotArticles" :key="article.id"
              class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-700"
              @click="goDetail(article.slug)"
            >
              {{ article.title }}
            </button>
          </div>
        </div>

        <h2 class="mb-4 text-lg font-black text-slate-900">All Articles</h2>
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="article in articles" :key="article.id"
            class="group cursor-pointer overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
            @click="goDetail(article.slug)"
          >
            <div v-if="article.coverImage" class="h-36 w-full overflow-hidden">
              <img :src="article.coverImage" class="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div class="p-5">
              <div class="mb-3 flex flex-wrap gap-2">
                <span class="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">{{ CATEGORY_NAMES[article.category] || article.category }}</span>
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{{ SOURCE_LABELS[article.sourceType] || article.sourceType }}</span>
                <span v-if="article.isHot" class="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700">Hot</span>
                <span v-if="article.requireLogin" class="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                  <UIcon name="i-lucide-lock" class="mr-0.5 inline h-3 w-3" /> Login
                </span>
              </div>
              <h3 class="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-blue-700">{{ article.title }}</h3>
              <p v-if="article.summary" class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ article.summary }}</p>
              <div class="mt-4 flex items-center gap-3 text-xs text-slate-400">
                <span class="flex items-center gap-1"><UIcon name="i-lucide-eye" class="h-3.5 w-3.5" /> {{ article.viewCount }}</span>
                <span>{{ article.createdAt }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="space-y-6">
        <div v-if="latestArticles.length" class="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
            <UIcon name="i-lucide-clock" class="h-4 w-4" /> Latest
          </h3>
          <div class="space-y-3">
            <button
              v-for="article in latestArticles" :key="article.id"
              class="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              @click="goDetail(article.slug)"
            >
              <span class="line-clamp-1">{{ article.title }}</span>
              <span class="mt-0.5 block text-xs text-slate-400">{{ article.createdAt }}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Search active indicator -->
    <section v-if="keyword" class="mt-8 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm text-blue-800">
      <UIcon name="i-lucide-search" class="h-4 w-4 shrink-0" />
      <span>Search results for: <strong>"{{ keyword }}"</strong></span>
      <UButton variant="solid" color="primary" size="sm" class="ml-auto shrink-0" @click="clearSearch">Clear</UButton>
    </section>

    <!-- List only view (when category or search is active) -->
    <template v-if="activeCategory || keyword">
      <section class="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="article in articles" :key="article.id"
          class="group cursor-pointer overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
          @click="goDetail(article.slug)"
        >
          <div v-if="article.coverImage" class="h-36 w-full overflow-hidden">
            <img :src="article.coverImage" class="h-full w-full object-cover transition group-hover:scale-105" />
          </div>
          <div class="p-5">
            <div class="mb-3 flex flex-wrap gap-2">
              <span class="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">{{ CATEGORY_NAMES[article.category] || article.category }}</span>
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{{ SOURCE_LABELS[article.sourceType] || article.sourceType }}</span>
              <span v-if="article.requireLogin" class="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                <UIcon name="i-lucide-lock" class="mr-0.5 inline h-3 w-3" /> Login
              </span>
            </div>
            <h3 class="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-blue-700">{{ article.title }}</h3>
            <p v-if="article.summary" class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ article.summary }}</p>
            <div class="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1"><UIcon name="i-lucide-eye" class="h-3.5 w-3.5" /> {{ article.viewCount }}</span>
              <span>{{ article.createdAt }}</span>
            </div>
          </div>
        </article>
      </section>
    </template>

    <!-- Empty -->
    <section v-if="!loading && !articles.length && (activeCategory || keyword)" class="mt-8 flex flex-col items-center rounded-[28px] border border-slate-200 bg-white py-16 text-slate-400">
      <UIcon name="i-lucide-book-open" class="h-12 w-12" />
      <p class="mt-4 text-sm font-semibold">No articles found.</p>
      <UButton v-if="keyword" variant="solid" color="primary" size="sm" icon="i-lucide-x" class="mt-4" @click="clearSearch">Clear search</UButton>
    </section>

    <!-- Pagination -->
    <section v-if="totalPage > 1" class="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-500">Page {{ page }} / {{ totalPage }} · {{ total }} articles</p>
        <div class="flex flex-wrap gap-2">
          <UButton color="neutral" variant="soft" size="sm" icon="i-lucide-chevron-left" :disabled="page <= 1 || loading" @click="goPrev">Prev</UButton>
          <UButton v-if="visiblePages[0] > 1" color="neutral" variant="soft" size="sm" :disabled="loading" @click="goPage(1)">1</UButton>
          <span v-if="visiblePages[0] > 2" class="flex items-center px-1 text-sm text-slate-400">...</span>
          <UButton v-for="p in visiblePages" :key="p" :color="p === page ? 'primary' : 'neutral'" :variant="p === page ? 'solid' : 'soft'" size="sm" :disabled="loading" @click="goPage(p)">{{ p }}</UButton>
          <span v-if="visiblePages[visiblePages.length - 1] < totalPage - 1" class="flex items-center px-1 text-sm text-slate-400">...</span>
          <UButton v-if="visiblePages[visiblePages.length - 1] < totalPage" color="neutral" variant="soft" size="sm" :disabled="loading" @click="goPage(totalPage)">{{ totalPage }}</UButton>
          <UButton color="neutral" variant="soft" size="sm" trailing-icon="i-lucide-chevron-right" :disabled="page >= totalPage || loading" @click="goNext">Next</UButton>
        </div>
      </div>
    </section>
  </main>
</template>
