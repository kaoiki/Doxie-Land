<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { httpRequest, getToken } from '../utils/http'

type ApiReviewDetail = {
  id: string
  title: string
  content: string
  status: number
  join_count: number
  images: Array<{ id: string; url: string }>
  image_count: number
  created_at: string
  user_id: string
}

type ReviewImage = {
  id: string
  url: string
}

type PendingImage = {
  id: string
  file: File
  previewUrl: string
}

const MAX_IMAGES = 4

const route = useRoute()
const router = useRouter()
const toast = useToast()

const reviewId = computed(() => String(route.params.id ?? ''))

const review = ref({
  id: reviewId.value,
  title: '',
  content: '',
  status: 0,
  joinCount: 0,
  createdAt: '-',
  isMine: false
})

const images = ref<ReviewImage[]>([])
const joined = ref(false)
const detailLoading = ref(false)

const showImageUploader = ref(false)
const imageInputRef = ref<HTMLInputElement | null>(null)
const pendingImages = ref<PendingImage[]>([])
const imageUploading = ref(false)
const deletingImageId = ref('')

const previewImageUrl = ref('')
const joinLoading = ref(false)

function getLoginStatus() {
  return !!getToken()
}

function getUserId() {
  return localStorage.getItem('doxie_uid') || ''
}

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

const statusLabel = computed(() => {
  return review.value.status === 1 ? 'Group Buy Open' : 'Review'
})

const remainingImageSlots = computed(() => {
  return Math.max(0, MAX_IMAGES - images.value.length)
})

const imageSlots = computed(() => {
  const slots: Array<
    { type: 'image'; image: ReviewImage } | { type: 'add' } | { type: 'empty'; key: string }
  > = images.value.map((image) => ({ type: 'image', image }))

  if (review.value.isMine) {
    while (slots.length < MAX_IMAGES) {
      slots.push(
        slots.length === images.value.length
          ? { type: 'add' }
          : { type: 'empty', key: `empty-${slots.length}` }
      )
    }
  }

  return slots
})

function applyDetail(item: ApiReviewDetail) {
  const uid = getUserId()
  review.value = {
    id: item.id || reviewId.value,
    title: item.title || '',
    content: item.content || '',
    status: item.status ?? 0,
    joinCount: item.join_count || 0,
    createdAt: formatDateTime(item.created_at),
    isMine: !!uid && item.user_id === uid
  }
  images.value = (item.images || []).map((img) => ({ id: img.id, url: img.url }))
}

function applyImageResult(data?: { images?: Array<{ id: string; url: string }>; image_count?: number }) {
  images.value = (data?.images || []).map((img) => ({ id: img.id, url: img.url }))
}

async function fetchDetail() {
  if (!reviewId.value) return
  detailLoading.value = true

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: { review: ApiReviewDetail }
    }>(`/api/shop/reviews/${reviewId.value}`)

    if (!res.data?.review) {
      throw new Error('Review not found.')
    }
    applyDetail(res.data.review)
  } catch (error) {
    toast.add({
      title: 'Load failed',
      description: error instanceof Error ? error.message : 'Failed to load review.',
      color: 'error'
    })
  } finally {
    detailLoading.value = false
  }
}

async function fetchJoinStatus() {
  if (!getLoginStatus() || !reviewId.value) return

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: { joined: boolean }
    }>(`/api/shop/reviews/${reviewId.value}/join/status`)
    joined.value = res.data?.joined ?? false
  } catch {
    // not logged in or error — leave as false
  }
}

async function toggleJoin() {
  if (!getLoginStatus()) {
    toast.add({ title: 'Login required', description: 'Please log in to join.', color: 'error' })
    return
  }

  joinLoading.value = true

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: { joined: boolean; join_count: number }
    }>(`/api/shop/reviews/${reviewId.value}/join`, {
      method: 'POST',
      skipLoading: true
    })

    joined.value = res.data.joined
    review.value.joinCount = res.data.join_count
  } catch (error) {
    toast.add({
      title: 'Failed',
      description: error instanceof Error ? error.message : 'Action failed.',
      color: 'error'
    })
  } finally {
    joinLoading.value = false
  }
}

function openPreview(url: string) {
  previewImageUrl.value = url
}

function closePreview() {
  previewImageUrl.value = ''
}

function goBack() {
  router.push('/shop')
}

// Image upload

function openImageUploader() {
  if (remainingImageSlots.value <= 0) {
    toast.add({ title: 'Limit reached', description: `Maximum ${MAX_IMAGES} images.`, color: 'error' })
    return
  }
  showImageUploader.value = true
}

function closeImageUploader() {
  revokePending()
  showImageUploader.value = false
  if (imageInputRef.value) imageInputRef.value.value = ''
}

function revokePending() {
  pendingImages.value.forEach((item) => URL.revokeObjectURL(item.previewUrl))
  pendingImages.value = []
}

