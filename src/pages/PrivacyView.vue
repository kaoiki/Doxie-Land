<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
    <section class="mb-6">
      <UButton color="neutral" variant="soft" icon="i-lucide-arrow-left" @click="router.push('/')">Back to Home</UButton>
    </section>

    <section class="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <h1 class="text-3xl font-black text-slate-900">Privacy Policy</h1>
      <p class="mt-2 text-sm text-slate-500">Last updated: April 2026</p>

      <div class="mt-8 space-y-6 text-sm leading-7 text-slate-700">
        <div>
          <h2 class="text-lg font-bold text-slate-900">1. Information We Collect</h2>
          <p class="mt-2">When you register for an account on DoxieLand, we collect:</p>
          <ul class="mt-2 list-disc pl-5 space-y-1">
            <li>Your email address</li>
            <li>A nickname you choose or one we generate for you</li>
            <li>Content you voluntarily post (forum topics, comments, reviews, service listings)</li>
            <li>Your interactions with other users' content (votes, joins)</li>
          </ul>
          <p class="mt-2">We do not collect your real name, address, payment information, or any sensitive personal data unless you explicitly provide it in a service listing.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
          <ul class="mt-2 list-disc pl-5 space-y-1">
            <li>To operate and maintain your account</li>
            <li>To display your content to other users (forum posts, reviews, services)</li>
            <li>To facilitate communication between service providers and seekers</li>
            <li>To improve the platform and fix bugs</li>
          </ul>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">3. Data Sharing</h2>
          <p class="mt-2">We do not sell your personal data to third parties. Data is stored on Supabase (our database provider) and may be processed through our backend API hosted on Vercel. Both providers comply with industry-standard security practices.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">4. Contact Information</h2>
          <p class="mt-2">When you publish a service listing, your chosen contact information (phone, WhatsApp) is visible only to logged-in users. We encourage you to share only what you're comfortable with.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">5. Data Retention</h2>
          <p class="mt-2">Your data is retained for as long as your account is active. You may request deletion of your account and associated data by contacting us. Posts and comments you created may remain visible under a "deleted user" pseudonym after account deletion.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">6. Cookies</h2>
          <p class="mt-2">We use essential cookies to maintain your login session (localStorage token). No tracking or advertising cookies are used. You can clear this data at any time through your browser settings.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">7. Changes to This Policy</h2>
          <p class="mt-2">We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">8. Contact</h2>
          <p class="mt-2">If you have questions about this policy, please reach out via the community forum or contact the platform administrator.</p>
        </div>
      </div>
    </section>
  </main>
</template>
