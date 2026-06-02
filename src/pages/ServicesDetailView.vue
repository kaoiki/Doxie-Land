<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { httpRequest, getToken } from '../utils/http'

const CATEGORY_LABELS: Record<string, string> = {
  walking: 'Walking', veterinary: 'Veterinary', boarding: 'Boarding',
  grooming: 'Grooming', lost_found: 'Lost & Found', meetup: 'Meetup', other: 'Other'
}
const FEE_LABELS: Record<string, string> = { free: 'Free', negotiable: 'Negotiable', paid: 'Paid' }

const MAX_SERVICE_IMAGES = 6

const route = useRoute()
const router = useRouter()
const toast = useToast()

const serviceId = computed(() => String(route.params.id ?? ''))

const svc = ref({
  id: '', user_id: '', nickname: '', avatar: '', category: '', title: '', description: '',
  contact_phone: '', contact_wechat: '', service_area: '', available_time: '', fee_type: '',
  is_verified: false, provider_image: '', is_owner: false, createdAt: ''
})
const serviceImages = ref<Array<{ id: string; url: string }>>([])
const detailLoading = ref(false)
const showContact = ref(false)
const previewImageUrl = ref('')

const showProviderUploader = ref(false)
const providerFile = ref<File | null>(null)
const providerPreview = ref('')
const providerUploading = ref(false)

const showImagesUploader = ref(false)
const pendingImages = ref<Array<{ id: string; file: File; previewUrl: string }>>([])
const imagesUploading = ref(false)
const deletingImageId = ref('')
const imageInputRef = ref<HTMLInputElement | null>(null)

function getUserId() { return localStorage.getItem('doxie_uid') || '' }

function formatDate(v?: string) {
  if (!v) return '-'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function fetchDetail() {
  if (!serviceId.value) return
  detailLoading.value = true
  try {
    const res = await httpRequest<{ code: number; message: string; data: { service: any } }>(`/api/services/${serviceId.value}`)
    const item = res.data?.service
    if (!item) throw new Error('Service not found.')
    const uid = getUserId()
    svc.value = {
      id: item.id, user_id: item.user_id, nickname: item.nickname || 'Doxie Member',
      avatar: item.avatar || '', category: item.category, title: item.title || '',
      description: item.description || '', contact_phone: item.contact_phone || '',
      contact_wechat: item.contact_wechat || '', service_area: item.service_area || '',
      available_time: item.available_time || '', fee_type: item.fee_type || 'free',
      is_verified: item.is_verified || false, provider_image: item.provider_image || '',
      is_owner: !!uid && item.user_id === uid, createdAt: formatDate(item.created_at)
    }
    serviceImages.value = (item.service_images || []).map((img: any) => ({ id: img.id, url: img.url }))
    showContact.value = !!(getToken() && (item.contact_phone || item.contact_wechat))
  } catch (e) {
    toast.add({ title: 'Load failed', description: e instanceof Error ? e.message : 'Failed to load.', color: 'error' })
  } finally { detailLoading.value = false }
}

function goBack() { router.push('/services') }

// Preview image
function openPreview(url: string) { previewImageUrl.value = url }
function closePreview() { previewImageUrl.value = '' }

// Delete service
async function deleteService() {
  try {
    await httpRequest(`/api/services/${serviceId.value}`, { method: 'DELETE' })
    toast.add({ title: 'Deleted', description: 'Service removed.', color: 'success' })
    await router.push('/services')
  } catch (e) {
    toast.add({ title: 'Delete failed', description: e instanceof Error ? e.message : 'Failed.', color: 'error' })
  }
}

// Provider image upload
function selectProviderFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  providerFile.value = file
  providerPreview.value = URL.createObjectURL(file)
}
function removeProviderFile() {
  if (providerPreview.value) URL.revokeObjectURL(providerPreview.value)
  providerFile.value = null; providerPreview.value = ''
}
async function uploadProviderImage() {
  if (!providerFile.value) return
  providerUploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', providerFile.value)
    const res = await httpRequest<{ code: number; data: { url: string } }>(`/api/services/${serviceId.value}/images/provider`, {
      method: 'POST', body: fd
    })
    svc.value.provider_image = res.data.url
    toast.add({ title: 'Uploaded', description: 'Provider image updated.', color: 'success' })
    showProviderUploader.value = false
    removeProviderFile()
  } catch (e) {
    toast.add({ title: 'Upload failed', description: e instanceof Error ? e.message : 'Failed.', color: 'error' })
  } finally { providerUploading.value = false }
}

