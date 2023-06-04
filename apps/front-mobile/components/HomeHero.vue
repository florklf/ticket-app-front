<template>
  <div v-if="loaded" class="relative h-full">
    <Carousel
      :value="HERO_IMAGES" :num-visible="1" :num-scroll="1" :autoplay-interval="5000" :circular="true"
      :breakpoints="{ 768: { numVisible: 1, numScroll: 1 } }" :show-indicators="false" :show-navigators="false" class="pointer-events-none"
    >
      <template #item="item">
        <div class="absolute top-0 bottom-0 w-full bg-gradient-to-r to-transparent from-purple-500 opacity-25 z-10" />
        <img :src="item.data" alt="hero" class="w-full object-cover" draggable="false">
      </template>
    </Carousel>
    <div class="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-3/5">
      <i18n-t
        tag="h1" keypath="home.hero.heading"
        class="text-white text-center text-3xl font-bold select-none leading-6 sm:text-5xl sm:leading-10 md:text-6xl md:leading-11 lg:text-8xl lg:leading-18"
      >
        <template #heading_gradient>
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-emerald-400">
            {{ $t('home.hero.heading_gradient') }}
          </span>
        </template>
      </i18n-t>
      <div class="mt-6 w-full">
        <span class="p-input-icon-left w-full">
          <Icon name="fa-solid:search" />
          <InputText
            v-model="search" class="p-inputtext-sm w-full"
            :placeholder="$t('home.hero.searchPlaceholder')"
          />
        </span>
      </div>
    </div>
  </div>
  <Skeleton v-else border-radius="0" height="14rem" />
</template>

<script setup lang="ts">
const images = import.meta.glob('@/assets/images/hero/*.jpg')

const search = ref('')
const loaded = ref(false)

const HERO_IMAGES = Object.keys(images).map(path => path)

onMounted(() => {
  loaded.value = true
})
</script>

<style scoped></style>
