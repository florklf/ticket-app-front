<template>
  <div>
    <Head>
      <Title>{{ concert?.name }}</Title>
    </Head>
    <Breadcrumb
      :home="{ to: '/', label: $t('navbar.home') }" :model="items" class="mb-6"
      :style="{ 'border-radius': 0 }"
    />
    <div class="container mx-auto">
      <div class="relative mb-32">
        <img v-if="concert" :src="concert?.image" :alt="concert?.name" class="w-full object-cover h-60">
        <Skeleton v-if="!concert" height="15rem" class="z-0" />
        <div class="text-3xl font-bold tracking-tight bg-primary text-textonprimary sm:text-4xl inline-block py-10 px-20 absolute bottom-[-3em]">
          <h1>{{ concert?.name }}</h1>
          <span class="text-xl caca font-normal block mb-8">{{ concert?.type }} - {{ concert?.artist?.name }}</span>
          <div class="flex font-light text-lg gap-x-12">
            <div class="flex items-center gap-2">
              <Icon name="ic:sharp-place" />
              <div class="flex flex-col leading-none">
                <span>{{ concert?.place.name }}</span>
                <small>{{ concert?.place?.city }}</small>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="material-symbols:date-range" />
              <div>{{ dayjs(concert?.date).format('DD/MM/YYYY à HH[h]mm') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-2xl px-2 lg:grid lg:max-w-full lg:grid-cols-2 lg:gap-x-12">
        <!-- concert details -->
        <section class="mt-4">
          <Accordion :active-index="0">
            <AccordionTab :header="$t('concert.details.description')">
              <template v-for="i in 4">
                <Skeleton v-if="!concert" :key="i" class="mb-2" />
              </template>
              <p class="text-base text-gray-500">
                {{ concert?.description }}
              </p>
            </AccordionTab>
            <AccordionTab :header="$t('concert.details.place')">
              <iframe
                v-if="concert"
                class="w-full h-64" style="border:0" loading="lazy" allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="`https://www.google.com/maps/embed/v1/place?key=${config.public.googleApiKey}&q=${concert?.place?.address} ${concert?.place?.city} ${concert?.place?.zip}`"
              />
              <Skeleton v-if="!concert" height="16rem" />
              <template v-for="i in 5">
                <Skeleton v-if="!concert" :key="i" class="my-2" />
              </template>
              <p class="text-xl font-bold mt-6">
                {{ concert?.place?.name }}
              </p>
              <div class="flex flex-col">
                <span>{{ concert?.place?.address }}</span>
                <span>{{ concert?.place?.city }} {{ concert?.place?.zip }}</span>
              </div>
              <p class="mt-6">
                {{ concert?.place?.description }}
              </p>
            </AccordionTab>
          </Accordion>
        </section>

        <!-- concert form -->
        <section class="space-y-4">
          <span class="text-text text-2xl">{{ $t('concert.reservation.title') }} :</span>
          <form>
            <div class="sm:flex sm:flex-col sm:justify-between gap-4">
              <!-- Seat selector -->
              <template v-for="i in 3">
                <Skeleton v-if="!concert" :key="i" height="5rem" />
              </template>
              <div
                v-for="eventSeatType in concert?.EventSeatType" :key="eventSeatType.id"
                class="flex items-center bg-bghighlight text-texthighlight p-4 rounded"
              >
                <label for="seat-type" class="grow text-xl font-medium">{{ eventSeatType.seatType.name }}</label>
                <span class="text-xl font-bold mr-4">{{ eventSeatType.price }} €</span>
                <InputNumber
                  v-model="(seatsSelection as any)[eventSeatType.id]" class="" input-id="horizontal-buttons"
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
            <div class="mt-4">
              <a href="#" class="group inline-flex text-sm text-gray-500 hover:text-gray-700">
                <span @click.prevent="showCategoryPopup = true">{{ $t('concert.reservation.seeCategories') }}</span>
                <Dialog
                  v-model:visible="showCategoryPopup" :dismissable-mask="true" modal :draggable="false"
                  header="Catégories de places disponibles" class="sm:w-3/4 md:w-1/2"
                >
                  <Fieldset
                    v-for="eventSeatType in concert?.EventSeatType" :key="eventSeatType.id" class="mb-8"
                    :legend="eventSeatType.seatType.name"
                  >
                    <p>Prix: {{ eventSeatType.price }} €</p>
                    <p>Capacité: {{ eventSeatType.seatType.capacity }}</p>
                    <p class="mt-2">{{ eventSeatType.seatType.description }}</p>
                  </Fieldset>
                </Dialog>
              </a>
            </div>
            <div class="mt-2 flex justify-end">
              <Button
                v-tooltip.top="{ value: $t('concert.reservation.addToCartNotConnected'), disabled: status === 'authenticated', class: 'text-center' }" @click="addToCart" variant="secondary" size="large"
                :label="$t('concert.reservation.addToCart')"
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
import { Concert } from '~/types/Events/Concert'
import { PATH as constantPath } from '@/constants/pages'
useHead({ titleTemplate: '%s » Concerts' })

const route = useRoute()
const dayjs = useDayjs()
const seatsSelection = reactive({})
const config = useRuntimeConfig()
const { status, data } = useAuth()
const { data: concert } = await useCustomFetch<Concert>(`/events/${route.params.id}`)
const i18n = useI18n()

const items = ref([
  { label: i18n.t('concert.title'), to: constantPath.CONCERTS_PAGE },
  { label: concert.value?.name }
])
const showCategoryPopup = ref(false)
const userId = (data.value as any)?.user.id

const addToCart = async () => {
  // Check if user is authenticated and if he selected at least one seat
  if (status.value !== 'authenticated' || Object.values(seatsSelection).reduce((acc: any, curr) => acc + curr, 0) === 0) {
    return
  }
  try {
    for (const [id, quantity] of Object.entries(seatsSelection)) {
      if (quantity === 0) { continue }
      await window.Snipcart.api.cart.items.add({
        id,
        name: concert.value?.EventSeatType.find(type => type.id === +id)?.seatType.name,
        price: concert.value?.EventSeatType.find(type => type.id === +id)?.price,
        quantity,
        url: `${config.public.localExposedApiUrl}/events/seat-types/${id}`,
        customFields: [
          { name: 'event_name', value: concert.value?.name, type: 'string' },
          { name: 'event_type', value: concert.value?.type, type: 'string' },
          { name: 'event_date', value: dayjs(concert.value?.date).format('DD/MM/YYYY - hh[h]mm'), type: 'string' },
          { name: 'event_place', value: concert.value?.place.name, type: 'string' }
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
