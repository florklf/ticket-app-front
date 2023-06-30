<template>
  <div class="card flex justify-content-center">
    <Toast v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh" position="bottom-left" group="bc">
      <template #message="slotProps">
        <div class="flex flex-col items-center" style="flex: 1">
          <div class="text-center">
            <i class="pi pi-exclamation-triangle" style="font-size: 3rem" />
            <div class="font-bold text-xl my-3">
              {{ slotProps.message.summary }}
            </div>
          </div>
          <div class="flex gap-2">
            <Button @click="$pwa.install()" severity="primary" label="Installer" size="small" />
            <Button @click="$pwa.cancelInstall()" severity="secondary" label="Annuler" size="small" />
          </div>
        </div>
      </template>
    </Toast>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
const toast = useToast()

onMounted(() => {
  toast.add({ severity: 'info', summary: 'Installer l\'application', group: 'bc' })
})
</script>
