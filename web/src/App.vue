<template>
  <div class="min-h-screen bg-[#0b0f17] text-slate-100 antialiased">
    <nav
      class="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f17]/80 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <h1 class="text-xl font-semibold tracking-tight">
          <router-link
            to="/"
            class="text-slate-100 hover:text-indigo-300 transition-colors"
          >
            📚 ABS Toolbox
          </router-link>
        </h1>

        <div class="flex items-center gap-2">
          <router-link
            to="/"
            class="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            active-class="!text-indigo-300 bg-indigo-500/10"
          >
            Tools
          </router-link>
          <router-link
            to="/projects"
            class="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            active-class="!text-indigo-300 bg-indigo-500/10"
          >
            Projects
          </router-link>
          <router-link
            to="/clients"
            class="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            active-class="!text-indigo-300 bg-indigo-500/10"
          >
            Clients
          </router-link>
          <router-link
            to="/settings"
            class="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            active-class="!text-indigo-300 bg-indigo-500/10"
          >
            Settings
          </router-link>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>