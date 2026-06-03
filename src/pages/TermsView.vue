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
      <h1 class="text-3xl font-black text-slate-900">Terms of Service</h1>
      <p class="mt-2 text-sm text-slate-500">Last updated: April 2026</p>

      <div class="mt-8 space-y-6 text-sm leading-7 text-slate-700">
        <div>
          <h2 class="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p class="mt-2">By accessing or using DoxieLand, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">2. User Accounts</h2>
          <ul class="mt-2 list-disc pl-5 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You must provide accurate information when registering.</li>
            <li>You may not create multiple accounts for abusive purposes.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">3. User Conduct</h2>
          <p class="mt-2">When using DoxieLand, you agree not to:</p>
          <ul class="mt-2 list-disc pl-5 space-y-1">
            <li>Post spam, fraudulent, or misleading content</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Post illegal content or content that infringes on others' rights</li>
            <li>Attempt to manipulate votes, reviews, or service listings</li>
            <li>Use the platform for any unlawful purpose</li>
          </ul>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">4. Service Listings</h2>
          <ul class="mt-2 list-disc pl-5 space-y-1">
            <li>Service providers are responsible for the accuracy of their listings.</li>
            <li>DoxieLand is a platform for connecting users; we do not endorse or guarantee any service.</li>
            <li>All providers are marked as unverified unless otherwise indicated.</li>
            <li>Users engage with service providers at their own risk.</li>
            <li>We strongly recommend taking precautions when meeting or transacting with other users.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">5. Content Ownership</h2>
          <ul class="mt-2 list-disc pl-5 space-y-1">
            <li>You retain ownership of content you post on DoxieLand.</li>
            <li>By posting, you grant DoxieLand a non-exclusive license to display your content on the platform.</li>
            <li>We may remove content that violates these terms without prior notice.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">6. Limitation of Liability</h2>
          <p class="mt-2">DoxieLand is provided "as is" without warranties of any kind. We are not liable for:</p>
          <ul class="mt-2 list-disc pl-5 space-y-1">
            <li>Interactions or transactions between users</li>
            <li>Accuracy of user-generated content</li>
            <li>Temporary service interruptions or data loss</li>
            <li>Damages arising from use of the platform</li>
          </ul>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">7. Termination</h2>
          <p class="mt-2">We reserve the right to suspend or terminate access to the platform at our sole discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other users.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">8. Changes to Terms</h2>
          <p class="mt-2">We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </div>

        <div>
          <h2 class="text-lg font-bold text-slate-900">9. Governing Law</h2>
          <p class="mt-2">These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through arbitration or in the courts of the jurisdiction where the platform operator is based.</p>
        </div>
      </div>
    </section>
  </main>
</template>
