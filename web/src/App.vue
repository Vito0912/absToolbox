<template>
  <div
    class="min-h-screen bg-[#0b0f17] text-gray-100 antialiased flex flex-col"
  >
    <nav
      class="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f17]/80 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8"
      >
        <h1 class="text-xl font-semibold tracking-tight">
          <router-link
            to="/"
            class="inline-flex items-center text-gray-100 hover:text-blue-300 transition-colors"
          >
            <img
              src="/icon-192x192.png"
              alt="icon"
              class="h-10 w-10 mr-2 filter brightness-0 invert"
            />
            ABS Toolbox
          </router-link>
        </h1>

        <div class="hidden md:flex items-center gap-2">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            :active-class="link.to !== '/' ? '!text-blue-300 bg-blue-500/10' : undefined"
            :exact-active-class="link.to === '/' ? '!text-blue-300 bg-blue-500/10' : undefined"
          >
            {{ link.text }}
          </router-link>
        </div>

        <div class="flex md:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            :aria-expanded="isMenuOpen"
          >
            <span class="sr-only">Open main menu</span>
            <Menu v-if="!isMenuOpen" />
            <X v-else />
          </button>
        </div>
      </div>

      <div v-show="isMenuOpen" class="md:hidden" id="mobile-menu">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            :active-class="link.to !== '/' ? 'bg-gray-900 text-white' : undefined"
            :exact-active-class="link.to === '/' ? 'bg-gray-900 text-white' : undefined"
            @click="isMenuOpen = false"
          >
            {{ link.text }}
          </router-link>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from "@/shared/components/Footer.vue";
import { Menu, X } from "lucide-vue-next";

import { ref } from "vue";

const isMenuOpen = ref(false);

const links = [
  { to: "/", text: "Home" },
  { to: "/tools", text: "Tools" },
  { to: "/stats", text: "Stats" },
  { to: "/projects", text: "Projects" },
  { to: "/clients", text: "Clients" },
  { to: "/settings", text: "Settings" },
];
</script>
