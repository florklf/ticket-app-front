
<template>
  <div class="card">
    <div class="bg-white">
      <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl">
        <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
          Les <span class="text-primary">prochains évènements</span> à venir
        </h2>

        <div v-if="pending" class="flex justify-center my-10">
          <ProgressSpinner
            style="width: 50px; height: 50px" stroke-width="6" fill="var(--surface-ground)"
            animation-duration="1s" aria-label="Custom ProgressSpinner"
          />
        </div>
        <div v-else class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          <div v-for="event in events" :key="event.id" class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
            <EventCard :event="event" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EventCard from '~/components/Events/EventCard.vue'

const rowsCount = 4;

const { data } = await useCustomFetch('/events/count')
const url = computed(() => `/events?limit=${rowsCount}`)
const { data: events, pending } = await useCustomFetch(url.value, {
  params: { limit: rowsCount },
  watch: [rowsCount]
})
</script>
