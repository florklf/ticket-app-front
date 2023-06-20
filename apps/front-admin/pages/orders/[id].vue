<script setup lang="ts">
import { Order, OrderItem } from 'ts-interfaces'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: order } = await useCustomFetch<Order>(`/orders/${route.params.id}?include=true`)
const layout = ref<'grid' | 'list' | undefined>('list')
const dayjs = useDayjs()
const seeInvoice = () => {
  window.open(`https://app.snipcart.com/invoice/${order.value?.snipcart_id}`, '_blank')
}

const getSeverity = (orderItem: OrderItem) => {
  if (orderItem.available_seats < 1) {
    return 'danger'
  } else if (orderItem.available_seats < orderItem.seatType.seatType.capacity / 20) {
    return 'warning'
  } else {
    return 'success'
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div v-if="order?.id" class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template #start>
            <h2>Commande # {{ route.params.id }}</h2>
          </template>
          <template #end>
            <Button @click="seeInvoice" label="Facture" icon="pi pi-external-link" class="p-button-success p-mr-2" />
          </template>
        </Toolbar>
        <div class="surface-section">
          <ul class="list-none p-0 m-0">
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-4">
              <div class="text-500 w-6 md:w-2 font-medium">
                Client
              </div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <span class="block">{{ order.user?.firstname }} {{ order.user?.lastname }}</span>
                <span>{{ order.user.email }}</span>
              </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-4">
              <div class="text-500 w-6 md:w-2 font-medium">
                Adresse de facturation
              </div>
              <div class="text-900 w-full md:w-8 flex flex-column">
                <span>{{ order.billing_address }}</span>
                <span>{{ order.billing_city }}, {{ order.billing_zip }}</span>
                <span>{{ order.billing_country }}</span>
              </div>
            </li>
            <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap gap-4">
              <div class="text-500 w-6 md:w-2 font-medium">
                Informations de paiement
              </div>
              <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <div v-if="order.payment" class="flex flex-column sm:items-end sm:justify-end">
                  <div class="flex flex-column sm:flex-row sm:align-items-center">
                    <span class="font-semibold">Méthode de paiement:</span>
                    <span class="ml-2">{{ $t(`payment.method.${order.payment.payment_method}`) }}</span>
                  </div>
                  <div class="flex flex-column sm:flex-row sm:align-items-center">
                    <span class="font-semibold">Statut:</span>
                    <span class="ml-2">{{ order.payment.status }}</span>
                  </div>
                  <div class="flex flex-column sm:flex-row sm:align-items-center">
                    <span class="font-semibold">Numéro de carte:</span>
                    <img v-if="order.payment.card_type" :src="`https://logo.clearbit.com/${order.payment.card_type}.com`" class="ml-2" width="25" height="10">
                    <span class="ml-2">••••&nbsp; ••••&nbsp; ••••&nbsp; {{ order.payment.card_last4 }}</span>
                  </div>
                  <div class="flex flex-column sm:flex-row sm:align-items-center">
                    <span class="font-semibold">Date de paiement:</span>
                    <span class="ml-2">
                      {{ dayjs(order.created_at).format('dddd DD MMMM YYYY - HH[h]mm') }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <DataView :value="order.orderItems" :layout="layout" data-key="orderItems">
          <template #list="slotProps">
            <div class="col-12">
              <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                  <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                    <div class="text-2xl font-bold text-900">
                      {{ slotProps.data.seatType.seatType.name }}
                    </div>
                    <div class="flex align-items-center gap-3">
                      <span class="flex align-items-center gap-2">
                        <span class="font-semibold">{{ slotProps.data.seatType.event.name }}</span>
                      </span>
                      <Tag :value="slotProps.data.seatType.event.type.name" />
                    </div>
                    <div>
                      <span class="font-semibold">Date:</span>
                      {{ dayjs(slotProps.data.seatType.event.date).format('DD/MM/YYYY - HH[h]mm') }}
                    </div>
                    <div>
                      <span class="font-semibold">Lieu:</span>
                      {{ slotProps.data.seatType.event.place.name }}
                    </div>
                    <div>
                      <span class="font-semibold">Adresse:</span>
                      {{ slotProps.data.seatType.event.place.address }}
                    </div>
                    <div>
                      <span class="font-semibold">ID:</span>
                      {{ slotProps.data.seatType.event.id }}
                    </div>
                  </div>
                  <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                    <span class="text-2xl font-semibold">
                      {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(slotProps.data.seatType.price) }}
                    </span>
                    <Tag :value="slotProps.data.seatType.available_seats" :severity="getSeverity(slotProps.data)" />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template #grid="slotProps">
            <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
              <div class="p-4 border-1 surface-border surface-card border-round">
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                  <div class="flex align-items-center gap-2">
                    <i class="pi pi-tag" />
                    <span class="font-semibold">{{ dayjs(slotProps.data.seatType.seatType.name).format('DD/MM/YYYY HH[h]mm') }}</span>
                  </div>
                  <Tag :value="slotProps.data.seatType.available_seats" :severity="getSeverity(slotProps.data)" />
                </div>
                <div class="flex flex-column align-items-center gap-3 py-5">
                  <div class="text-2xl font-bold flex flex-column align-items-center">
                    {{ slotProps.data.seatType.seatType.name }}
                    <small class="text-base font-normal">{{ slotProps.data.seatType.event.name }}</small>
                  </div>
                </div>
                <div class="flex align-items-center justify-content-between">
                  <span class="text-2xl font-semibold">
                    {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(slotProps.data.seatType.price) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>
