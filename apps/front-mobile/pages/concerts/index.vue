<template>
  <div>
    <Head>
      <Title>Concerts</Title>
    </Head>
    <div class="card">
      <Breadcrumb
        :home="{ to: '/', label: $t('navbar.home') }" :model="items" class="mb-6"
        :style="{ 'border-radius': 0 }"
      />
      <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl">
          <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
            Concerts
          </h2>
          <div class="flex items-center mb-2">
            <ScrollPanel orientation="horizontal" class="w-full" :pt="{content: { class: 'flex gap-2 overflow-hidden' }}">
              <Button
                v-for="genre in genres" :key="genre.id"
                @click=" selectedGenre = selectedGenre == genre.name ? null : genre.name"
                :outlined="genre.name != selectedGenre" :class="{ 'outlined': genre.name == selectedGenre }"
                class="grow shrink-0 outlined" size="small" :label="genre.name"
              />
            </ScrollPanel>
          </div>
          <div v-if="concertsCount == 0" class="flex justify-center my-8">
            <p class="text-gray-500">
              Aucun concert à venir
            </p>
          </div>
          <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            <div
              v-for="concert in concerts" :key="concert.id"
              class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <EventCard :event="concert" />
            </div>
          </div>
          <Paginator
            @page="handlePageChange" @update:rows="handleRowsChange" :rows="rowsCount"
            :total-records="parseInt(concertsCount)" :rows-per-page-options="[10, 20, 30]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EventCard from '~/components/Events/EventCard.vue'
import { EnumEventType } from '~/types/EnumEventType'
useHead({
  titleTemplate: '%s - TicketApp'
})

const rowsCount = ref(10)
const page = ref(0)
const selectedGenre = ref(null)
const items = ref([
  { label: 'Concerts' }
])

const { data: genres } = await useCustomFetch('/genres')

const eventsParams = computed(() => {
  const params = { page: page.value, limit: rowsCount.value, type: EnumEventType.CONCERT }
  if (selectedGenre.value) {
    return { ...params, genre: selectedGenre.value }
  }
  return params
})
const eventsCountParams = computed(() => {
  const params = { type: EnumEventType.CONCERT }
  if (selectedGenre.value) {
    return { ...params, genre: selectedGenre.value }
  }
  return params
})
const { data: concertsCount } = await useCustomFetch('/events/count', {
  params: eventsCountParams,
  watch: [selectedGenre]
})
const { data: concerts } = await useCustomFetch('/events', {
  params: eventsParams,
  watch: [page, rowsCount, selectedGenre]
})

const handlePageChange = (event) => {
  page.value = event.page
}

const handleRowsChange = (value) => {
  rowsCount.value = value
}

</script>
