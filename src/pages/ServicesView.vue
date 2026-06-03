<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest, getToken } from '../utils/http'

type ApiServiceItem = {
  id: string
  user_id: string
  nickname: string
  category: string
  title: string
  description: string
  service_area: string
  fee_type: string
  is_verified: boolean
  provider_image: string | null
  like_count: number
  dislike_count: number
  created_at: string
}

type ServiceItem = {
  id: string
  nickname: string
  category: string
  title: string
  description: string
  serviceArea: string
  feeType: string
  feeLabel: string
  isVerified: boolean
  providerImage: string
  likeCount: number
  dislikeCount: number
  createdAt: string
  isMine: boolean
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'walking', label: 'Walking', color: 'bg-green-100 text-green-700' },
  { value: 'veterinary', label: 'Veterinary', color: 'bg-red-100 text-red-700' },
  { value: 'boarding', label: 'Boarding', color: 'bg-blue-100 text-blue-700' },
  { value: 'grooming', label: 'Grooming', color: 'bg-purple-100 text-purple-700' },
  { value: 'training', label: 'Training', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'lost_found', label: 'Lost & Found', color: 'bg-orange-100 text-orange-700' },
  { value: 'meetup', label: 'Meetup', color: 'bg-pink-100 text-pink-700' },
  { value: 'pet_trading', label: 'Pet Trading', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'other', label: 'Other', color: 'bg-slate-100 text-slate-700' }
]

const FEE_LABELS: Record<string, string> = {
  free: 'Free',
  negotiable: 'Negotiable',
  paid: 'Paid'
}

const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.filter(c => c.value).map(c => [c.value, { label: c.label, color: c.color }])
)

const router = useRouter()
const toast = useToast()

function getUserId() { return localStorage.getItem('doxie_uid') || '' }

const serviceList = ref<ServiceItem[]>([])
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const totalPage = ref(1)
const loading = ref(false)
const activeCategory = ref('')
const showMine = ref(false)

const showCreateModal = ref(false)
const showLoginRequiredModal = ref(false)
const createTitle = ref('')
const createCategory = ref('walking')
const createDesc = ref('')
const createPhone = ref('')
const createWechat = ref('')
const createArea = ref('')
const createTime = ref('')
const createFeeType = ref('free')
const createError = ref('')
const createLoading = ref(false)

const visiblePages = computed(() => {
  const totalPages = totalPage.value
  const current = page.value
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 6, 7]
  if (current >= totalPages - 3) return [totalPages - 6, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return [current - 3, current - 2, current - 1, current, current + 1, current + 2, current + 3]
})

