<template>
  <div>
    <Head>
      <Title>{{ $t('dashboard.order.title') }}</Title>
    </Head>
    <h1 class="text-xl font-bold text-center mt-3 mb-6">
      {{ $t('dashboard.order.orderList.title') }}
    </h1>
    <DataTable
      v-model:expandedRows="expandedRows" @row-expand="onRowExpand" :value="ordersData" paginator data-key="id"
      :rows="10" striped-rows :rows-per-page-options="[10, 20, 50]" :loading="pending"
      :pt="{ rowExpansion: { class: 'container mx-auto' } }"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center">
          {{ $t('dashboard.order.orderList.empty') }}
        </div>
      </template>
      <template #loading>
        <ProgressSpinner />
      </template>
      <Column expander />
      <Column field="id" header="N°" />
      <Column
        :field="(order) => `${order.billing_address}, ${order.billing_city} ${order.billing_zip} - ${order.billing_country}`"
        :header="$t('dashboard.order.orderList.billingAddress')"
      />
      <Column
        :field="(order) => `${order.shipping_address}, ${order.shipping_city} ${order.shipping_zip} - ${order.shipping_country}`"
        :header="$t('dashboard.order.orderList.shippingAddress')"
      />
      <Column field="created_at" :header="$t('dashboard.order.orderList.buyingDate')">
        <template #body="slotProps">
          {{ new Date(slotProps.data.created_at).toLocaleDateString() }}
          {{ $t('dashboard.order.at') }}
          {{ new Date(slotProps.data.created_at).toLocaleTimeString() }}
        </template>
      </Column>
      <template #expansion>
        <div class="flex flex-col">
          <TabView :pt="{ panelContainer: { style: 'padding: 0' } }">
            <template v-for="item in orderItems.value" :key="item.id">
              <TabPanel :header="item.eventName" :pt="{ headerAction: { style: 'background-color: transparent' } }">
                <DataTable :value="item.items" :rows="10" :rows-per-page-options="[10, 20, 50]">
                  <template #loading>
                    <ProgressSpinner />
                  </template>
                  <Column field="seatType.seatType.name" :header="$t('dashboard.order.orderList.seatType')" />
                  <Column :field="(item) => `${item.seatType.price}€`" :header="$t('dashboard.order.orderList.price')" />
                  <Column
                    :field="(item) => `${item.quantity} ${$t('dashboard.order.orderList.quantityLabel')}`"
                    :header="$t('dashboard.order.orderList.quantity')"
                  />
                  <Column
                    :field="(item) => `${item.seatType.price * item.quantity}€`"
                    :header="$t('dashboard.order.orderList.totalPrice')"
                  />
                  <Column :header="$t('dashboard.order.orderList.qrCode')">
                    <template #body="currItem">
                      <Button @click.prevent="onQRCodeModalOpen(currItem)">
                        <template #icon>
                          <Icon name="fa-solid:qrcode" />
                        </template>
                      </Button>
                    </template>
                  </Column>
                </DataTable>
              </TabPanel>
            </template>
          </TabView>
          <!-- Side by side layout (left place, right payment) -->
          <div class="flex flex-col justify-between items-start mt-4 gap-8 sm:gap-16 sm:flex-row">
            <div v-if="orderEvent.place" class="flex flex-col flex-1 gap-2">
              <div class="flex flex-col gap-2">
                <div>
                  <span class="text-xl font-bold">
                    {{ $t('dashboard.order.orderList.place.addressReminder') }}
                  </span>
                </div>
                <div class="flex flex-col items-start gap-1">
                  <Chip>
                    <template #default>
                      <Icon name="fa6-solid:clock" class="mr-2" />
                      <span class="font-bold">{{ $t('dashboard.order.orderList.event.date') }}:</span>
                      <span class="ml-2">
                        {{ new Date(orderEvent.date).toLocaleDateString() }}
                        {{ $t('dashboard.order.at') }}
                        {{ new Date(orderEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                      </span>
                    </template>
                  </Chip>
                  <Chip>
                    <template #default>
                      <Icon name="fa6-solid:location-dot" class="mr-2" />
                      <span class="font-bold">{{ $t('dashboard.order.orderList.place.title') }}:</span>
                      <span class="ml-2">{{ orderEvent.place?.name }}</span>
                    </template>
                  </Chip>
                </div>
              </div>
              <iframe
                v-if="orderEvent.place" class="w-full h-64" style="border:0" loading="lazy" allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="`https://www.google.com/maps/embed/v1/place?key=${config.public.googleApiKey}&q=${orderEvent.place.address} ${orderEvent.place.city} ${orderEvent.place.zip}`"
              />
              <Skeleton v-if="!orderEvent.place" height="16rem" />
            </div>
            <div class="flex flex-col sm:items-end sm:justify-end">
              <div class="flex items-center">
                <span class="font-bold">{{ $t('dashboard.order.orderList.payment.paymentMethod') }}:</span>
                <span class="ml-2">{{ orderPayment.payment_method }}</span>
              </div>
              <div class="flex items-center ">
                <span class="font-bold">{{ $t('dashboard.order.orderList.payment.paymentStatus') }}:</span>
                <span class="ml-2">{{ orderPayment.status }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-bold">{{ $t('dashboard.order.orderList.payment.cardNumber') }}:</span>
                <img :src="`https://logo.clearbit.com/${orderPayment.card_type}.com`" class="ml-2" width="30" height="30">
                <span class="ml-2">••••&nbsp; ••••&nbsp; ••••&nbsp; {{ orderPayment.card_last4 }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-bold">{{ $t('dashboard.order.orderList.payment.paymentDate') }}:</span>
                <span class="ml-2">
                  {{ new Date(orderPayment.created_at).toLocaleDateString() }}
                  {{ $t('dashboard.order.at') }}
                  {{ new Date(orderPayment.created_at).toLocaleTimeString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
    <Dialog
      v-model:visible="showQRCodeModal" :dismissable-mask="true" modal :draggable="false"
      class="w-full m-3 sm:w-3/4 sm:m-0" :header="$t('dashboard.order.orderList.qrCodeModal.title')"
    >
      <Carousel v-if="modalQrCodes" :value="modalQrCodes" circular class="my-4">
        <template #item="qr">
          <div class="flex flex-col items-center justify-center">
            <h1 class="text-2xl font-bold mb-2">
              {{ $t('dashboard.order.orderList.qrCodeModal.ticket') }} {{
                qr.index + 1 }}
            </h1>
            <span class="text-sm">{{ $t('dashboard.order.orderList.qrCodeModal.description') }}</span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <img :src="qr.data" width="200" height="200">
          </div>
        </template>
      </Carousel>
    </Dialog>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'

const config = useRuntimeConfig()
const expandedRows = ref([])
const orderItems = reactive({})
const orderPayment = ref({})
const orderEvent = ref({})
const showQRCodeModal = ref(false)
const modalQrCodes = ref(null)
const toast = useToast()

const { data: ordersData, error } = await useCustomFetch('/orders')
if (error.value) {
  toast.add({
    severity: 'error',
    summary: 'Error Message',
    detail: error.value,
    life: 3000
  })
}

const onRowExpand = async (event) => {
  expandedRows.value = [event.data]
  const { data: orderExpandedData, error } = await useCustomFetch(`/orders/${event.data.id}?include=true`)
  if (error.value) {
    toast.add({
      severity: 'error',
      summary: 'Error Message',
      detail: error.value,
      life: 3000
    })
  }
  const groupedOrderItems = await orderExpandedData.value.orderItems.reduce((acc, item) => {
    const found = acc.find(group => group.eventId === item.seatType.event.id)
    if (found) {
      found.items.push(item)
    } else {
      acc.push({
        eventId: item.seatType.event.id,
        eventName: item.seatType.event.name,
        items: [item]
      })
    }
    return acc
  }, [])
  orderItems.value = groupedOrderItems
  orderPayment.value = orderExpandedData.value.payment
  orderEvent.value = orderExpandedData.value.orderItems[0].seatType.event
}

const onQRCodeModalOpen = (item) => {
  modalQrCodes.value = item.data.qrCode.map(qrCode => qrCode.qr_code)
  showQRCodeModal.value = true
}

</script>

<style>
.p-tabview-nav {
  background-color: transparent !important;
}
</style>
