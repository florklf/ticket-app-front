<template>
  <div>
    <Toast v-if="$pwa" position="bottom-left" group="pwa">
      <template #message="slotProps">
        <div class="flex flex-col items-center" style="flex: 1">
          <div class="text-center">
            <i class="pi pi-exclamation-triangle" style="font-size: 3rem" />
            <div class="font-bold my-3">
              <span v-if="slotProps.message.detail === 'install'">
                {{ $t('pwa.installMessage') }}
              </span>
              <span v-else-if="slotProps.message.detail === 'offlineReady'">
                {{ $t('pwa.offlineReady') }}
              </span>
              <span v-else-if="slotProps.message.detail === 'newContent'">
                {{ $t('pwa.newContent') }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <Button v-if="slotProps.message.detail === 'install'" @click="$pwa.install()" severity="primary" :label="$t('pwa.install')" size="small" />
            <Button v-if="slotProps.message.detail === 'install'" @click="$pwa.cancelInstall()" severity="secondary" :label="$t('pwa.cancel')" size="small" />
            <Button v-if="slotProps.message.detail === 'newContent'" @click="$pwa?.updateServiceWorker()" severity="primary" :label="$t('pwa.update')" size="small" />
            <Button v-if="slotProps.message.detail === 'newContent' || slotProps.message.detail === 'offlineReady'" @click="$pwa?.cancelPrompt()" severity="secondary" :label="$t('pwa.close')" size="small" />
          </div>
        </div>
      </template>
    </Toast>
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const { $pwa } = useNuxtApp()

onMounted(() => {
  if ($pwa?.showInstallPrompt) {
    toast.add({ severity: 'info', group: 'pwa', detail: 'install' })
  }
  if ($pwa?.offlineReady) {
    toast.add({ severity: 'info', group: 'pwa', detail: 'offlineReady' })
  } else if ($pwa?.needRefresh) {
    toast.add({ severity: 'info', group: 'pwa', detail: 'newContent' })
  }
})
</script>
