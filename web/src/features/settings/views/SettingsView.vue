<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <PageHeader
      :title="t.pageHeader.title"
      :subtitle="t.pageHeader.subtitle"
    />

    <div class="flex items-center justify-between mb-8 px-4">
      <div v-for="i in 3" :key="i" class="flex items-center flex-1 last:flex-none">
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors shrink-0"
          :class="[
            step >= i
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-600 text-gray-400',
          ]"
        >
          {{ i }}
        </div>
        <div
          v-if="i < 3"
          class="h-0.5 mx-2 w-full transition-colors"
          :class="[step > i ? 'bg-blue-500' : 'bg-gray-600']"
        ></div>
      </div>
    </div>

    <BaseCard>
      <div v-if="step === 1" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-100">{{ t.step1.title }}</h2>
        
        <p class="text-gray-300">
          {{ t.step1.description }}
        </p>

        <InfoBox variant="info">
          <div class="flex justify-between items-center cursor-pointer select-none" @click="corsExpanded = !corsExpanded">
            <span class="font-semibold">{{ t.step1.corsInfo.title }}</span>
            <span class="text-xl font-bold">{{ corsExpanded ? '−' : '+' }}</span>
          </div>
          
          <div v-if="corsExpanded" class="mt-4 space-y-3 text-sm text-blue-100/90">
            <p v-html="t.step1.corsInfo.definition"></p>
            <p>{{ t.step1.corsInfo.browserSecurity }}</p>
            <p>{{ t.step1.corsInfo.toolboxExplanation }}</p>
            <p class="font-semibold">{{ t.step1.corsInfo.safetyTitle }}</p>
            <p v-html="t.step1.corsInfo.safetyIntro"></p>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(reason, idx) in t.step1.corsInfo.safetyReasons" :key="idx">{{ reason }}</li>
            </ul>
            <p>{{ t.step1.corsInfo.privacyNote }}</p>
          </div>
        </InfoBox>

        <div class="bg-gray-900/50 p-4 rounded-lg border border-white/10 space-y-4">
          <div>
            <p class="text-sm text-gray-300 mb-2">
              {{ t.step1.instructions.addUrl }}
            </p>
            <div class="flex gap-2 items-center">
              <code class="flex-1 bg-black/30 p-2 rounded text-blue-300 font-mono text-sm break-all">
                {{ currentOrigin }}
              </code>
              <BaseButton @click="copyOrigin" size="sm" variant="secondary">
                {{ t.step1.instructions.copyButton }}
              </BaseButton>
            </div>
          </div>
          
          <div class="flex justify-center">
            <img
              src="/images/cors.png"
              :alt="t.step1.instructions.imageAlt"
              class="rounded-lg border border-white/10 shadow-lg max-w-full"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <BaseButton @click="step = 2">{{ t.step1.buttons.next }}</BaseButton>
        </div>
      </div>

      <div v-if="step === 2" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-100">{{ t.step2.title }}</h2>
        
        <div class="space-y-2">
          <p class="text-gray-300">
            {{ t.step2.description }}
          </p>
          <InfoBox variant="info">
            <div class="text-sm space-y-2">
              <p v-html="t.step2.serverInfo.title"></p>
              <p v-html="t.step2.serverInfo.localExample"></p>
              <p>{{ t.step2.serverInfo.directConnection }}</p>
            </div>
          </InfoBox>
        </div>

        <form @submit.prevent="checkConnection" class="space-y-4">
          <BaseInput
            v-model="draftUrl"
            :label="t.step2.form.serverUrlLabel"
            type="url"
            :placeholder="t.step2.form.serverUrlPlaceholder"
            required
          />
          <p v-if="urlError" class="text-sm text-rose-400">{{ urlError }}</p>

          <div v-if="connectionError" class="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
            <p class="font-semibold mb-1">{{ t.step2.errors.connectionFailedTitle }}</p>
            <p>{{ connectionError }}</p>
            <p v-if="isCorsError" class="mt-2 text-xs">
              {{ t.step2.errors.corsHint }}
            </p>
          </div>

          <div class="flex justify-between">
            <BaseButton type="button" variant="secondary" @click="step = 1">{{ t.step2.buttons.back }}</BaseButton>
            <BaseButton type="submit" :loading="isLoading">{{ t.step2.buttons.checkConnection }}</BaseButton>
          </div>
        </form>
      </div>

      <div v-if="step === 3" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-100">{{ t.step3.title }}</h2>
        
        <div class="space-y-2">
          <p class="text-gray-300">
            {{ t.step3.description }}
          </p>
          <InfoBox variant="info">
            <div class="text-sm space-y-2">
              <p v-html="t.step3.privacyInfo.title"></p>
              <p>{{ t.step3.privacyInfo.tokenPurpose }}</p>
            </div>
          </InfoBox>
        </div>

        <div class="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 text-sm text-blue-200">
          {{ t.step3.apiKeyGeneration.text }}
          <br>
          <code class="text-white break-all">{{ interpolate(t.step3.apiKeyGeneration.path, { url: draftUrl }) }}</code>
        </div>

        <form @submit.prevent="verifyToken" class="space-y-4">
          <BaseInput
            v-model="draftToken"
            :label="t.step3.form.apiTokenLabel"
            type="password"
            :placeholder="t.step3.form.apiTokenPlaceholder"
            required
          />
          <p v-if="tokenError" class="text-sm text-rose-400">{{ tokenError }}</p>

          <div class="flex justify-center">
            <img
              src="/images/apiToken.png"
              :alt="t.step3.apiKeyGeneration.imageAlt"
              class="rounded-lg border border-white/10 shadow-lg max-w-full"
            />
          </div>

          <div class="flex justify-between">
            <BaseButton type="button" variant="secondary" @click="step = 2">{{ t.step3.buttons.back }}</BaseButton>
            <BaseButton type="submit" :loading="isLoading">{{ t.step3.buttons.verify }}</BaseButton>
          </div>
        </form>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useSettingsStore } from "@/shared/settings";
