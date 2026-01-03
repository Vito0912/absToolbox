<template>
  <InfoBox v-if="serverUrl" variant="danger">
    <p>
      <strong>Warning:</strong> Make a backup before using these tools. I am not
      responsible for any data loss or issues that may occur by using these
      tools. Visit
      <a
        :href="`${baseDomain}config/backups`"
        target="_blank"
        class="text-blue-400 underline"
        >Backups</a
      >
      to create a backup before proceeding.
    </p>
  </InfoBox>
</template>

<script setup lang="ts">
import { InfoBox } from "@/shared/components";
import { useSettingsStore } from "@/shared/settings";
import { useApi } from "@/shared/composables/useApi";
import { computed } from "vue";

const settingsStore = useSettingsStore();
const { baseDomain } = useApi();

const serverUrl = computed(() => settingsStore.settings.serverUrl);
</script>