function triggerImageSelect() {
  if (remainingImageSlots.value <= 0) {
    toast.add({ title: 'Limit reached', description: `Maximum ${MAX_IMAGES} images.`, color: 'error' })
    return
  }
  imageInputRef.value?.click()
}

function onSelectImages(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (!files.length) return

  const allowedCount = remainingImageSlots.value - pendingImages.value.length
  if (allowedCount <= 0) {
    toast.add({ title: 'Limit reached', description: `Maximum ${MAX_IMAGES} images.`, color: 'error' })
    input.value = ''
    return
  }

  const accepted = files.slice(0, allowedCount)
  pendingImages.value.push(
    ...accepted.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file)
    }))
  )

  if (files.length > accepted.length) {
    toast.add({ title: 'Too many', description: `Only ${allowedCount} more allowed.`, color: 'error' })
  }

  input.value = ''
}

function removePendingImage(id: string) {
  const target = pendingImages.value.find((item) => item.id === id)
  if (target) URL.revokeObjectURL(target.previewUrl)
  pendingImages.value = pendingImages.value.filter((item) => item.id !== id)
}

async function uploadImages() {
  if (!pendingImages.value.length) {
    toast.add({ title: 'No images', description: 'Select at least one image.', color: 'error' })
    return
  }

  const userId = getUserId()
  if (!userId) {
    toast.add({ title: 'Upload failed', description: 'User id missing.', color: 'error' })
    return
  }

  imageUploading.value = true

  try {
    const formData = new FormData()
    formData.append('user_id', userId)
    pendingImages.value.forEach((item) => formData.append('files', item.file))

    const res = await httpRequest<{
      code: number
      message: string
      data: { images: Array<{ id: string; url: string }>; image_count: number }
    }>(`/api/shop/reviews/${reviewId.value}/images`, {
      method: 'POST',
      body: formData,
      skipLoading: false
    })

    applyImageResult(res.data)
    toast.add({ title: 'Uploaded', description: 'Images updated.', color: 'success' })
    closeImageUploader()
  } catch (error) {
    toast.add({
      title: 'Upload failed',
      description: error instanceof Error ? error.message : 'Failed to upload.',
      color: 'error'
    })
  } finally {
    imageUploading.value = false
  }
}

