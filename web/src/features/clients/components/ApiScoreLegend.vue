<template>
  <div class="rounded-xl border border-white/10 bg-gray-900/40 p-4">
    <h3 class="text-sm font-medium text-gray-300 mb-2">API Score Legend</h3>
    <div class="flex flex-wrap gap-4 text-xs pb-4">
      <div
        v-for="item in legendItems"
        :key="item.label"
        class="flex items-center gap-2"
      >
        <div class="w-3 h-3 rounded-full" :class="item.color"></div>
        <span class="text-gray-400">{{ item.label }}</span>
      </div>
    </div>
    <span class="text-gray-400 text-sm">
      Always check the last tested date. Apps can change over time. This only
      represents a snapshot in time.
    </span>
    <br /><br />
    <span class="text-gray-400 text-sm">
      <p>
        <strong>Disclaimer:</strong> API scores and all content on this page
        reflect my personal opinion and do not represent the views of the ABS
        dev team or ABS as a whole. Creating an app takes significant effort, so
        publishing even one is already a big achievement. If you find any
        mistakes or believe something should be updated, feel free to contact me
        on
        <a href="https://discord.com/users/339746615369793536"
          >Discord (@vito0912)</a
        >
        or send me an <a href="mailto:finn@dittmar-ldk.de">email here.</a>
      </p>
    </span>
  </div>
</template>

<script setup lang="ts">
const legendItems = [
  { color: "bg-red-500", label: "0-1: Poor API usage" },
  { color: "bg-orange-500", label: "2-3: Fair API usage" },
  { color: "bg-yellow-500", label: "4: Good API usage" },
  { color: "bg-green-500", label: "5: Excellent API usage" },
];
</script>
