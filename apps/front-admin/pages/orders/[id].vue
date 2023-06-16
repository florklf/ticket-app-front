<script setup lang="ts">
import { Order } from '~/types/Orders/Order'

const route = useRoute()
const { data: order } = await useCustomFetch<Order>(`/orders/${route.params.id}`)
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
        </Toolbar>
      </div>
    </div>
  </div>
</template>
