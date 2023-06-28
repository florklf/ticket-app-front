<template>
  <div>
    <Head>
      <Title>{{ spectacle?.name }}</Title>
    </Head>
    <Breadcrumb
      :home="{ to: '/', label: $t('navbar.home') }" :model="items" class="mb-6"
      :style="{ 'border-radius': 0 }"
    />
    <div class="container mx-auto">
      <div class="relative md:mb-36">
        <img v-if="spectacle" :src="spectacle.image" :alt="spectacle.name" class="w-full object-cover h-60 sm:h-72">
        <Skeleton v-else height="15rem" class="z-0" />
        <div class="flex flex-col gap-2 tracking-tight bg-primary text-textonprimary sm:text-4xl inline-block px-14 py-10 w-full md:w-auto md:absolute md:rounded-tr-3xl md:bottom-[-3.5em]">
          <div v-if="spectacle" class="flex flex-wrap gap-2">
            <Chip
              v-for="eventGenre in spectacle.eventGenres" :key="eventGenre.id" :pt="{
                root: { class: 'bg-gradient-to-r from-white to-gray-200' }
              }"
            >
              <template #default>
                <span class="p-chip-text text-gray-800 text-xs">{{ eventGenre.genre.name }}</span>
              </template>
            </Chip>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-3xl font-bold ">
            <Chip
              v-if="spectacle" :pt="{
                root: { class: 'bg-gradient-to-r from-primarylight to-primary' }
              }"
            >
              <template #default>
                <span class="p-chip-text text-white text-xs">{{ spectacle.type.name }}</span>
              </template>
            </Chip>
            <template v-else>
              <div class="flex">
                <Skeleton v-for="i in 2" :key="i" height="1.5rem" width="4rem" class="my-1 mr-2" />
              </div>
            </template>
            <h1 v-if="spectacle">
              {{ spectacle.name }}
            </h1>
            <Skeleton v-else height="2rem" width="100%" />
          </div>
          <div v-if="spectacle" class="flex items-center gap-2 text-lg ">
            <Icon name="ic:outline-group" width="1.5rem" height="1.5rem" />
            <div class="flex flex-wrap flex-1 items-center gap-1 leading-none">
              <template v-for="(eventArtist, index) in spectacle.eventArtists" :key="eventArtist.id">
                <span>{{ eventArtist.artist.name }} <template v-if="index < spectacle.eventArtists.length - 1">/</template></span>
              </template>
            </div>
          </div>
          <template v-else>
            <Skeleton v-for="i in 2" :key="i" height="1rem" width="16rem" class="my-1" />
          </template>
          <div class="flex flex-col font-light text-lg gap-1">
            <div v-if="spectacle" class="flex items-center gap-2">
              <Icon name="ic:sharp-place" />
              <div class="flex items-center gap-1 leading-none">
                <span>{{ spectacle.place.name }}, {{ spectacle.place.city }}</span>
              </div>
            </div>
            <Skeleton v-else height="1rem" width="10rem" />
            <div v-if="spectacle" class="flex items-center gap-2">
              <Icon name="material-symbols:date-range" />
              <div>{{ dayjs(spectacle?.date).format('dddd DD MMMM YYYY, HH:mm') }}</div>
            </div>
            <Skeleton v-else height="1rem" width="10rem" />
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-2xl px-2 lg:grid lg:max-w-full lg:grid-cols-2 lg:gap-x-12">
        <!-- spectacle details -->
        <section class="my-4">
          <Accordion :active-index="0">
            <AccordionTab :header="$t('event.details.description')">
              <template v-for="i in 4">
                <Skeleton v-if="!spectacle" :key="i" class="mb-2" />
              </template>
              <div v-if="spectacle" class="flex flex-col gap-3 text-base text-gray-500">
                <p>
                  {{ spectacle?.description }}
                </p>
                <p class="flex flex-col">
                  <span class="font-bold">{{ $t('event.details.inLineUp') }} :</span>
                  <span>
                    <template v-for="(eventArtist, index) in spectacle?.eventArtists" :key="eventArtist.id">
                      <span>{{ eventArtist.artist.name }}<template v-if="index < spectacle.eventArtists.length - 1"> /
                      </template></span>
                    </template>
                  </span>
                </p>
              </div>
            </AccordionTab>
            <AccordionTab :header="$t('event.details.place')">
              <iframe
                v-if="spectacle" class="w-full h-64" style="border:0" loading="lazy" allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="`https://www.google.com/maps/embed/v1/place?key=${config.public.googleApiKey}&q=${spectacle?.place?.address} ${spectacle?.place?.city} ${spectacle?.place?.zip}`"
              />
              <Skeleton v-if="!spectacle" height="16rem" />
              <template v-for="i in 5">
                <Skeleton v-if="!spectacle" :key="i" class="my-2" />
              </template>
              <p class="text-xl font-bold mt-6">
                {{ spectacle?.place?.name }}
              </p>
              <div class="flex flex-col">
                <span>{{ spectacle?.place?.address }}</span>
                <span>{{ spectacle?.place?.city }} {{ spectacle?.place?.zip }}</span>
              </div>
              <p class="mt-6">
                {{ spectacle?.place?.description }}
              </p>
            </AccordionTab>
          </Accordion>
        </section>

        <!-- spectacle form -->
        <section class="space-y-4">
          <span class="text-text text-2xl">{{ $t('event.reservation.title') }} :</span>
          <form>
            <div class="flex flex-col justify-between gap-4">
              <!-- Seat selector -->
              <template v-for="i in 3">
                <Skeleton v-if="!spectacle" :key="i" height="5rem" />
              </template>
              <div
                v-for="eventSeatType in spectacle?.EventSeatType" :key="eventSeatType.id"
                class="flex flex-col sm:flex-row justify-center items-center bg-bghighlight text-texthighlight p-4 rounded"
              >
                <label for="seat-type" class="grow text-xl font-medium">{{ eventSeatType.seatType.name }}</label>
                <span class="text-xl font-bold sm:mr-4">{{ eventSeatType.price }} €</span>
                <InputNumber
                  v-model="(seatsSelection as any)[eventSeatType.id]" input-id="horizontal-buttons"
                  show-buttons button-layout="horizontal" :step="1" :min="0" :max="eventSeatType.available_seats"
                >
                  <template #decrementbuttonicon>
                    <Icon name="ic:baseline-minus" />
                  </template>
                  <template #incrementbuttonicon>
                    <Icon name="material-symbols:add" />
                  </template>
                </InputNumber>
              </div>
            </div>
            <div class="my-4">
              <a href="#" class="group inline-flex text-sm text-gray-500 hover:text-gray-700">
                <span @click.prevent="showCategoryPopup = true">{{ $t('event.reservation.seeCategories') }}</span>
                <Dialog
                  v-model:visible="showCategoryPopup" :dismissable-mask="true" modal :draggable="false"
                  class="w-full m-3 sm:w-3/4 sm:m-0" :header="$t('event.reservation.modalAvailableSeatType')"
                >
                  <Fieldset
                    v-for="eventSeatType in spectacle?.EventSeatType" :key="eventSeatType.id" class="mb-8"
                    :legend="eventSeatType.seatType.name"
                  >
                    <p>Prix: {{ eventSeatType.price }} €</p>
                    <p>Capacité: {{ eventSeatType.seatType.capacity }}</p>
                    <p class="mt-2">{{ eventSeatType.seatType.description }}</p>
                  </Fieldset>
                </Dialog>
              </a>
            </div>
            <div class="flex justify-center sm:justify-end">
              <Toast group="reservation" />
              <Button
                @click="addToCart" variant="secondary" size="large" :label="$t('event.reservation.addToCart')"
                class="space-x-4"
                :disabled="Object.values(seatsSelection).reduce((acc: any, curr) => acc + curr, 0) === 0 && status === 'authenticated'"
              >
                <template #icon>
                  <Icon name="material-symbols:add-shopping-cart" />
                </template>
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { Event } from 'ts-interfaces'
import { PATH as constantPath } from '@/constants/pages'
useHead({ titleTemplate: '%s » Spectacles' })