async function deleteImage(imageId: string) {
  const userId = getUserId()
  if (!userId) return

  deletingImageId.value = imageId

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: { images: Array<{ id: string; url: string }>; image_count: number }
    }>(`/api/shop/reviews/${reviewId.value}/images/${imageId}?user_id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      skipLoading: false
    })

    applyImageResult(res.data)
    toast.add({ title: 'Deleted', description: 'Image removed.', color: 'success' })
  } catch (error) {
    toast.add({
      title: 'Delete failed',
      description: error instanceof Error ? error.message : 'Failed to delete.',
      color: 'error'
    })
  } finally {
    deletingImageId.value = ''
  }
}

async function deleteReview() {
  try {
    await httpRequest(`/api/shop/reviews/${reviewId.value}`, {
      method: 'DELETE',
      skipLoading: false
    })
    toast.add({ title: 'Deleted', description: 'Review removed.', color: 'success' })
    await router.push('/shop')
  } catch (error) {
    toast.add({
      title: 'Delete failed',
      description: error instanceof Error ? error.message : 'Failed to delete.',
      color: 'error'
    })
  }
}

async function initPage() {
  await fetchDetail()
  await fetchJoinStatus()
}

watch(() => route.params.id, () => {
  closeImageUploader()
  initPage()
})

onMounted(() => {
  initPage()
})

onBeforeUnmount(() => {
  revokePending()
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
    <section class="mb-6 flex items-center justify-between gap-3">
      <UButton color="neutral" variant="soft" icon="i-lucide-arrow-left" @click="goBack">
        Back to Reviews
      </UButton>

      <UButton
        v-if="review.isMine"
        color="error"
        variant="soft"
        size="sm"
        icon="i-lucide-trash-2"
        @click="deleteReview"
      >
        Delete
      </UButton>
    </section>

    <section class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-5 py-6 sm:px-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700"
              >
                {{ statusLabel }}
              </span>
              <span
                class="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700"
              >
                <UIcon name="i-lucide-users" class="mr-0.5 inline h-3 w-3" />
                {{ review.joinCount }} joined
              </span>
              <span
                v-if="review.isMine"
                class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
              >
                Your review
              </span>
            </div>

            <h1 class="mt-3 text-3xl font-black leading-tight text-slate-900">
              {{ review.title }}
            </h1>

            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-users" class="h-4 w-4" />
                <span>{{ review.joinCount }} joined</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-clock-3" class="h-4 w-4" />
                <span>{{ review.createdAt }}</span>
              </div>
            </div>
          </div>

          <UButton
            :color="joined ? 'error' : 'primary'"
            :variant="joined ? 'soft' : 'solid'"
            :icon="joined ? 'i-lucide-user-minus' : 'i-lucide-user-plus'"
            :loading="joinLoading"
            @click="toggleJoin"
          >
            {{ joined ? 'Leave' : 'Join' }}
          </UButton>
        </div>
      </div>

      <div class="px-5 py-6 sm:px-6">
        <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div class="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
            <div class="mb-3 flex items-center gap-2">
              <UIcon name="i-lucide-scroll-text" class="h-5 w-5 text-slate-500" />
              <h2 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Review</h2>
            </div>
            <p class="whitespace-pre-line text-[15px] leading-7 text-slate-700">
              {{ review.content }}
            </p>
          </div>

          <div class="rounded-[24px] border border-slate-200 bg-white p-5">
            <div class="mb-3 flex items-center gap-2">
              <UIcon name="i-lucide-images" class="h-5 w-5 text-violet-500" />
              <h2 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Images</h2>
            </div>

            <div v-if="imageSlots.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <template v-for="slot in imageSlots" :key="slot.type === 'image' ? slot.image.id : slot.type === 'add' ? 'add-slot' : slot.key">
                <div
                  v-if="slot.type === 'image'"
                  class="group relative overflow-hidden rounded-2xl border border-slate-200"
                >
                  <img
                    :src="slot.image.url"
                    alt="review image"
                    class="h-44 w-full cursor-pointer object-cover"
                    @click="openPreview(slot.image.url)"
                  />
                  <div
                    v-if="review.isMine"
                    class="absolute right-2 top-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <UButton
                      color="error"
                      variant="solid"
                      size="xs"
                      icon="i-lucide-trash-2"
                      :loading="deletingImageId === slot.image.id"
                      @click="deleteImage(slot.image.id)"
                    />
                  </div>
                </div>

                <button
                  v-else-if="slot.type === 'add'"
                  type="button"
                  class="flex h-44 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300 bg-violet-50/60 text-violet-700 transition hover:bg-violet-50"
                  @click="openImageUploader"
                >
                  <UIcon name="i-lucide-image-plus" class="h-7 w-7" />
                  <span class="mt-2 text-sm font-bold">Add Image</span>
                  <span class="mt-1 text-xs text-violet-600">
                    {{ remainingImageSlots }} slot{{ remainingImageSlots > 1 ? 's' : '' }} left
                  </span>
                </button>

                <div
                  v-else
                  class="flex h-44 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-300"
                >
                  Empty Slot
                </div>
              </template>
            </div>

            <div
              v-else
              class="flex h-40 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400"
            >
              No images yet
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image upload modal -->
    <UModal v-model:open="showImageUploader" :ui="{ content: 'max-w-2xl rounded-[28px]' }">
      <template #content>
        <div class="bg-white p-6 sm:p-7">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-black text-slate-900">Add images</h2>
              <p class="mt-1 text-sm text-slate-500">
                Maximum {{ MAX_IMAGES }} images. {{ remainingImageSlots }} slot{{ remainingImageSlots > 1 ? 's' : '' }} left.
              </p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeImageUploader" />
          </div>

          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="onSelectImages"
          />

          <div class="rounded-[24px] border border-dashed border-violet-300 bg-violet-50/60 p-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="text-base font-black text-slate-900">Select images</h3>
                <p class="mt-1 text-sm text-slate-600">Preview before upload.</p>
              </div>
              <UButton
                variant="soft"
                color="primary"
                size="sm"
                icon="i-lucide-upload"
                :disabled="remainingImageSlots - pendingImages.length <= 0"
                @click="triggerImageSelect"
              >
                Choose Image
              </UButton>
            </div>
          </div>

          <div class="mt-5">
            <div v-if="pendingImages.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                v-for="item in pendingImages"
                :key="item.id"
                class="group relative overflow-hidden rounded-2xl border border-slate-200"
              >
                <img :src="item.previewUrl" alt="preview" class="h-44 w-full object-cover" />
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3">
                  <p class="truncate text-xs font-semibold text-white">{{ item.file.name }}</p>
                </div>
                <div class="absolute right-2 top-2">
                  <UButton
                    color="error"
                    variant="solid"
                    size="xs"
                    icon="i-lucide-trash-2"
                    @click="removePendingImage(item.id)"
                  />
                </div>
              </div>
            </div>
            <div
              v-else
              class="flex h-44 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-400"
            >
              No image selected
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <UButton color="neutral" variant="soft" @click="closeImageUploader">Cancel</UButton>
            <UButton
              icon="i-lucide-send"
              :disabled="!pendingImages.length"
              :loading="imageUploading"
              @click="uploadImages"
            >
              Upload
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Image preview overlay -->
    <div
      v-if="previewImageUrl"
      class="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 px-4"
      @click="closePreview"
    >
      <div class="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center">
        <img
          :src="previewImageUrl"
          alt="preview"
          class="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
          @click.stop
        />
        <button
          class="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-slate-100"
          @click="closePreview"
        >
          <UIcon name="i-lucide-x" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </main>
</template>
