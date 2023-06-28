<script setup lang="ts">
import { User } from 'ts-interfaces'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: user } = await useCustomFetch<User>(`/users/${route.params.id}`)
</script>

<template>
  <!-- TODO: user details page -->
  <div class="grid">
    <div class="col-12">
      <div v-if="user?.id" class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template #start>
            <h2>{{ user?.firstname }} {{ user?.lastname }}</h2>
          </template>
        </Toolbar>
      </div>
    </div>
  </div>
</template>