import { useI18n, interpolate } from "@/i18n";
import PageHeader from "@/shared/components/PageHeader.vue";
import BaseCard from "@/shared/components/BaseCard.vue";
import BaseInput from "@/shared/components/BaseInput.vue";
import BaseButton from "@/shared/components/BaseButton.vue";
import InfoBox from "@/shared/components/InfoBox.vue";

const router = useRouter();
const settingsStore = useSettingsStore();
const t = useI18n().settings;

const step = ref(1);
const corsExpanded = ref(false);
const isLoading = ref(false);

const draftUrl = ref(settingsStore.settings.serverUrl || "");
const draftToken = ref(settingsStore.settings.apiToken || "");

const urlError = ref("");
const connectionError = ref("");
const isCorsError = ref(false);
const tokenError = ref("");

const currentOrigin = window.location.origin;

const copyOrigin = () => {
  navigator.clipboard.writeText(currentOrigin);
};

const checkConnection = async () => {
  urlError.value = "";
  connectionError.value = "";
  isCorsError.value = false;
  isLoading.value = true;

  try {
    new URL(draftUrl.value);
  } catch (e) {
    urlError.value = t.step2.errors.invalidUrl;
    isLoading.value = false;
    return;
  }

  draftUrl.value = draftUrl.value.replace(/\/$/, "");

  try {
    await axios.get(`${draftUrl.value}/status`, {
      timeout: 5000
    });
    step.value = 3;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK" || !error.response) {
      connectionError.value = t.step2.errors.couldNotConnect;
      isCorsError.value = true;
    } else {
      connectionError.value = interpolate(t.step2.errors.serverError, { 
        status: error.response?.status, 
        statusText: error.response?.statusText 
      });
    }
  } finally {
    isLoading.value = false;
  }
};

const verifyToken = async () => {
  tokenError.value = "";
  isLoading.value = true;

  try {
    await axios.get(`${draftUrl.value}/api/me`, {
      headers: {
        Authorization: `Bearer ${draftToken.value}`
      },
      timeout: 5000
    });

    settingsStore.settings.serverUrl = draftUrl.value;
    settingsStore.settings.apiToken = draftToken.value;
    settingsStore.settings.authMethod = "token";
    settingsStore.saveSettings();
    
    router.push("/");
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      tokenError.value = t.step3.errors.invalidToken;
    } else {
      tokenError.value = t.step3.errors.verifyFailed;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
