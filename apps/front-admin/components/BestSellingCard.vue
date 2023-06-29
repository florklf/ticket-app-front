<script setup lang="ts">
import { EnumTimeScope } from '~/types/EnumTimeScope'
import { EventBestSeller } from '~/types/EventBestSeller'

const props = defineProps({
  timeScope: {
    type: String as PropType<EnumTimeScope>,
    required: true
  }
})
const timeScope = toRefs(props).timeScope
const timeScopeParam = computed(() => {
  return timeScope.value !== EnumTimeScope.ALL ? timeScope.value : undefined
})
const { data: bestSellingEvents } = await useCustomFetch<EventBestSeller[]>('/orders/best-selling', {
  query: {
    time: timeScopeParam
  }
})
</script>

<template>
  <div class="card">
    <div class="flex justify-content-between align-items-center mb-5">
      <h5>Meilleures ventes</h5>
    </div>
    <ul class="list-none p-0 m-0">
      <li v-for="(item, index) in bestSellingEvents?.slice(0,5)" :key="index" class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
        <div>
          <span class="text-900 font-medium mr-2 mb-1 md:mb-0">{{ item.name }}</span>
          <div class="mt-1 text-600">
            {{ item.count }} places vendues
          </div>
        </div>
        <div class="mt-2 md:mt-0 flex align-items-center">
          <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
            <div class="bg-orange-500 h-full" :style="'width: ' + item.percentage + '%'" />
          </div>
          <span class="text-orange-500 ml-3 font-medium">{{ Number(item.percentage/100).toLocaleString('fr-FR',{style: 'percent', minimumFractionDigits:2}) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
