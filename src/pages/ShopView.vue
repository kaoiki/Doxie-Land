<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest, getToken } from '../utils/http'

type ApiReviewItem = {
  id: string
  title: string
  content: string
  status: number
  join_count: number
  image_count: number
  created_at: string
  user_id: string
}

type ReviewItem = {
  id: string
  title: string
  content: string
  status: number
  joinCount: number
  imageCount: number
  createdAt: string
  isMine: boolean
}

const router = useRouter()
const toast = useToast()

function getLoginStatus() {
  return !!getToken()
}

function getUserId() {
  return localStorage.getItem('doxie_uid') || ''
}

const isLoggedIn = ref(getLoginStatus())

const reviewList = ref<ReviewItem[]>([])

const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const totalPage = ref(1)
const loading = ref(false)

const showCreateModal = ref(false)
const showLoginRequiredModal = ref(false)
const createTitle = ref('')
const createContent = ref('')
const createError = ref('')
const createLoading = ref(false)

const visiblePages = computed(() => {
  const totalPages = totalPage.value
  const current = page.value

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 6, 7]
  }

  if (current >= totalPages - 3) {
    return [
      totalPages - 6,
      totalPages - 5,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ]
  }

  return [current - 3, current - 2, current - 1, current, current + 1, current + 2, current + 3]
})

function formatDateTime(value?: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function statusLabel(status: number) {
  return status === 1 ? 'Group Buy Open' : 'Review'
}

function statusClass(status: number) {
  return status === 1
    ? 'bg-green-50 text-green-700'
    : 'bg-violet-50 text-violet-700'
}

function mapItem(item: ApiReviewItem): ReviewItem {
  const uid = getUserId()
  return {
    id: item.id,
    title: item.title || '',
    content: item.content || '',
    status: item.status ?? 0,
    joinCount: item.join_count || 0,
    imageCount: item.image_count || 0,
    createdAt: formatDateTime(item.created_at),
    isMine: !!uid && item.user_id === uid
  }
}

async function fetchList(targetPage = 1) {
  loading.value = true

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: {
        list: ApiReviewItem[]
        total: number
        total_page: number
        page: number
        page_size: number
      }
    }>(`/api/shop/reviews?page=${targetPage}&page_size=${pageSize.value}`)

    const data = res.data || {
      list: [],
      total: 0,
      total_page: 1,
      page: targetPage,
      page_size: pageSize.value
    }

    reviewList.value = (data.list || []).map(mapItem)
    total.value = data.total || 0
    totalPage.value = data.total_page || 1
    page.value = data.page || targetPage
  } catch (error) {
    console.error('fetch reviews failed:', error)
    reviewList.value = []
    total.value = 0
    totalPage.value = 1
  } finally {
    loading.value = false
  }
}

function openDetail(id: string) {
  router.push(`/shop/${id}`)
}

function goPrev() {
  if (page.value <= 1 || loading.value) return
  fetchList(page.value - 1)
}

function goNext() {
  if (page.value >= totalPage.value || loading.value) return
  fetchList(page.value + 1)
}

function goPage(targetPage: number) {
  if (targetPage < 1 || targetPage > totalPage.value || loading.value) return
  fetchList(targetPage)
}

function openCreateModal() {
  isLoggedIn.value = getLoginStatus()

  if (!isLoggedIn.value) {
    showLoginRequiredModal.value = true
    return
  }

  createError.value = ''
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
  createTitle.value = ''
  createContent.value = ''
  createError.value = ''
}

function closeLoginRequiredModal() {
  showLoginRequiredModal.value = false
}

function goToRegister() {
  showLoginRequiredModal.value = false
  router.push('/register')
}

function goToLogin() {
  showLoginRequiredModal.value = false
  router.push('/login')
}

