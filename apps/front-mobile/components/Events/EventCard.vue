<template>
  <NuxtLink :to="`/${pluralize(event.type.toLowerCase())}/${event.id}`">
    <div class="bg-gray-200 group-hover:opacity-90 sm:h-64 relative">
      <Chip :label="event.type" class="absolute top-2 right-2 z-10 font-bold text-primary" />
      <img :src="event.image" class="h-full w-full object-cover object-center sm:h-full sm:w-full">
    </div>
    <div class="flex flex-1 flex-col space-y-2 p-4">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-bold text-gray-900">
          {{ event.name }}
        </h3>
      </div>
      <div class="flex flex-1 justify-between items-center">
        <p class="text-base font-medium text-gray-800">
          {{ event?.place?.name }}
        </p>
        <p class="text-base italic text-gray-800">
          {{ dayjs(event?.date).format('DD/MM/YYYY') }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import pluralize from 'pluralize'
import { Event } from '~/types/Events/Event'

const dayjs = useDayjs()

const _props = defineProps<{
  event: Event
}>()
</script>
