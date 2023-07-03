<template>
  <div>
    <Head>
      <Title>{{ $t('dashboard.profile.title') }}</Title>
    </Head>

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-gray-200 bg-cover bg-center" style="background-image: url('https://picsum.photos/200')" />
        <div class="flex flex-col flex-1">
          <h2 class="text-lg font-bold">
            {{ userData?.firstname }} {{ userData.lastname }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ userData?.email }}
          </p>
        </div>
        <div class="">
          <Button @click="onEditProfileModalOpen" class="w-full" label="Modifier" />
        </div>
      </div>
      <div class="flex items-center">
        <div>
          <h3 class="text-lg font-bold">
            {{ $t('dashboard.order.title') }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ $t('dashboard.profile.orderCount', { count: userData.Order.length }) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const { data: userData, error } = await useCustomFetch('/users/me')
if (error.value) {
  toast.add({
    severity: 'error',
    summary: 'Error Message',
    detail: error.value,
    life: 3000
  })
}

const onEditProfileModalOpen = () => {
  toast.add({
    severity: 'info',
    summary: 'Info Message',
    detail: 'Not implemented yet',
    life: 3000
  })
}
</script>
