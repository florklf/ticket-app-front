<template>
    <div class="relative">
        <Carousel :value="HERO_IMAGES" :numVisible="1" :numScroll="1" :autoplayInterval="5000" :circular="true"
            :breakpoints="{ 768: { numVisible: 1, numScroll: 1 } }" :showIndicators="false" :showNavigators="false">
            <template #item="item">
                <img :src="item.data" alt="hero" class="w-full object-cover" />
            </template>
        </Carousel>
        <div class="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-3/5">
            <i18n-t tag="h1" keypath="home.hero.heading"
                class="text-white text-center font-bold text-3xl leading-6 sm:text-5xl sm:leading-10 md:text-6xl md:leading-11 lg:text-8xl lg:leading-18">
                <template #heading_gradient>
                <span class="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-emerald-400">
                    {{ $t('home.hero.heading_gradient') }}
                </span>
                </template>
            </i18n-t>
            <div class="mt-6 w-full">
                <span class="p-input-icon-left w-full">
                    <i class="fa fa-search" />
                    <InputText v-model="search" class="p-inputtext-sm w-full"
                        :placeholder="$t('home.hero.searchPlaceholder')" />
                </span>
            </div>
        </div>
    </div>
</template>
  
<style scoped></style>
  
<script setup lang="ts">
const images = import.meta.glob('@/assets/images/hero/*.jpg');
const HERO_IMAGES = Object.keys(images).map((path) => path);

const search = ref('');
</script>
  