async function submitReview() {
  isLoggedIn.value = getLoginStatus()

  if (!isLoggedIn.value) {
    showCreateModal.value = false
    showLoginRequiredModal.value = true
    return
  }

  if (!createTitle.value.trim() || !createContent.value.trim()) {
    createError.value = 'Title and content cannot be empty.'
    return
  }

  createLoading.value = true
  createError.value = ''

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: { id: string }
    }>('/api/shop/reviews', {
      method: 'POST',
      body: {
        title: createTitle.value.trim(),
        content: createContent.value.trim(),
        user_id: getUserId()
      },
      skipLoading: true
    })

    toast.add({
      title: 'Review created',
      description: 'Your review has been published.',
      color: 'success'
    })

    closeCreateModal()
    await router.push(`/shop/${res.data.id}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create review.'
    createError.value = message
    toast.add({
      title: 'Failed',
      description: message,
      color: 'error'
    })
  } finally {
    createLoading.value = false
  }
}

onMounted(() => {
  fetchList(1)
})
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <section
      class="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.12),transparent_22%)]"
      />
      <div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700"
          >
            <span class="h-2 w-2 rounded-full bg-violet-500" />
            Doxie Reviews
          </div>
          <h1 class="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Dog Gear Reviews
          </h1>
          <p class="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Review dog products, share experiences, and organize group buying.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <UButton size="lg" icon="i-lucide-star" @click="openCreateModal">
            Write Review
          </UButton>
        </div>
      </div>
    </section>

    <section class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="review in reviewList"
        :key="review.id"
        class="group cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
        @click="openDetail(review.id)"
      >
        <div class="flex min-h-[200px] flex-col justify-between p-5">
          <div>
            <div class="mb-3 flex flex-wrap gap-2">
              <span
                :class="statusClass(review.status)"
                class="rounded-full px-2.5 py-1 text-[11px] font-bold"
              >
                {{ statusLabel(review.status) }}
              </span>
              <span
                v-if="review.isMine"
                class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
              >
                Your review
              </span>
              <span
                class="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700"
              >
                <UIcon name="i-lucide-users" class="mr-0.5 inline h-3 w-3" />
                {{ review.joinCount }} joined
              </span>
            </div>

            <h2 class="line-clamp-1 text-xl font-black leading-tight text-slate-900">
              {{ review.title }}
            </h2>

            <p class="mt-3 min-h-[60px] line-clamp-3 text-sm leading-6 text-slate-600">
              {{ review.content }}
            </p>
          </div>

          <div class="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div class="flex items-center gap-4 text-sm text-slate-500">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-users" class="h-4 w-4" />
                <span>{{ review.joinCount }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-image" class="h-4 w-4" />
                <span>{{ review.imageCount }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-clock-3" class="h-4 w-4" />
                <span>{{ review.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section
      class="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-500">
          Page {{ page }} / {{ totalPage }} · {{ total }} total reviews
        </p>

        <div class="flex flex-wrap gap-2">
          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            icon="i-lucide-chevron-left"
            :disabled="page <= 1 || loading"
            @click="goPrev"
          >
            Prev
          </UButton>

          <UButton
            v-if="visiblePages[0] > 1"
            color="neutral"
            variant="soft"
            size="sm"
            :disabled="loading"
            @click="goPage(1)"
          >
            1
          </UButton>

          <span
            v-if="visiblePages[0] > 2"
            class="flex items-center px-1 text-sm text-slate-400"
          >
            ...
          </span>

          <UButton
            v-for="pageNum in visiblePages"
            :key="pageNum"
            :color="pageNum === page ? 'primary' : 'neutral'"
            :variant="pageNum === page ? 'solid' : 'soft'"
            size="sm"
            :disabled="loading"
            @click="goPage(pageNum)"
          >
            {{ pageNum }}
          </UButton>

          <span
            v-if="visiblePages[visiblePages.length - 1] < totalPage - 1"
            class="flex items-center px-1 text-sm text-slate-400"
          >
            ...
          </span>

          <UButton
            v-if="visiblePages[visiblePages.length - 1] < totalPage"
            color="neutral"
            variant="soft"
            size="sm"
            :disabled="loading"
            @click="goPage(totalPage)"
          >
            {{ totalPage }}
          </UButton>

          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            trailing-icon="i-lucide-chevron-right"
            :disabled="page >= totalPage || loading"
            @click="goNext"
          >
            Next
          </UButton>
        </div>
      </div>
    </section>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4"
    >
      <div class="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.25)] sm:p-7">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black text-slate-900">Write a review</h2>
            <p class="mt-1 text-sm text-slate-500">
              Share your honest experience with a dog product.
            </p>
          </div>

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            @click="closeCreateModal"
          />
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">Title</label>
            <input
              v-model="createTitle"
              type="text"
              placeholder="e.g. Cooling Summer Vest"
              class="w-full rounded-2xl border border-violet-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-bold text-slate-700">Content</label>
            <textarea
              v-model="createContent"
              rows="7"
              placeholder="Describe your experience with the product..."
              class="w-full rounded-2xl border border-violet-500 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <p v-if="createError" class="text-sm font-semibold text-rose-500">
            {{ createError }}
          </p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <UButton color="neutral" variant="soft" :disabled="createLoading" @click="closeCreateModal">
            Cancel
          </UButton>
          <UButton icon="i-lucide-send" :loading="createLoading" @click="submitReview">
            Publish Review
          </UButton>
        </div>
      </div>
    </div>

    <div
      v-if="showLoginRequiredModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4"
    >
      <div class="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.25)] sm:p-7">
        <div class="text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <UIcon name="i-lucide-lock" class="h-7 w-7 text-amber-600" />
          </div>

          <h2 class="mt-4 text-2xl font-black text-slate-900">Login required</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            Browsing is open, but writing a review requires registration or login first.
          </p>
        </div>

        <div class="mt-6 flex justify-center gap-3">
          <UButton variant="ghost" class="text-gray-400 hover:text-gray-600" @click="closeLoginRequiredModal">
            Later
          </UButton>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="goToLogin"
          >
            Login
          </UButton>
          <UButton icon="i-lucide-user-plus" @click="goToRegister">
            Register
          </UButton>
        </div>
      </div>
    </div>
  </main>
</template>
