<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { httpRequest } from '../utils/http'

type ApiPostDetail = {
  id: string
  title: string
  content: string
  created_at?: string
  user_id?: string
  comment_count?: number
  image_count?: number
  images?: Array<{
    id: string
    url: string
    path?: string
  }>
}

type PostDetail = {
  id: string
  title: string
  author: string
  content: string
  createdAt: string
  commentCount: number
  imageCount: number
  isMine: boolean
}

type PostImage = {
  id: string
  url: string
}

type CommentItem = {
  id: string
  author: string
  content: string
  createdAt: string
  isMine: boolean
}

type ApiCommentItem = {
  id: string
  post_id: string
  content: string
  user_id: string
  like_count?: number
  created_at?: string
  updated_at?: string
}

type PendingImage = {
  id: string
  file: File
  previewUrl: string
}

const MAX_POST_IMAGES = 4

const route = useRoute()
const router = useRouter()
const toast = useToast()

const postId = computed(() => String(route.params.id ?? ''))

const post = ref<PostDetail>({
  id: postId.value,
  title: '',
  author: '',
  content: '',
  createdAt: '-',
  commentCount: 0,
  imageCount: 0,
  isMine: false
})

const images = ref<PostImage[]>([])
const comments = ref<CommentItem[]>([])

const commentInput = ref('')
const showComposer = ref(false)
const showImageUploader = ref(false)

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

const detailLoading = ref(false)
const commentLoading = ref(false)
const commentSubmitting = ref(false)
const commentDeletingId = ref('')

const imageInputRef = ref<HTMLInputElement | null>(null)
const pendingImages = ref<PendingImage[]>([])
const imageUploading = ref(false)
const deletingImageId = ref('')

function getLoginStatus() {
  return (
    localStorage.getItem('doxie_loginstatus') === 'true' ||
    localStorage.getItem('doxie_loginStatus') === 'true'
  )
}

function getCurrentUserId() {
  return (
    localStorage.getItem('doxie_uid') ||
    localStorage.getItem('uid') ||
    ''
  )
}

function formatDateTime(value?: string) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

const remainingImageSlots = computed(() => {
  const remain = MAX_POST_IMAGES - images.value.length
  return remain > 0 ? remain : 0
})

const canAddMoreImages = computed(() => {
  return post.value.isMine && remainingImageSlots.value > 0
})

const imageSlots = computed(() => {
  const slots: Array<
    | { type: 'image'; image: PostImage }
    | { type: 'add' }
    | { type: 'empty'; key: string }
  > = images.value.map((image) => ({ type: 'image', image }))

  if (post.value.isMine) {
    while (slots.length < MAX_POST_IMAGES) {
      slots.push(
        slots.length === images.value.length
          ? { type: 'add' }
          : { type: 'empty', key: `empty-${slots.length}` }
      )
    }
  }

  return slots
})

function mapCommentItem(item: ApiCommentItem): CommentItem {
  const currentUserId = getCurrentUserId()

  return {
    id: item.id,
    author: item.user_id || 'Doxie Member',
    content: item.content || '',
    createdAt: formatDateTime(item.created_at),
    isMine: !!currentUserId && item.user_id === currentUserId
  }
}

function applyPostDetail(item: ApiPostDetail) {
  const currentUserId = getCurrentUserId()
  const apiImages = Array.isArray(item.images) ? item.images : []

  post.value = {
    id: item.id || postId.value,
    title: item.title || '',
    author: item.user_id || 'Doxie Member',
    content: item.content || '',
    createdAt: formatDateTime(item.created_at),
    commentCount: item.comment_count || 0,
    imageCount: item.image_count ?? apiImages.length,
    isMine: !!currentUserId && item.user_id === currentUserId
  }

  images.value = apiImages.map((image, index) => ({
    id: image.id || `image-${index + 1}`,
    url: image.url
  }))
}