// Service images upload
function openImagesUploader() { showImagesUploader.value = true }
function closeImagesUploader() {
  pendingImages.value.forEach(i => URL.revokeObjectURL(i.previewUrl))
  pendingImages.value = []; showImagesUploader.value = false
}
function selectImages(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return
  const remain = MAX_SERVICE_IMAGES - serviceImages.value.length
  const accept = files.slice(0, remain)
  accept.forEach((f, i) => {
    pendingImages.value.push({ id: `${Date.now()}-${i}`, file: f, previewUrl: URL.createObjectURL(f) })
  })
  if (files.length > remain) toast.add({ title: 'Too many', description: `Max ${MAX_SERVICE_IMAGES} images.`, color: 'error' })
  input.value = ''
}
function removePending(id: string) {
  const t = pendingImages.value.find(i => i.id === id)
  if (t) URL.revokeObjectURL(t.previewUrl)
  pendingImages.value = pendingImages.value.filter(i => i.id !== id)
}
async function uploadServiceImages() {
  if (!pendingImages.value.length) return
  imagesUploading.value = true
  try {
    const fd = new FormData()
    pendingImages.value.forEach(i => fd.append('files', i.file))
    const res = await httpRequest<{ code: number; data: { images: Array<{ id: string; url: string }>; image_count: number } }>(
      `/api/services/${serviceId.value}/images`, { method: 'POST', body: fd }
    )
    const newImages = (res.data?.images || []).map(img => ({ id: img.id, url: img.url }))
    serviceImages.value = [...serviceImages.value, ...newImages]
    toast.add({ title: 'Uploaded', description: 'Images updated.', color: 'success' })
    closeImagesUploader()
  } catch (e) {
    toast.add({ title: 'Upload failed', description: e instanceof Error ? e.message : 'Failed.', color: 'error' })
  } finally { imagesUploading.value = false }
}

