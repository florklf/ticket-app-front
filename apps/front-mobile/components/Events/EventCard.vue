<template>
  <NuxtLink :to="`/${pluralize(event.type.toLowerCase())}/${event.id}`" class="flex flex-col flex-1">
    <div class="bg-gray-200 group-hover:opacity-90 sm:h-64 relative">
      <Chip
        :label="event.type" class="absolute top-2 right-2 z-10" :pt="{
          root: { class: 'bg-gradient-to-r from-primarylight to-primary' }
        }"
      >
        <template #default>
          <span class="p-chip-text text-white text-xs">{{ event.type }}</span>
        </template>
      </Chip>
      <img :src="event.image" class="h-full w-full object-cover object-center sm:h-full sm:w-full">
    </div>
    <div class="flex flex-1 flex-col space-y-2 p-4 justify-between">
      <div class="flex flex-col space-y-2">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-900">
            {{ event.name }}
          </h3>
        </div>
        <div class="flex flex-1 justify-between items-center">
          <p class="text-base text-gray-800">
            {{ event.description?.length > 100 ? event.description.substring(0, 100) + '...' : event.description }}
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <Chip v-for="eventArtist in event.eventArtists.slice(0, 2)" :key="eventArtist.id" class="px-2 bg-gray-200">
            <template #default>
              <span class="p-chip-text text-gray-800 text-xs">{{ eventArtist.artist.name }}</span>
            </template>
          </Chip>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-base font-medium text-gray-800">
          {{ event.place.name }}
        </p>
        <p class="flex items-center gap-1 text-base text-sm italic text-gray-800">
          <Icon name="fa-solid:calendar" class="text-gray-800" />
          {{ dayjs(event?.date).format('DD/MM/YYYY') }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Chip
          v-for="eventGenre in event.eventGenres.slice(0, 2)" :key="eventGenre.id" :pt="{
            root: { class: 'bg-gradient-to-r from-white to-gray-200' }
          }"
        >
          <template #default>
            <span class="p-chip-text text-gray-800 text-xs">{{ eventGenre.genre.name }}</span>
          </template>
        </Chip>
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
