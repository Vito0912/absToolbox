<template>
  <footer
    class="border-t border-white/10 bg-[#0b0f17]/80 backdrop-blur mt-auto"
  >
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span>ABS Toolbox</span>
          <span class="text-gray-600">@</span>
          <span>{{ new Date().getFullYear() }}</span>
          <a href="https://github.com/Vito0912/absToolbox">
            <img
              src="/logos/github-mark.svg"
              alt="GitHub Logo"
              class="w-4 h-4"
            />
          </a>
        </div>

        <div class="flex items-center gap-4 text-sm text-gray-400">
          <a
            href="https://github.com/advplyr/audiobookshelf"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-blue-300 transition-colors"
          >
            Audiobookshelf
          </a>
          <span class="text-gray-600">•</span>
          <a href="https://github.com/Vito0912/absToolbox">
            <span>Add, fix, or request tools/data</span>
          </a>
        </div>

        <div class="flex items-center gap-4 text-sm text-gray-400">
          <a href="https://dittmar-ldk.de/about/impressum">Imprint</a>
          <a href="https://dittmar-ldk.de/about/datenschutz">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>