async function deleteServiceImage(imgId: string) {
  deletingImageId.value = imgId
  try {
    const res = await httpRequest<{ code: number; data: { images: Array<{ id: string; url: string }>; image_count: number } }>(
      `/api/services/${serviceId.value}/images/${imgId}`, { method: 'DELETE' }
    )
    serviceImages.value = (res.data?.images || []).map(img => ({ id: img.id, url: img.url }))
    toast.add({ title: 'Deleted', description: 'Image removed.', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Delete failed', description: e instanceof Error ? e.message : 'Failed.', color: 'error' })
  } finally { deletingImageId.value = '' }
}

watch(() => route.params.id, () => { fetchDetail() })
onMounted(() => fetchDetail())
onBeforeUnmount(() => {
  if (providerPreview.value) URL.revokeObjectURL(providerPreview.value)
  pendingImages.value.forEach(i => URL.revokeObjectURL(i.previewUrl))
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
    <!-- Back -->
    <section class="mb-6 flex items-center justify-between gap-3">
      <UButton color="neutral" variant="soft" icon="i-lucide-arrow-left" @click="goBack">Back to Services</UButton>
      <UButton v-if="svc.is_owner" color="error" variant="soft" size="sm" icon="i-lucide-trash-2" @click="deleteService">Delete</UButton>
    </section>

    <!-- Detail card -->
    <section class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <!-- Provider header -->
      <div class="border-b border-slate-100 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <div v-if="svc.provider_image" class="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white shadow-sm">
              <img :src="svc.provider_image" alt="provider" class="h-full w-full object-cover" />
            </div>
            <div v-else class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <UIcon name="i-lucide-paw-print" class="h-8 w-8 text-green-400" />
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl font-black text-slate-900">{{ svc.title }}</h1>
                <span v-if="!svc.is_verified" class="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                  <UIcon name="i-lucide-shield-off" class="mr-0.5 inline h-3 w-3" /> Unverified
                </span>
                <span v-else class="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                  <UIcon name="i-lucide-shield-check" class="mr-0.5 inline h-3 w-3" /> Verified
                </span>
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span class="flex items-center gap-1"><UIcon name="i-lucide-user" class="h-3.5 w-3.5" /> {{ svc.nickname }}</span>
                <span v-if="svc.service_area" class="flex items-center gap-1"><UIcon name="i-lucide-map-pin" class="h-3.5 w-3.5" /> {{ svc.service_area }}</span>
                <span class="flex items-center gap-1"><UIcon name="i-lucide-clock" class="h-3.5 w-3.5" /> {{ svc.createdAt }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span class="rounded-full bg-green-100 px-3 py-1.5 text-sm font-bold text-green-700">{{ FEE_LABELS[svc.fee_type] || svc.fee_type }}</span>
            <span class="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-700">{{ CATEGORY_LABELS[svc.category] || svc.category }}</span>
          </div>
        </div>
      </div>

      <!-- Content + Contact -->
      <div class="px-6 py-6">
        <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <!-- Description -->
          <div class="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
            <div class="mb-3 flex items-center gap-2">
              <UIcon name="i-lucide-scroll-text" class="h-5 w-5 text-slate-500" />
              <h2 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Description</h2>
            </div>
            <p v-if="svc.available_time" class="mb-3 text-sm font-semibold text-slate-700">🕐 {{ svc.available_time }}</p>
            <p class="whitespace-pre-line text-[15px] leading-7 text-slate-700">{{ svc.description }}</p>
          </div>

          <!-- Contact & Safety -->
          <div class="space-y-4">
            <!-- Contact info -->
            <div class="rounded-[24px] border border-slate-200 bg-white p-5">
              <div class="mb-3 flex items-center gap-2">
                <UIcon name="i-lucide-phone" class="h-5 w-5 text-green-500" />
                <h2 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Contact</h2>
              </div>

              <div v-if="showContact" class="space-y-3">
                <div v-if="svc.contact_phone" class="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm">
                  <UIcon name="i-lucide-smartphone" class="h-4 w-4 text-green-600" />
                  <span class="font-semibold text-slate-800">{{ svc.contact_phone }}</span>
                </div>
                <div v-if="svc.contact_wechat" class="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm">
                  <UIcon name="i-lucide-message-circle" class="h-4 w-4 text-green-600" />
                  <span class="font-semibold text-slate-800">{{ svc.contact_wechat }}</span>
                </div>
              </div>

              <div v-else-if="getToken()" class="rounded-2xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
                <UIcon name="i-lucide-eye-off" class="h-5 w-5 mx-auto" />
                <p class="mt-1">Contact info hidden</p>
              </div>

              <button v-else class="w-full rounded-2xl border-2 border-dashed border-green-300 bg-green-50/60 px-4 py-4 text-center text-sm font-bold text-green-700 transition hover:bg-green-50" @click="router.push('/login')">
                <UIcon name="i-lucide-log-in" class="mr-1 inline h-4 w-4" />
                Login to view contact
              </button>
            </div>

            <!-- Safety warning -->
            <div v-if="!svc.is_verified" class="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
              <div class="flex items-start gap-2">
                <UIcon name="i-lucide-shield-alert" class="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h3 class="text-sm font-black text-amber-800">Unverified Provider</h3>
                  <p class="mt-1 text-xs leading-5 text-amber-700">
                    This service provider has not been verified by DoxieLand. Please take extra caution when contacting and transacting. DoxieLand does not endorse or guarantee any service listed here.
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="rounded-[24px] border border-green-200 bg-green-50 p-5">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-shield-check" class="h-5 w-5 text-green-600" />
                <span class="text-sm font-bold text-green-800">Verified Provider</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Provider image management (owner only) -->
    <section v-if="svc.is_owner" class="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-black text-slate-900">Provider Image</h2>
          <UButton size="sm" variant="soft" icon="i-lucide-upload" @click="showProviderUploader = !showProviderUploader">
            {{ svc.provider_image ? 'Change' : 'Upload' }}
          </UButton>
        </div>
      </div>
      <div v-if="showProviderUploader" class="px-6 py-5">
        <div class="rounded-2xl border border-dashed border-green-300 bg-green-50/60 p-5">
          <div v-if="!providerFile" class="text-center">
            <label class="inline-flex cursor-pointer flex-col items-center gap-2">
              <UIcon name="i-lucide-image-plus" class="h-8 w-8 text-green-500" />
              <span class="text-sm font-semibold text-green-700">Click to select an image</span>
              <input type="file" accept="image/*" class="hidden" @change="selectProviderFile" />
            </label>
          </div>
          <div v-else class="flex flex-col items-center gap-3">
            <img :src="providerPreview" class="h-32 w-32 rounded-2xl object-cover shadow-sm" />
            <div class="flex gap-2">
              <UButton size="sm" color="neutral" variant="soft" @click="removeProviderFile">Remove</UButton>
              <UButton size="sm" icon="i-lucide-upload" :loading="providerUploading" @click="uploadProviderImage">Upload</UButton>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="svc.provider_image" class="px-6 py-5">
        <img :src="svc.provider_image" class="h-32 w-32 cursor-pointer rounded-2xl object-cover shadow-sm ring-1 ring-slate-200" @click="openPreview(svc.provider_image)" />
      </div>
    </section>

    <!-- Service images (资质佐证图) -->
    <section class="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-black text-slate-900">Service Images</h2>
            <p class="mt-0.5 text-xs text-slate-500">{{ serviceImages.length }} / {{ MAX_SERVICE_IMAGES }} — Qualification & reference photos</p>
          </div>
          <UButton v-if="svc.is_owner && serviceImages.length < MAX_SERVICE_IMAGES" size="sm" variant="soft" icon="i-lucide-plus" @click="openImagesUploader">Add</UButton>
        </div>
      </div>
      <div class="px-6 py-5">
        <div v-if="serviceImages.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div v-for="img in serviceImages" :key="img.id" class="group relative overflow-hidden rounded-2xl border border-slate-200">
            <img :src="img.url" class="h-40 w-full cursor-pointer object-cover" @click="openPreview(img.url)" />
            <div v-if="svc.is_owner" class="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
              <UButton color="error" variant="solid" size="xs" icon="i-lucide-trash-2" :loading="deletingImageId === img.id" @click="deleteServiceImage(img.id)" />
            </div>
          </div>
        </div>
        <div v-else class="flex h-32 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400">No images yet</div>
      </div>
    </section>

    <!-- Upload images modal -->
    <UModal v-model:open="showImagesUploader" :ui="{ content: 'max-w-2xl rounded-[28px]' }">
      <template #content>
        <div class="bg-white p-6 sm:p-7">
          <div class="mb-5 flex items-start justify-between">
            <div>
              <h2 class="text-2xl font-black text-slate-900">Add Service Images</h2>
              <p class="mt-1 text-sm text-slate-500">Qualification & reference photos. Max {{ MAX_SERVICE_IMAGES }} total.</p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeImagesUploader" />
          </div>
          <input ref="imageInputRef" type="file" accept="image/*" multiple class="hidden" @change="selectImages" />
          <div class="rounded-2xl border border-dashed border-green-300 bg-green-50/60 p-5 text-center">
            <UButton variant="soft" color="primary" size="sm" icon="i-lucide-upload" @click="imageInputRef?.click()">Choose Images</UButton>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3">
            <div v-for="item in pendingImages" :key="item.id" class="group relative overflow-hidden rounded-2xl border border-slate-200">
              <img :src="item.previewUrl" class="h-40 w-full object-cover" />
              <div class="absolute right-2 top-2"><UButton color="error" variant="solid" size="xs" icon="i-lucide-x" @click="removePending(item.id)" /></div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <UButton color="neutral" variant="soft" @click="closeImagesUploader">Cancel</UButton>
            <UButton icon="i-lucide-send" :disabled="!pendingImages.length" :loading="imagesUploading" @click="uploadServiceImages">Upload</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Image preview overlay -->
    <div v-if="previewImageUrl" class="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 px-4" @click="closePreview">
      <div class="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center">
        <img :src="previewImageUrl" class="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" @click.stop />
        <button class="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-slate-100" @click="closePreview">
          <UIcon name="i-lucide-x" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </main>
</template>
