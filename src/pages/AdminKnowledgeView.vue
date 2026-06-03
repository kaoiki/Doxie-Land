<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { httpRequest, getToken } from '../utils/http'

const CATEGORIES = [
  { code: 'prepare', name: 'Prepare' },
  { code: 'new_owner', name: 'New Owner' },
  { code: 'common', name: 'Common' },
  { code: 'health', name: 'Health & Risks' },
  { code: 'practice', name: 'My Practice' }
]

const SOURCE_TYPES = [
  { value: 'official', label: 'Official' },
  { value: 'practice', label: 'My Practice' },
  { value: 'review', label: 'Review' },
  { value: 'reference', label: 'Reference' }
]

const ADMIN_UID = 'f1ce03a5-4aa5-4531-b096-5798c25cc332'

const router = useRouter()
const toast = useToast()

const articles = ref<any[]>([])
const loading = ref(false)
const showForm = ref(false)
const editingId = ref('')
const formLoading = ref(false)
const formError = ref('')

const form = ref({
  title: '',
  slug: '',
  category: 'prepare',
  summary: '',
  content_markdown: '',
  cover_image: '',
  source_type: 'official',
  status: 1,
  is_featured: false,
  is_hot: false,
  require_login: false
})

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 200)
}

function onTitleChange() {
  form.value.slug = generateSlug(form.value.title)
}

async function fetchArticles() {
  loading.value = true
  try {
    const res = await httpRequest<{ code: number; data: { list: any[] } }>('/api/v1/knowledge/articles?page_size=50')
    articles.value = res.data?.list || []
  } catch { articles.value = [] }
  finally { loading.value = false }
}

function openCreate() {
  editingId.value = ''
  form.value = { title: '', slug: '', category: 'prepare', summary: '', content_markdown: '',
    cover_image: '', source_type: 'official', status: 1, is_featured: false, is_hot: false, require_login: false }
  formError.value = ''; showForm.value = true
}

function openEdit(article: any) {
  editingId.value = article.id
  form.value = {
    title: article.title || '', slug: article.slug || '', category: article.category || 'prepare',
    summary: article.summary || '', content_markdown: article.content_markdown || '',
    cover_image: article.cover_image || '', source_type: article.source_type || 'official',
    status: article.status ?? 1, is_featured: article.is_featured || false,
    is_hot: article.is_hot || false, require_login: article.require_login || false
  }
  formError.value = ''; showForm.value = true
}

function closeForm() { showForm.value = false; formError.value = '' }

async function submitForm() {
  formError.value = ''
  if (!form.value.title.trim()) { formError.value = 'Title is required.'; return }
  if (!form.value.slug.trim()) { formError.value = 'Slug is required.'; return }
  if (!form.value.content_markdown.trim()) { formError.value = 'Content is required.'; return }

  formLoading.value = true
  try {
    if (editingId.value) {
      await httpRequest(`/api/v1/admin/knowledge/articles/${editingId.value}`, { method: 'PUT', body: form.value, skipLoading: true })
      toast.add({ title: 'Updated', description: 'Article has been updated.', color: 'success' })
    } else {
      await httpRequest('/api/v1/admin/knowledge/articles', { method: 'POST', body: form.value, skipLoading: true })
      toast.add({ title: 'Created', description: 'Article has been created.', color: 'success' })
    }
    closeForm(); await fetchArticles()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Failed to save.'
    toast.add({ title: 'Failed', description: formError.value, color: 'error' })
  } finally { formLoading.value = false }
}