function applyImageResult(data?: { images?: Array<{ id: string; url: string }>; image_count?: number }) {
  const apiImages = Array.isArray(data?.images) ? data.images : []
  images.value = apiImages.map((image, index) => ({
    id: image.id || `image-${index + 1}`,
    url: image.url
  }))
  post.value.imageCount = data?.image_count ?? images.value.length
}

async function fetchPostDetail() {
  if (!postId.value) return

  detailLoading.value = true

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: {
        post: ApiPostDetail
      }
    }>(`/api/posts/${postId.value}`, {
      skipLoading: false
    })

    const item = res.data?.post
    if (!item) {
      throw new Error('Post detail not found.')
    }

    applyPostDetail(item)
  } catch (error) {
    console.error('fetch post detail failed:', error)

    post.value = {
      id: postId.value,
      title: '',
      author: '',
      content: '',
      createdAt: '-',
      commentCount: 0,
      imageCount: 0,
      isMine: false
    }
    images.value = []

    toast.add({
      title: 'Post failed',
      description: error instanceof Error ? error.message : 'Failed to load post detail.',
      color: 'error'
    })
  } finally {
    detailLoading.value = false
  }
}

async function fetchComments(targetPage = 1) {
  if (!postId.value) return

  commentLoading.value = true

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: {
        items: ApiCommentItem[]
        total: number
        total_page: number
        page: number
        page_size: number
      }
    }>(`/api/comments?post_id=${postId.value}&page=${targetPage}&page_size=${pageSize.value}`, {
      skipLoading: false
    })

    const data = res.data || {
      items: [],
      total: 0,
      total_page: 1,
      page: targetPage,
      page_size: pageSize.value
    }

    comments.value = (data.items || []).map(mapCommentItem)
    total.value = data.total || 0
    page.value = data.page || targetPage
    pageSize.value = data.page_size || pageSize.value

    post.value.commentCount = total.value
  } catch (error) {
    console.error('fetch comments failed:', error)
    comments.value = []
    total.value = 0
    page.value = targetPage

    toast.add({
      title: 'Comments failed',
      description: error instanceof Error ? error.message : 'Failed to load comments.',
      color: 'error'
    })
  } finally {
    commentLoading.value = false
  }
}

function goBack() {
  router.push('/forum')
}

function toggleComposer() {
  showComposer.value = !showComposer.value
}

function openImageUploader() {
  if (!canAddMoreImages.value) {
    toast.add({
      title: 'Image limit reached',
      description: `Maximum ${MAX_POST_IMAGES} images per post.`,
      color: 'error'
    })
    return
  }

  showImageUploader.value = true
}

function revokePendingImages() {
  pendingImages.value.forEach((item) => {
    URL.revokeObjectURL(item.previewUrl)
  })
  pendingImages.value = []
}

function closeImageUploader() {
  revokePendingImages()
  showImageUploader.value = false
  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
}

function triggerImageSelect() {
  if (!canAddMoreImages.value) {
    toast.add({
      title: 'Image limit reached',
      description: `Maximum ${MAX_POST_IMAGES} images per post.`,
      color: 'error'
    })
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
    toast.add({
      title: 'Image limit reached',
      description: `Maximum ${MAX_POST_IMAGES} images per post.`,
      color: 'error'
    })
    input.value = ''
    return
  }

  const accepted = files.slice(0, allowedCount)
  const exceeded = files.length > accepted.length

  const nextItems = accepted.map((file, index) => ({
    id: `${Date.now()}-${index}-${file.name}`,
    file,
    previewUrl: URL.createObjectURL(file)
  }))

  pendingImages.value.push(...nextItems)

  if (exceeded) {
    toast.add({
      title: 'Too many images',
      description: `Only ${allowedCount} more image${allowedCount > 1 ? 's are' : ' is'} allowed.`,
      color: 'error'
    })
  }

  input.value = ''
}

function removePendingImage(id: string) {
  const target = pendingImages.value.find((item) => item.id === id)
  if (target) {
    URL.revokeObjectURL(target.previewUrl)
  }
  pendingImages.value = pendingImages.value.filter((item) => item.id !== id)
}

