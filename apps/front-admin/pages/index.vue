<script setup lang="ts">
import { ref } from 'vue'
import { Order, OrderItem, User } from 'ts-interfaces'
import { EnumTimeScope } from '@/types/EnumTimeScope'

const dayjs = useDayjs()

const { data: orders } = await useCustomFetch<Order[]>('/orders')
const { data: users } = await useCustomFetch<User[]>('/users')
const timeScopes = ref(Object.values(EnumTimeScope))
const selectedTimeScope = ref(EnumTimeScope.WEEK)

const scopedOrders = computed(() => {
  return selectedTimeScope.value === EnumTimeScope.ALL ? orders.value : orders.value?.filter(order => dayjs(order.created_at).isAfter(dayjs().subtract(1, selectedTimeScope.value)))
})
const previousOrders = computed(() => {
  return orders.value?.filter(order => dayjs(order.created_at).isAfter(dayjs().subtract(2, selectedTimeScope.value)) && dayjs(order.created_at).isBefore(dayjs().subtract(1, selectedTimeScope.value)))
})

const totalOrdersEvolution = computed(() => {
  return (scopedOrders.value?.length ?? 0) - (previousOrders.value?.length ?? 0)
})

const totalRevenue = computed(() => {
  return scopedOrders.value?.reduce((total: number, order: Order) => total + order.payment.amount, 0) ?? 0
})
const totalRevenueEvolution = computed(() => {
  const previousRevenue = previousOrders.value?.reduce((total: number, order: Order) => total + order.payment.amount, 0) ?? 0
  return totalRevenue.value - previousRevenue
})

const totalClients = computed(() => {
  return selectedTimeScope.value === EnumTimeScope.ALL ? users.value?.length ?? 0 : users.value?.filter(user => dayjs(user.created_at).isAfter(dayjs().subtract(1, selectedTimeScope.value))).length ?? 0
})
const totalClientsEvolution = computed(() => {
  const previousTotalClient = users.value?.filter(user => dayjs(user.created_at).isAfter(dayjs().subtract(2, selectedTimeScope.value)) && dayjs(user.created_at).isBefore(dayjs().subtract(1, selectedTimeScope.value))).length ?? 0
  return totalClients.value - previousTotalClient
})

const totalTicketsSold = computed(() => {
  return scopedOrders.value?.reduce((total: number, order: Order) => total + (order.orderItems.reduce((orderTotal: number, item: OrderItem) => orderTotal + item.quantity, 0)), 0) ?? 0
})
const totalTicketsSoldEvolution = computed(() => {
  const previousTicketsSold = previousOrders.value?.reduce((total: number, order: Order) => total + (order.orderItems.reduce((orderTotal: number, item: OrderItem) => orderTotal + item.quantity, 0)), 0) ?? 0
  return totalTicketsSold.value - previousTicketsSold
})
const infoCardBodyLabel = computed(() => {
  switch (selectedTimeScope.value) {
    case EnumTimeScope.DAY:
      return ' par rapport à hier'
    case EnumTimeScope.WEEK:
      return ' par rapport à la semaine dernière'
    case EnumTimeScope.MONTH:
      return ' par rapport au mois dernier'
    case EnumTimeScope.YEAR:
      return ' par rapport à l\'année dernière'
    case EnumTimeScope.ALL:
      return ' par rapport au mois dernier'
  }
})
const timeScopeLabel = (timeScope: EnumTimeScope) => {
  switch (timeScope) {
    case EnumTimeScope.DAY:
      return 'Aujourd\'hui'
    case EnumTimeScope.WEEK:
      return 'Cette semaine'
    case EnumTimeScope.MONTH:
      return 'Ce mois-ci'
    case EnumTimeScope.YEAR:
      return 'Cette année'
    case EnumTimeScope.ALL:
      return 'Tout'
  }
}
</script>

<template>
  <div>
    <Dropdown
      v-model="selectedTimeScope" option-label="label" option-value="value" :options="timeScopes.map(timeScope => { return { label: timeScopeLabel(timeScope), value: timeScope} })" placeholder="Sélectionner une période"
      class="w-full md:w-14rem mb-4"
    />
    <div class="grid">
      <div class="col-12 lg:col-6 xl:col-3">
        <InfoCard v-if="orders" title="Commandes" :body="scopedOrders?.length">
          <template v-if="selectedTimeScope !== EnumTimeScope.ALL" #footer>
            <span class="text-green-500 font-medium" :class="{'text-red-500' : totalOrdersEvolution < 0}">{{ totalOrdersEvolution > 0 ? `+${totalOrdersEvolution}` : `${totalOrdersEvolution}` }}</span>
            <span class="text-500"> {{ infoCardBodyLabel }}</span>
          </template>
        </InfoCard>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <InfoCard
          title="Revenus" icon="pi pi-map-marker" icon-color="orange"
          :body="new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalRevenue)"
        >
          <template v-if="selectedTimeScope !== EnumTimeScope.ALL" #footer>
            <span class="text-green-500 font-medium" :class="{'text-red-500' : totalRevenueEvolution < 0}">{{ totalRevenueEvolution > 0 ? `+${totalRevenueEvolution}` : `${totalRevenueEvolution}` }}</span>
            <span class="text-500"> {{ infoCardBodyLabel }}</span>
          </template>
        </InfoCard>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <InfoCard title="Clients" :body="totalClients" icon="pi pi-inbox" icon-color="cyan">
          <template v-if="selectedTimeScope !== EnumTimeScope.ALL" #footer>
            <span class="text-green-500 font-medium" :class="{'text-red-500' : totalClientsEvolution < 0}">{{ totalClientsEvolution > 0 ? `+${totalClientsEvolution}` : `${totalClientsEvolution}` }}</span>
            <span class="text-500"> {{ infoCardBodyLabel }}</span>
          </template>
        </InfoCard>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <InfoCard title="Places vendues" :body="totalTicketsSold" icon="pi pi-inbox" icon-color="cyan">
          <template v-if="selectedTimeScope !== EnumTimeScope.ALL" #footer>
            <span class="text-green-500 font-medium" :class="{'text-red-500' : totalTicketsSoldEvolution < 0}">{{ totalTicketsSoldEvolution > 0 ? `+${totalTicketsSoldEvolution}` : `${totalTicketsSoldEvolution}` }}</span>
            <span class="text-500"> {{ infoCardBodyLabel }}</span>
          </template>
        </InfoCard>
      </div>
      <div class="col-12 xl:col-6">
        <div class="card">
          <h5>Commandes sur la période</h5>
          <OrderTable :orders="scopedOrders" :expanded="false" :rows="5" :only="['date','name','payment.amount','actions']" />
        </div>
      </div>
      <div class="col-12 xl:col-6">
        <div class="card">
          <h5>Aperçu des ventes</h5>
          <SalesChart :orders="scopedOrders" :time-scope="selectedTimeScope" />
        </div>
        <BestSellingCard :time-scope="selectedTimeScope" />
      </div>
    </div>
  </div>
</template>
