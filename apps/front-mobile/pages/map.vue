<template>
  <div>
    <Head>
      <Title>{{ $t('map.title') }}</Title>
    </Head>
    <div class="card">
      <Breadcrumb
        :home="{ to: '/', label: $t('navbar.home') }" :model="items" class="mb-6"
        :style="{ 'border-radius': 0 }"
      />
      <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl">
          <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-4">
            {{ $t('map.title') }}
          </h2>
          <div class="flex flex-col">
            <Toolbar>
              <template #start>
                <div class="flex gap-2">
                  <Calendar v-model="dates" selection-mode="range" :manual-input="true" :placeholder="$t('map.filters.period')" />
                  <MultiSelect v-model="selectedEventTypes" :options="eventTypes" :placeholder="$t('map.filters.types')" />
                </div>
              </template>
              <template #end>
                <Button @click="resetFilters" :label="$t('map.filters.reset')" icon="pi pi-filter-slash" class="p-button-rounded p-button-secondary">
                  <template #icon>
                    <Icon name="material-symbols:filter-alt-off-outline" class="mr-2" />
                  </template>
                </Button>
              </template>
            </Toolbar>
            <div>
              <MapboxMap
                style="position:relative; height: 600px"
                map-id="1"
                :options="{
                  style: 'mapbox://styles/mapbox/streets-v11',
                  center: [2.213749, 46.603354],
                  zoom: 5
                }"
              >
                <MapboxGeolocateControl position="top-left" />
                <MapboxNavigationControl position="bottom-right" />
                <MapboxDefaultMarker
                  v-for="marker in placesMarkers"
                  :key="marker?.find(Boolean).place_id" :marker-id="marker?.find(Boolean).place_id.toString()"
                  :lnglat="[marker?.find(Boolean).place.lng, marker?.find(Boolean).place.lat]"
                />
              </MapboxMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EnumEventType, Event } from 'ts-interfaces'
import { Marker, Popup } from 'mapbox-gl'

const dayjs = useDayjs()
const { t, locale } = useI18n()

const selectedEventTypes = ref<EnumEventType[]>([])
const eventTypes = ref(Object.values(EnumEventType))
const dates = ref([])
const items = ref([
  { label: t('map.title') }
])

watch(locale, () => {
  items.value = [
    { label: t('map.title') }
  ]
})

const { data: events } = await useCustomFetch<Event[]>('/events')

const filteredEvents = computed(() => {
  let result = events.value ?? []
  if (dates.value?.length) {
    result = result?.filter(event => dayjs(event.date).isBetween(dayjs(dates.value[0]), dayjs(dates.value[1])))
  }
  if (selectedEventTypes.value?.length) {
    result = result?.filter(event => selectedEventTypes.value.includes(event.type.name))
  }
  return result
})

const placesMarkers = computed(() => {
  const groupedEvents = filteredEvents.value?.reduce((markers: any, event) => {
    const key = event.place_id
    if (!markers[key]) {
      markers[key] = []
    }
    markers[key].push(event)
    return markers
  }, [])
  return groupedEvents.filter(Boolean)
})

const resetFilters = () => {
  dates.value = []
  selectedEventTypes.value = []
}

const { $mapboxMarkerInstances }: any = useNuxtApp()

useMapbox('1', () => {
  addPopupsToMarkers()
  watch(placesMarkers, () => {
    addPopupsToMarkers()
  })
})

const addPopupsToMarkers = () => {
  for (const [markerKey, marker] of Object.entries<Marker>($mapboxMarkerInstances().value)) {
    const events = placesMarkers.value.find((event: any) => event[0].place_id.toString() === markerKey)
    if (events?.length) {
      const placeName = events[0]?.place.name
      const html = `
        <h3 class="text-md font-bold">
          ${placeName}
        </h3>
        <ul>
          ${events.map((event: any) => `
            <li style="max-height:200px">
              <a href="${event.type.name.toLowerCase()}s/${event.id}">
                ${event.name}
              </a>
            </li>
          `).join('')}
        </ul>
      `
      const popup = new Popup({ offset: 25, focusAfterOpen: false }).setHTML(html)
      marker.setPopup(popup) as Marker
    }
  }
}
</script>
