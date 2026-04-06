<template>
  <main class="min-h-screen flex items-center justify-center px-6 py-12">
    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div class="mb-6">
        <h1 class="text-3xl font-extrabold text-slate-900">Register</h1>
        <p class="mt-2 text-slate-500">Create your DoxieLand account.</p>
      </div>

      <form class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <UInput
            type="text"
            placeholder="Your name"
            size="xl"
            class="w-full"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <UInput
            type="email"
            placeholder="you@example.com"
            size="xl"
            class="w-full"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <UInput
            type="password"
            placeholder="••••••••"
            size="xl"
            class="w-full"
          />
        </div>

        <UButton
          type="submit"
          size="xl"
          block
        >
          Create Account
        </UButton>
      </form>

      <div class="mt-8 flex flex-col gap-3 text-sm">
        <RouterLink to="/login" class="font-semibold text-primary hover:underline">
          Already have an account? Login
        </RouterLink>

        <RouterLink to="/" class="font-semibold text-slate-600 hover:text-primary hover:underline">
          Back to Home
        </RouterLink>
      </div>
    </div>
  </main>
</template>