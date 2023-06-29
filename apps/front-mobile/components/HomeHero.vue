<template>
  <div class="relative h-full">
    <Carousel
      v-if="loaded" :value="HERO_IMAGES" :num-visible="1" :num-scroll="1" :autoplay-interval="5000"
      :circular="true" :breakpoints="{ 768: { numVisible: 1, numScroll: 1 } }" :show-indicators="false"
      :show-navigators="false" class="pointer-events-none"
    >
      <template #item="item">
        <div class="absolute top-0 bottom-0 w-full bg-gradient-to-r to-transparent from-purple-500 opacity-25 z-10" />
        <img :src="item.data" alt="hero" class="w-full object-cover" draggable="false">
      </template>
    </Carousel>
    <Skeleton v-else border-radius="0" height="13rem" class="sm:min-h-[20rem] md:min-h-[30rem] lg:min-h-[35rem]" />
    <div class="flex flex-col items-center absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full p-6 sm:w-4/5 sm:p-0">
      <i18n-t
        scope="global"
        tag="h1" keypath="home.hero.heading"
        class="text-white text-center text-3xl font-bold select-none leading-6 sm:text-5xl sm:leading-10 md:text-6xl md:leading-11 lg:text-8xl lg:leading-18"
      >
        <template #heading_gradient>
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-emerald-400">
            {{ $t('home.hero.heading_gradient') }}
          </span>
        </template>
      </i18n-t>
      <div class="flex justify-start mt-6 w-full p-input-icon-left">
        <AutoComplete
          v-model="query" @complete="search" @item-select="onItemSelect"
          @keyup.enter="() => (query && foundEventsIds?.total === 0) && $router.push({ path: '/search', query: { q: query } })"
          class="p-input-icon-left w-full" option-label="name" data-key="id" complete-on-focus :suggestions="foundEvents"
          :min-length="3" scroll-height="200" :placeholder="$t('home.hero.searchPlaceholder')"
          :pt="{ input: { class: 'flex-1' } }" :empty-search-message="$t('home.hero.emptySearchMessage')"
          :search-message="$t('home.hero.searchResultsCount', { count: foundEventsIds?.total })"
        >
          <template #header>
            <div class="flex items-center justify-between px-3 pt-3">
              <span class="text-sm text-primary font-semibold">
                {{ $t('home.hero.searchResults') }}
              </span>
              <span class="text-sm text-primary font-semibold">
                {{ $t('home.hero.searchResultsCount', { count: foundEventsIds?.total }) }}
              </span>
            </div>
          </template>
          <template #footer>
            <div class="flex items-center justify-start px-3 pb-3 bg-grey">
              <NuxtLink class="text-sm text-primary" :to="{ name: 'search', query: { q: query } }">
                <template v-if="foundEventsIds?.total > MAX_RESULTS">
                  {{ $t('home.hero.searchResultsMore') }}
                </template>
                <template v-else>
                  {{ $t('home.hero.searchResultsSee') }}
                </template>
              </NuxtLink>
            </div>
          </template>
        </AutoComplete>
        <Icon v-if="!isSearchingEvents" name="fa-solid:search" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import pluralize from 'pluralize'

const images = import.meta.glob('@/assets/images/hero/*.jpg', { eager: true, import: 'default' })

const router = useRouter()
const loaded = ref(false)
const query = ref()
const isSearchingEvents = ref(false)
const foundEvents = ref()
const foundEventsIds = ref<{ results: number[], total: number }>({ results: [], total: 0 })

const MAX_RESULTS = 3
const HERO_IMAGES = Object.keys(images).map(key => images[key])

const search = async (event: any) => {
  isSearchingEvents.value = true
  const { data }: any = await useCustomFetch('/search', {
    method: 'POST',
    body: JSON.stringify({
      query: event.query,
      size: MAX_RESULTS,
      page: 0
    })
  })
  console.info(data.value)
  foundEventsIds.value = data.value
  const eventsBody = computed(() => {
    const body = {
      ids: foundEventsIds.value.results
    }
    return body
  })
  const { data: events } = await useCustomFetch('/events/ids', {
    method: 'POST',
    body: eventsBody
  })
  foundEvents.value = events.value
  isSearchingEvents.value = false
}

const onItemSelect = (event: any) => {
  query.value = event.value
  router.push({
    path: `/${pluralize(event.value.type.toLowerCase())}/${event.value.id}`
  })
}

onMounted(() => {
  loaded.value = true
})
</script>

<style scoped></style>