async function submitComment() {
  if (!getLoginStatus()) {
    toast.add({
      title: 'Login required',
      description: 'Please log in before replying.',
      color: 'error'
    })
    return
  }

  if (!commentInput.value.trim()) return

  const userId = getCurrentUserId()
  if (!userId) {
    toast.add({
      title: 'Comment failed',
      description: 'User id is missing.',
      color: 'error'
    })
    return
  }

  commentSubmitting.value = true

  try {
    await httpRequest('/api/comments', {
      method: 'POST',
      body: {
        post_id: postId.value,
        content: commentInput.value.trim(),
        user_id: userId
      },
      skipLoading: false
    })

    toast.add({
      title: 'Reply posted',
      description: 'Your comment has been published successfully.',
      color: 'success'
    })

    commentInput.value = ''
    showComposer.value = false
    page.value = 1
    await fetchComments(1)
  } catch (error) {
    console.error('create comment failed:', error)

    toast.add({
      title: 'Reply failed',
      description: error instanceof Error ? error.message : 'Failed to publish comment.',
      color: 'error'
    })
  } finally {
    commentSubmitting.value = false
  }
}

async function deleteComment(commentId: string) {
  commentDeletingId.value = commentId

  try {
    await httpRequest(`/api/comments/${commentId}`, {
      method: 'DELETE',
      skipLoading: false
    })

    toast.add({
      title: 'Comment deleted',
      description: 'The comment has been removed successfully.',
      color: 'success'
    })

    const nextPage =
      comments.value.length === 1 && page.value > 1 ? page.value - 1 : page.value

    await fetchComments(nextPage)
  } catch (error) {
    console.error('delete comment failed:', error)

    toast.add({
      title: 'Delete failed',
      description: error instanceof Error ? error.message : 'Failed to delete comment.',
      color: 'error'
    })
  } finally {
    commentDeletingId.value = ''
  }
}

function mockDeletePost() {
  console.log('delete post', post.value.id)
}

async function mockUploadImage() {
  if (!pendingImages.value.length) {
    toast.add({
      title: 'No images selected',
      description: 'Please choose at least one image first.',
      color: 'error'
    })
    return
  }

  const userId = getCurrentUserId()
  if (!userId) {
    toast.add({
      title: 'Upload failed',
      description: 'User id is missing.',
      color: 'error'
    })
    return
  }

  imageUploading.value = true

  try {
    const formData = new FormData()
    formData.append('user_id', userId)

    pendingImages.value.forEach((item) => {
      formData.append('files', item.file)
    })

    const res = await httpRequest<{
      code: number
      message: string
      data: {
        images: Array<{ id: string; url: string }>
        image_count: number
      }
    }>(`/api/posts/${postId.value}/images`, {
      method: 'POST',
      body: formData,
      skipLoading: false
    })

    applyImageResult(res.data)

    toast.add({
      title: 'Images uploaded',
      description: 'Post images have been updated successfully.',
      color: 'success'
    })

    closeImageUploader()
  } catch (error) {
    console.error('upload image failed:', error)
    toast.add({
      title: 'Upload failed',
      description: error instanceof Error ? error.message : 'Failed to upload images.',
      color: 'error'
    })
  } finally {
    imageUploading.value = false
  }
}

function mockCancelImage() {
  closeImageUploader()
}

