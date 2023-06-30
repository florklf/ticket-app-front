<script setup>
import AppConfig from '@/layouts/AppConfig.vue'

definePageMeta({
  layout: false
})

const props = defineProps(['error'])

const message = computed(() => {
  if (props.error.statusCode === 404) {
    return 'La page que vous recherchez n\'existe pas.'
  }
  return 'Une erreur est survenue.'
})
</script>

<template>
  <div>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-column align-items-center justify-content-center">
        <img src="/demo/images/notfound/logo-blue.svg" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style="border-radius: 53px">
            <span class="text-blue-500 font-bold text-3xl">{{ error.statusCode }}</span>
            <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">
              Oups!
            </h1>
            <div class="text-600 mb-5">
              {{ message }}
            </div>
            <router-link to="/" class="w-full flex align-items-center py-5 border-300 border-bottom-1">
              <span class="flex justify-content-center align-items-center bg-cyan-400 border-round" style="height: 3.5rem; width: 3.5rem">
                <i class="text-50 pi pi-fw pi-table text-2xl" />
              </span>
              <span class="ml-4 flex flex-column">
                <span class="text-900 lg:text-xl font-medium mb-0 block">Dashboard</span>
                <span class="text-600 lg:text-xl">Retourner à l'accueil</span>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <AppConfig simple />
  </div>
</template>