const route = useRoute()
const dayjs = useDayjs()
const toast = useToast()
const seatsSelection = reactive({})
const config = useRuntimeConfig()
const { status, data } = useAuth()
const { data: spectacle } = await useCustomFetch<Event>(`/events/${route.params.id}`)
const i18n = useI18n({ useScope: 'global' })

const items = ref([
  { label: i18n.t('spectacle.title'), to: constantPath.SPECTACLES_PAGE },
  { label: spectacle.value?.name }
])
const showCategoryPopup = ref(false)
const userId = (data.value as any)?.user.id

const addToCart = async () => {
  // Check if user is authenticated and if he selected at least one seat
  if (status.value !== 'authenticated') {
    toast.removeGroup('reservation')
    return toast.add({
      severity: 'info',
      summary: i18n.t('event.reservation.addToCartNotConnected'),
      life: 5000,
      group: 'reservation'
    })
  }
  if (Object.values(seatsSelection).reduce((acc: any, curr) => acc + curr, 0) === 0) {
    return
  }
  try {
    for (const [id, quantity] of Object.entries(seatsSelection)) {
      if (quantity === 0) { continue }
      await window.Snipcart.api.cart.items.add({
        id,
        name: spectacle.value?.EventSeatType.find(type => type.id === +id)?.seatType.name,
        price: spectacle.value?.EventSeatType.find(type => type.id === +id)?.price,
        quantity,
        url: `${config.public.apiBase}/events/seat-types/${id}`,
        customFields: [
          { name: 'event_name', value: spectacle.value?.name, type: 'string' },
          { name: 'event_type', value: spectacle.value?.type.name, type: 'string' },
          { name: 'event_date', value: dayjs(spectacle.value?.date).format('DD/MM/YYYY - hh[h]mm'), type: 'string' },
          { name: 'event_place', value: spectacle.value?.place.name, type: 'string' }
        ]
      })
      await window.Snipcart.api.cart.update({
        // @ts-ignore
        customFields: [
          { name: 'userId', value: userId, type: 'string' }
        ]
      })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped></style>