async function deleteArticle(id: string) {
  if (!confirm('Are you sure you want to delete this article?')) return
  try {
    await httpRequest(`/api/v1/admin/knowledge/articles/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Deleted', description: 'Article removed.', color: 'success' })
    await fetchArticles()
  } catch (e) {
    toast.add({ title: 'Failed', description: e instanceof Error ? e.message : 'Failed.', color: 'error' })
  }
}

function formatDate(v?: string) {
  if (!v) return '-'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
  if (!getToken()) { router.push('/login'); return }
  if (localStorage.getItem('doxie_uid') !== ADMIN_UID) { router.push('/'); return }
  fetchArticles()
})
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
    <section class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-slate-900">Manage Articles</h1>
        <p class="mt-1 text-sm text-slate-500">Create, edit and manage knowledge base articles.</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openCreate">New Article</UButton>
    </section>

    <section class="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
      <div class="flex items-start gap-2">
        <UIcon name="i-lucide-shield" class="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <p><strong>Only administrators</strong> can submit, edit, or delete articles. Changes will be visible immediately on the knowledge base.</p>
      </div>
    </section>

    <!-- Form -->
    <section v-if="showForm" class="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 px-6 py-4">
        <h2 class="text-lg font-black text-slate-900">{{ editingId ? 'Edit Article' : 'New Article' }}</h2>
      </div>
      <div class="space-y-5 px-6 py-6">
        <div>
          <label class="mb-1.5 block text-sm font-bold text-slate-700">Title</label>
          <input v-model="form.title" placeholder="Article title" class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" @input="onTitleChange" />
          <p class="mt-1.5 text-xs text-slate-400">Slug: <code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{{ form.slug || 'auto-generated' }}</code></p>
        </div>

        <div class="grid grid-cols-3 gap-5">
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Category</label>
            <select v-model="form.category" class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
              <option v-for="c in CATEGORIES" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Source</label>
            <select v-model="form.source_type" class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
              <option v-for="s in SOURCE_TYPES" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold text-slate-700">Status</label>
            <select v-model="form.status" class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
              <option :value="1">Published</option>
              <option :value="0">Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-bold text-slate-700">Summary</label>
          <textarea v-model="form.summary" rows="2" placeholder="Brief summary" class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-bold text-slate-700">Content (Markdown)</label>
          <textarea v-model="form.content_markdown" rows="14" placeholder="Write in Markdown..." class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 text-sm font-mono leading-6 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-bold text-slate-700">Cover Image URL</label>
          <input v-model="form.cover_image" placeholder="https://..." class="w-full rounded-2xl border border-blue-500 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
        </div>

        <div class="flex flex-wrap items-center gap-6 pt-2">
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input v-model="form.is_featured" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span class="text-sm font-semibold text-slate-700">Featured — show on homepage</span>
          </label>
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input v-model="form.is_hot" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span class="text-sm font-semibold text-slate-700">Hot — show in Hot Topics</span>
          </label>
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input v-model="form.require_login" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span class="text-sm font-semibold text-slate-700">Require login to view</span>
          </label>
        </div>

        <p v-if="formError" class="text-sm font-semibold text-rose-500">{{ formError }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <UButton color="neutral" variant="soft" :disabled="formLoading" @click="closeForm">Cancel</UButton>
          <UButton icon="i-lucide-save" :loading="formLoading" @click="submitForm">{{ editingId ? 'Update' : 'Create' }}</UButton>
        </div>
      </div>
    </section>

    <!-- List -->
    <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div v-if="loading" class="flex items-center justify-center py-12 text-sm text-slate-400">Loading...</div>
      <div v-else-if="!articles.length" class="flex flex-col items-center py-12 text-slate-400">
        <UIcon name="i-lucide-book-open" class="h-10 w-10" />
        <p class="mt-3 text-sm font-semibold">No articles yet. Create your first one.</p>
      </div>
      <div v-else class="divide-y divide-slate-100">
        <div v-for="article in articles" :key="article.id" class="flex items-center justify-between px-6 py-4">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="truncate text-sm font-bold text-slate-900">{{ article.title }}</span>
              <span v-if="article.status === 0" class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Draft</span>
              <span v-if="article.is_featured" class="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">Featured</span>
              <span v-if="article.is_hot" class="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">Hot</span>
              <span v-if="article.require_login" class="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">Login</span>
            </div>
            <p class="mt-0.5 text-xs text-slate-400">{{ article.category }} · {{ article.view_count || 0 }} views · {{ formatDate(article.created_at) }}</p>
          </div>
          <div class="flex shrink-0 gap-2 pl-4">
            <UButton color="neutral" variant="soft" size="sm" icon="i-lucide-pencil" @click="openEdit(article)" />
            <UButton color="error" variant="soft" size="sm" icon="i-lucide-trash-2" @click="deleteArticle(article.id)" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
