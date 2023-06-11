<template>
  <div>
    <Head>
      <Title>{{ $t('search.title', { query: query }) }}</Title>
    </Head>
    <div class="card">
      <Breadcrumb
        :home="{ to: '/', label: $t('navbar.home') }" :model="items" class="mb-6"
        :style="{ 'border-radius': 0 }"
      />
      <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl">
          <div class="flex flex-col sm:flex-row items-center justify-between mb-4">
            <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
              {{ $t('search.title', { query: query }) }}
            </h2>
            <span class="text-lg">
              {{ $t('search.resultsCount', { count: foundEvents.total }) }}
            </span>
          </div>
          <div v-if="!foundEvents?.results.length" class="flex justify-center my-8">
            <p class="text-gray-500">
              {{ $t('search.noResults') }}
            </p>
          </div>
          <div
            v-else
            class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4 lg:gap-x-8"
          >
            <div
              v-for="event in foundEvents.results" :key="event.id"
              class="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <EventCard :event="event" />
            </div>
          </div>
          <Paginator
            @page="handlePageChange" @update:rows="handleRowsChange" :rows="pagination.size"
            :total-records="parseInt(!foundEvents ? 0 : foundEvents.total)" :rows-per-page-options="[10, 20, 30]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EventCard from '~/components/Events/EventCard.vue'
useHead({
  titleTemplate: '%s - TicketApp'
})

const route = useRoute()
const i18n = useI18n()

const query = ref(route.query.q ?? '')
const items = ref([
  { label: i18n.t('search.title', { query: query.value }), to: { name: 'search', query: { q: query } } }
])
const pagination = ref({
  page: 0,
  size: 10
})

const requestBody = computed(() => ({
  query: query.value,
  page: pagination.value.page,
  size: pagination.value.size
}))

const { data: foundEvents } = await useCustomFetch('/search', {
  method: 'POST',
  body: requestBody,
  watch: [query, pagination]
})

const handlePageChange = (event) => {
  pagination.value.page = event.page
}

const handleRowsChange = (value) => {
  pagination.value.size = value
}
</script>
