<script setup lang="ts">
import { Footer as WtFooter } from '@vito0912/web/vue'

const categories = [
  {
    title: 'Other Projects',
    links: [
      { label: 'ABS OpenAPI-Docs', href: 'https://abs-api-docs.vito0912.de' },
      { label: 'ABS AGG', href: 'https://github.com/Vito0912/abs-agg' },
      { label: 'ABS Autoconverter', href: 'https://github.com/Vito0912/abs-autoconverter' },
    ],
  },
  {
    title: 'Misc',
    links: [
      { label: 'Fix, Report, or Request', href: 'https://github.com/Vito0912/absToolbox/issues' },
      { label: 'Audiobookshelf', href: 'https://github.com/advplyr/audiobookshelf' },
    ],
  },
]
</script>

<template>
  <WtFooter
    brand-text="ABS Toolbox"
    description="A collection of tools and utilities for Audiobookshelf."
    brand-href="https://github.com/Vito0912/absToolbox"
    source-href="https://github.com/Vito0912/absToolbox"
    source-label="View Source"
    :categories="categories"
  />
</template>