async function mockDeleteImage(imageId: string) {
  const userId = getCurrentUserId()
  if (!userId) {
    toast.add({
      title: 'Delete failed',
      description: 'User id is missing.',
      color: 'error'
    })
    return
  }

  deletingImageId.value = imageId

  try {
    const res = await httpRequest<{
      code: number
      message: string
      data: {
        images: Array<{ id: string; url: string }>
        image_count: number
      }
    }>(`/api/posts/${postId.value}/images/${imageId}?user_id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      skipLoading: false
    })

    applyImageResult(res.data)

    toast.add({
      title: 'Image deleted',
      description: 'The image has been removed successfully.',
      color: 'success'
    })
  } catch (error) {
    console.error('delete image failed:', error)
    toast.add({
      title: 'Delete failed',
      description: error instanceof Error ? error.message : 'Failed to delete image.',
      color: 'error'
    })
  } finally {
    deletingImageId.value = ''
  }
}

function goPrev() {
  if (page.value <= 1 || commentLoading.value) return
  fetchComments(page.value - 1)
}

function goNext() {
  if (page.value >= totalPage.value || commentLoading.value) return
  fetchComments(page.value + 1)
}

function goPage(targetPage: number) {
  if (targetPage < 1 || targetPage > totalPage.value || commentLoading.value) return
  fetchComments(targetPage)
}

async function initPage() {
  page.value = 1
  await fetchPostDetail()
  await fetchComments(1)
}

watch(
  () => route.params.id,
  () => {
    closeImageUploader()
    initPage()
  }
)

onMounted(() => {
  initPage()
})

onBeforeUnmount(() => {
  revokePendingImages()
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
    <section class="mb-6 flex items-center justify-between gap-3">
      <UButton
        color="neutral"
        variant="soft"
        icon="i-lucide-arrow-left"
        @click="goBack"
      >
        Back to Forum
      </UButton>

      <div class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
        Topic ID: {{ postId }}
      </div>
    </section>

    <section class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-5 py-6 sm:px-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
              >
                Topic detail
              </span>
              <span
                v-if="post.isMine"
                class="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
              >
                Your post
              </span>
              <span
                v-if="post.imageCount > 0"
                class="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700"
              >
                {{ post.imageCount }} images
              </span>
            </div>

            <h1 class="mt-3 text-3xl font-black leading-tight text-slate-900">
              {{ post.title }}
            </h1>

            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-user-round" class="h-4 w-4" />
                <span>{{ post.author }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-clock-3" class="h-4 w-4" />
                <span>{{ post.createdAt }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-message-circle" class="h-4 w-4" />
                <span>{{ post.commentCount }} comments</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              v-if="post.isMine"
              variant="soft"
              color="error"
              size="sm"
              icon="i-lucide-trash-2"
              @click="mockDeletePost"
            />
          </div>
        </div>
      </div>

      <div class="px-5 py-6 sm:px-6">
        <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div class="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
            <div class="mb-3 flex items-center gap-2">
              <UIcon name="i-lucide-scroll-text" class="h-5 w-5 text-slate-500" />
              <h2 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Post Content
              </h2>
            </div>

            <p class="whitespace-pre-line text-[15px] leading-7 text-slate-700">
              {{ post.content }}
            </p>
          </div>

          <div class="rounded-[24px] border border-slate-200 bg-white p-5">
            <div class="mb-3 flex items-center gap-2">
              <UIcon name="i-lucide-images" class="h-5 w-5 text-violet-500" />
              <h2 class="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Images
              </h2>
            </div>

            <div v-if="imageSlots.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <template v-for="slot in imageSlots" :key="slot.type === 'image' ? slot.image.id : slot.type === 'add' ? 'add-slot' : slot.key">
                <div
                  v-if="slot.type === 'image'"
                  class="group relative overflow-hidden rounded-2xl border border-slate-200"
                >
                  <img :src="slot.image.url" alt="post image" class="h-44 w-full object-cover" />

                  <div
                    v-if="post.isMine"
                    class="absolute right-2 top-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <UButton
                      color="error"
                      variant="solid"
                      size="xs"
                      icon="i-lucide-trash-2"
                      :loading="deletingImageId === slot.image.id"
                      @click="mockDeleteImage(slot.image.id)"
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

    <section class="mt-6 rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-2xl font-black text-slate-900">Comments</h2>
            <p class="mt-1 text-sm text-slate-500">Replies stay focused on this topic only.</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <UButton
              variant="soft"
              color="primary"
              size="sm"
              icon="i-lucide-message-square-plus"
              @click="toggleComposer"
            >
              Write Comment
            </UButton>
            <UButton
              variant="soft"
              color="neutral"
              size="sm"
              icon="i-lucide-refresh-cw"
              :loading="commentLoading"
              @click="fetchComments(page)"
            >
              Refresh
            </UButton>
          </div>
        </div>
      </div>

      <div class="px-5 py-6 sm:px-6">
        <div
          v-if="showComposer"
          class="mb-5 rounded-[24px] border border-primary/20 bg-primary/5 p-4 sm:p-5"
        >
          <div class="flex items-start gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary"
            >
              Y
            </div>

            <div class="min-w-0 flex-1">
              <p class="mb-3 text-sm font-semibold text-slate-700">Reply to this topic</p>
              <UTextarea
                v-model="commentInput"
                :rows="5"
                placeholder="Write a clear and useful comment..."
                class="w-full"
              />

              <div class="mt-3 flex flex-wrap gap-2">
                <UButton
                  icon="i-lucide-send-horizontal"
                  :loading="commentSubmitting"
                  @click="submitComment"
                >
                  Publish Comment
                </UButton>
                <UButton
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-x"
                  @click="showComposer = false"
                >
                  Cancel
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <div v-if="commentLoading" class="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500 sm:p-5">
          Loading comments...
        </div>

        <div v-else-if="!comments.length" class="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500 sm:p-5">
          No comments yet.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="comment in comments"
            :key="comment.id"
            class="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:bg-slate-50 sm:p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-sm font-black text-slate-900">{{ comment.author }}</p>
                  <span
                    v-if="comment.isMine"
                    class="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"
                  >
                    Your comment
                  </span>
                  <span class="text-xs text-slate-400">{{ comment.createdAt }}</span>
                </div>

                <p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
                  {{ comment.content }}
                </p>
              </div>

              <div class="shrink-0">
                <UButton
                  v-if="comment.isMine"
                  color="error"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-trash-2"
                  :loading="commentDeletingId === comment.id"
                  @click="deleteComment(comment.id)"
                >
                  Delete
                </UButton>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-500">
            Page {{ page }} / {{ totalPage }} · {{ total }} total comments
          </p>

          <div class="flex flex-wrap gap-2">
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              icon="i-lucide-chevron-left"
              :disabled="page <= 1 || commentLoading"
              @click="goPrev"
            >
              Prev
            </UButton>

            <UButton
              v-if="visiblePages[0] > 1"
              color="neutral"
              variant="soft"
              size="sm"
              :disabled="commentLoading"
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
              :disabled="commentLoading"
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
              :disabled="commentLoading"
              @click="goPage(totalPage)"
            >
              {{ totalPage }}
            </UButton>

            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              trailing-icon="i-lucide-chevron-right"
              :disabled="page >= totalPage || commentLoading"
              @click="goNext"
            >
              Next
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <UModal v-model:open="showImageUploader" :ui="{ content: 'max-w-2xl rounded-[28px]' }">
      <template #content>
        <div class="bg-white p-6 sm:p-7">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-black text-slate-900">Add images</h2>
              <p class="mt-1 text-sm text-slate-500">
                Maximum {{ MAX_POST_IMAGES }} images per post. You can add {{ remainingImageSlots }} more.
              </p>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              @click="closeImageUploader"
            />
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
                <h3 class="text-base font-black text-slate-900">Select images to upload</h3>
                <p class="mt-1 text-sm text-slate-600">
                  Preview before upload. Cancel will clear this selection.
                </p>
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
              No image selected yet
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <UButton
              color="neutral"
              variant="soft"
              @click="mockCancelImage"
            >
              Cancel
            </UButton>
            <UButton
              icon="i-lucide-send"
              :disabled="!pendingImages.length"
              :loading="imageUploading"
              @click="mockUploadImage"
            >
              Upload
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </main>
</template>