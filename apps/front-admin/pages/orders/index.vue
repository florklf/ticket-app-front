<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Order } from 'ts-interfaces'

const { data: orders } = await useCustomFetch<Order[]>('/orders')

const dataTable = ref()
const exportCSV = () => {
  if (!dataTable.value) {
    toast.add({ severity: 'warn', summary: 'No data to export', life: 3000 })
  }
  dataTable.value.exportCSV()
}
const toast = useToast()
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
        <OrderTable :orders="orders" header="Gestion des commandes" />
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