function formatDate(value?: string) {
  if (!value) return '-'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function mapItem(item: ApiServiceItem): ServiceItem {
  const uid = getUserId()
  return {
    id: item.id,
    nickname: item.nickname || 'Doxie Member',
    category: item.category,
    title: item.title || '',
    description: item.description || '',
    serviceArea: item.service_area || '',
    feeType: item.fee_type || 'free',
    feeLabel: FEE_LABELS[item.fee_type] || '免费',
    isVerified: item.is_verified || false,
    providerImage: item.provider_image || '',
    likeCount: item.like_count || 0,
    dislikeCount: item.dislike_count || 0,
    createdAt: formatDate(item.created_at),
    isMine: !!uid && item.user_id === uid
  }
}

async function fetchList() {
  loading.value = true
  const basePath = showMine.value ? '/api/services/mine' : '/api/services'
  let url = `${basePath}?page=${page.value}&page_size=${pageSize.value}`
  if (activeCategory.value) url += `&category=${activeCategory.value}`

  try {
    const res = await httpRequest<{
      code: number; message: string
      data: { list: ApiServiceItem[]; total: number; total_page: number; page: number; page_size: number }
    }>(url)
    const d = res.data || { list: [], total: 0, total_page: 1, page: page.value, page_size: pageSize.value }
    serviceList.value = (d.list || []).map(mapItem)
    total.value = d.total || 0
    totalPage.value = d.total_page || 1
    page.value = d.page || page.value
  } catch (e) {
    console.error('fetch services failed:', e)
    serviceList.value = []; total.value = 0; totalPage.value = 1
  } finally {
    loading.value = false
  }
}

function selectCategory(cat: string) {
  activeCategory.value = cat
  page.value = 1
  fetchList()
}

function toggleMine() {
  showMine.value = !showMine.value
  page.value = 1
  fetchList()
}

function goDetail(id: string) {
  router.push(`/services/${id}`)
}

function goPrev() { if (page.value > 1 && !loading.value) { page.value--; fetchList() } }
function goNext() { if (page.value < totalPage.value && !loading.value) { page.value++; fetchList() } }
function goPage(p: number) { if (p >= 1 && p <= totalPage.value && !loading.value) { page.value = p; fetchList() } }

function openCreate() {
  if (!getToken()) { showLoginRequiredModal.value = true; return }
  createError.value = ''
  showCreateModal.value = true
}

function closeCreate() {
  showCreateModal.value = false
  createTitle.value = ''; createCategory.value = 'walking'; createDesc.value = ''
  createPhone.value = ''; createWechat.value = ''; createArea.value = ''
  createTime.value = ''; createFeeType.value = 'free'; createError.value = ''
}

function closeLoginModal() { showLoginRequiredModal.value = false }

async function submitService() {
  if (!getToken()) { showCreateModal.value = false; showLoginRequiredModal.value = true; return }
  if (!createTitle.value.trim() || !createDesc.value.trim()) {
    createError.value = 'Title and description are required.'; return
  }
  if (!createPhone.value.trim() && !createWechat.value.trim()) {
    createError.value = 'At least one contact method is required.'; return
  }

  createLoading.value = true; createError.value = ''

  try {
    const res = await httpRequest<{ code: number; message: string; data: { id: string } }>('/api/services', {
      method: 'POST',
      body: {
        category: createCategory.value,
        title: createTitle.value.trim(),
        description: createDesc.value.trim(),
        contact_phone: createPhone.value.trim() || null,
        contact_wechat: createWechat.value.trim() || null,
        service_area: createArea.value.trim() || null,
        available_time: createTime.value.trim() || null,
        fee_type: createFeeType.value
      },
      skipLoading: true
    })
    toast.add({ title: 'Service published', description: 'Your service is now live.', color: 'success' })
    closeCreate()
    await router.push(`/services/${res.data.id}`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to publish.'
    createError.value = msg
    toast.add({ title: 'Failed', description: msg, color: 'error' })
  } finally {
    createLoading.value = false
  }
}

onMounted(() => fetchList())
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_22%)]" />
      <div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            <span class="h-2 w-2 rounded-full bg-green-500" />
            Community Services
          </div>
          <h1 class="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Find or offer help nearby</h1>
          <p class="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Walking, vet advice, boarding, grooming, and more from your local community.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <UButton v-if="getToken()" size="sm" color="neutral" variant="soft" :icon="showMine ? 'i-lucide-globe' : 'i-lucide-user'" @click="toggleMine">
            {{ showMine ? 'All Services' : 'My Services' }}
          </UButton>
          <UButton size="lg" icon="i-lucide-plus-circle" @click="openCreate">Publish Service</UButton>
        </div>
      </div>
    </section>

    <!-- Category filter -->
    <section class="mt-6 flex flex-wrap gap-2">
      <button
        v-for="cat in CATEGORIES" :key="cat.value"
        class="rounded-full px-4 py-2 text-sm font-bold transition"
        :class="activeCategory === cat.value
          ? 'bg-green-600 text-white shadow-sm'
          : (cat.color || 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
        @click="selectCategory(cat.value)"
      >
        {{ cat.label }}
      </button>
    </section>

    <!-- Unverified safety banner (always visible on list page) -->
    <section class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <div class="flex items-start gap-2">
        <UIcon name="i-lucide-shield-alert" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p>All providers are <strong>unverified</strong> — please take extra caution when contacting and transacting. DoxieLand does not endorse any service listed here.</p>
      </div>
    </section>

    <!-- List -->
    <section class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="svc in serviceList" :key="svc.id"
        class="group cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
        @click="goDetail(svc.id)"
      >
        <div v-if="svc.providerImage" class="h-40 w-full overflow-hidden">
          <img :src="svc.providerImage" alt="provider" class="h-full w-full object-cover transition group-hover:scale-105" />
        </div>
        <div v-else class="flex h-28 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <UIcon name="i-lucide-paw-print" class="h-10 w-10 text-green-400" />
        </div>
        <div class="flex min-h-[180px] flex-col justify-between p-5">
          <div>
            <div class="mb-3 flex flex-wrap gap-2">
              <span
                v-if="CATEGORY_MAP[svc.category]"
                :class="CATEGORY_MAP[svc.category].color"
                class="rounded-full px-2.5 py-1 text-[11px] font-bold"
              >
                {{ CATEGORY_MAP[svc.category].label }}
              </span>
              <span class="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
                {{ svc.feeLabel }}
              </span>
              <span class="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                <UIcon name="i-lucide-shield-off" class="mr-0.5 inline h-3 w-3" /> Unverified
              </span>
              <span v-if="svc.isMine" class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">Yours</span>
            </div>
            <h2 class="line-clamp-1 text-xl font-black leading-tight text-slate-900">{{ svc.title }}</h2>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ svc.description }}</p>
          </div>
          <div class="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-lucide-user" class="h-3.5 w-3.5" />
              <span>{{ svc.nickname }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1"><UIcon name="i-lucide-thumbs-up" class="h-3.5 w-3.5 text-green-600" /> {{ svc.likeCount }}</span>
              <span class="flex items-center gap-1"><UIcon name="i-lucide-thumbs-down" class="h-3.5 w-3.5 text-red-500" /> {{ svc.dislikeCount }}</span>
              <span v-if="svc.serviceArea" class="flex items-center gap-1"><UIcon name="i-lucide-map-pin" class="h-3.5 w-3.5" /> {{ svc.serviceArea }}</span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- Empty -->
    <section v-if="!loading && !serviceList.length" class="mt-8 flex flex-col items-center rounded-[28px] border border-slate-200 bg-white py-16 text-slate-400">
      <UIcon name="i-lucide-inbox" class="h-12 w-12" />
      <p class="mt-4 text-sm font-semibold">{{ showMine ? 'You haven\'t published any services yet.' : 'No services found.' }}</p>
    </section>

    <!-- Pagination -->
    <section v-if="totalPage > 1" class="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-500">Page {{ page }} / {{ totalPage }} · {{ total }} services</p>
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

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      <div class="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.25)] sm:p-7">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black text-slate-900">Publish a Service</h2>
            <p class="mt-1 text-sm text-slate-500">Share what you can offer to the community.</p>
          </div>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeCreate" />
        </div>
        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Category</label>
            <select v-model="createCategory" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
              <option v-for="c in CATEGORIES" :key="c.value" :value="c.value" :disabled="!c.value">{{ c.label || 'Select...' }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Title</label>
            <input v-model="createTitle" placeholder="e.g. Weekend dog walking" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Description</label>
            <textarea v-model="createDesc" rows="5" placeholder="Describe your service in detail..." class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-bold text-slate-700">Phone</label>
              <input v-model="createPhone" placeholder="Phone number" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-bold text-slate-700">WhatsApp</label>
              <input v-model="createWechat" placeholder="WhatsApp number" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-bold text-slate-700">Service Area</label>
              <input v-model="createArea" placeholder="e.g. Brooklyn, NY" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-bold text-slate-700">Available Time</label>
              <select v-model="createTime" class="w-full rounded-2xl border border-green-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                <option value="">Select...</option>
                <option value="Weekdays (Daytime)">Weekdays (Daytime)</option>
                <option value="Weekdays (Evening)">Weekdays (Evening)</option>
                <option value="Weekends">Weekends</option>
                <option value="Flexible">Flexible</option>
                <option value="Mornings">Mornings</option>
                <option value="Afternoons">Afternoons</option>
              </select>
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Fee</label>
            <div class="flex gap-3">
              <button v-for="[val, label] in Object.entries({ free: 'Free', negotiable: 'Negotiable', paid: 'Paid' })" :key="val" class="flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition" :class="createFeeType === val ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'" @click="createFeeType = val">{{ label }}</button>
            </div>
          </div>
          <p v-if="createError" class="text-sm font-semibold text-rose-500">{{ createError }}</p>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <UButton color="neutral" variant="soft" :disabled="createLoading" @click="closeCreate">Cancel</UButton>
          <UButton icon="i-lucide-send" :loading="createLoading" @click="submitService">Publish</UButton>
        </div>
      </div>
    </div>

    <!-- Login Required Modal -->
    <div v-if="showLoginRequiredModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      <div class="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.25)] sm:p-7">
        <div class="text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <UIcon name="i-lucide-lock" class="h-7 w-7 text-amber-600" />
          </div>
          <h2 class="mt-4 text-2xl font-black text-slate-900">Login required</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">Browsing is open, but publishing a service requires an account.</p>
        </div>
        <div class="mt-6 flex justify-center gap-3">
          <UButton variant="ghost" class="text-gray-400 hover:text-gray-600" @click="closeLoginModal">Later</UButton>
          <UButton color="neutral" variant="soft" icon="i-heroicons-arrow-right-on-rectangle" @click="closeLoginModal(); router.push('/login')">Login</UButton>
          <UButton icon="i-lucide-user-plus" @click="closeLoginModal(); router.push('/register')">Register</UButton>
        </div>
      </div>
    </div>
  </main>
</template>
