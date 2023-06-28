<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Order } from 'ts-interfaces'

const { data: orders } = await useCustomFetch<Order[]>('/orders')

const ordersTable = computed(() => {
  return orders.value?.map((order: Order) => {
    return {
      ...order,
      created_at: new Date(order.created_at),
      name: `${order.user.firstname} ${order.user.lastname}`,
      fullBillingAddress: `${order.billing_address}, ${order.billing_zip} ${order.billing_city} ${order.billing_country}`,
      fullShippingAddress: `${order.shipping_address}, ${order.shipping_zip} ${order.shipping_city} ${order.shipping_country}`,
      country: regionNames.of(order.billing_country)
    }
  })
})
const dataTable = ref()
const exportCSV = () => {
  if (!dataTable.value) {
    toast.add({ severity: 'warn', summary: 'No data to export', life: 3000 })
  }
  dataTable.value.exportCSV()
}
const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' })
const dayjs = useDayjs()
const toast = useToast()
const loading = ref(false)
const filters = ref()
const expandedRows = ref([])

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    fullBillingAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    fullShippingAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    country: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'payment.amount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
  }
}

initFilters()

const clearFilter1 = () => {
  initFilters()
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div v-if="orders" class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template #start>
            <div style="text-align: left">
              <Button @click="exportCSV" icon="pi pi-external-link" label="Export" />
            </div>
          </template>
        </Toolbar>
        <DataTable
          ref="dataTable"
          v-model:expanded-rows="expandedRows"
          v-model:filters="filters"
          :value="ordersTable"
          :paginator="true"
          class="p-datatable-gridlines"
          :rows="10"
          data-key="id"
          :row-hover="true"
          filter-display="menu"
          :loading="loading"
          responsive-layout="scroll"
          :global-filter-fields="['id', 'fullBillingAddress', 'fullShippingAddress', 'name', 'amount', 'country']"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">
                Gestion des commandes
              </h5>
              <div class="flex gap-4">
                <Button @click="clearFilter1()" type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" />
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" orderholder="Search..." />
                </span>
              </div>
            </div>
          </template>
          <template #empty>
            Aucune commande trouvé
          </template>
          <template #loading>
            Chargement des commandes...
          </template>
          <Column expander style="width: 3rem" />
          <Column field="id" header="Id" sortable />
          <Column
            field="created_at" filter-field="created_at" sortable header="Date" data-type="date"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              {{ dayjs(data?.created_at).format('DD/MM/YYYY HH[h]mm') }}
            </template>
            <template #filter="{ filterModel }">
              <Calendar v-model="filterModel.value" date-format="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
            </template>
          </Column>
          <Column field="name" header="Nom" sortable style="min-width: 12rem">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by name" />
            </template>
          </Column>
          <Column header="Pays de facturation" field="country" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.billing_country.toLowerCase()}`" style="width: 24px">
                <span>{{ regionNames.of(data.billing_country) }}</span>
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by country" />
            </template>
          </Column>
          <Column sortable sort-field="fullBillingAddress" filter-field="fullBillingAddress" header="Addresse de facturation" style="min-width: 12rem">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by address" />
            </template>
            <template #body="{ data }">
              <span class="block">{{ data.billing_address }}</span>
              <span class="text-sm font-italic">{{ data.billing_zip }} {{ data.billing_city }}</span>
            </template>
            <template #filterclear="{ filterCallback }">
              <Button @click="filterCallback()" type="button" icon="pi pi-times" class="p-button-secondary" />
            </template>
          </Column>
          <Column sortable sort-field="fullShippingAddress" filter-field="fullShippingAddress" header="Addresse de livraison" style="min-width: 12rem">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by address" />
            </template>
            <template #body="{ data }">
              <span class="block">{{ data.shipping_address }}</span>
              <span class="text-sm font-italic">{{ data.shipping_zip }} {{ data.shipping_city }}</span>
            </template>
            <template #filterclear="{ filterCallback }">
              <Button @click="filterCallback()" type="button" icon="pi pi-times" class="p-button-secondary" />
            </template>
          </Column>
          <Column field="payment.amount" header="Montant" sortable data-type="numeric">
            <template #body="slotProps">
              {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(slotProps.data.payment.amount) }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="number" class="p-column-filter" />
            </template>
          </Column>
          <Column header-style="width: 5rem; text-align: center" body-style="text-align: center; overflow: visible">
            <template #body="slotProps">
              <NuxtLink :to="`orders/${slotProps.data.id}`">
                <Button type="button" icon="pi pi-cog" rounded />
              </NuxtLink>
            </template>
          </Column>
          <template #expansion="slotProps">
            <div class="p-3">
              <h5>
                Articles de la commande #{{ slotProps.data?.id }}
              </h5>
              <DataTable :value="slotProps.data.orderItems">
                <Column field="id" header="Id" sortable />
                <Column field="seatType.seatType.name" header="Nom" sortable />
                <Column field="quantity" header="Quantité" sortable />
              </DataTable>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}
::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
