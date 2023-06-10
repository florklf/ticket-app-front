<template>
  <div>
    <Head>
      <Title>Dashboard</Title>
    </Head>
    <div class="container flex flex-col items-center justify-center my-16 mx-auto">
      <h1 class="text-4xl font-bold">
        {{ $t('dashboard.title') }}
      </h1>
      <TabView lazy class="w-full mt-6">
        <TabPanel :header="$t('dashboard.profile.title')">
          <ProfileDetails />
        </TabPanel>
        <TabPanel :header="$t('dashboard.order.title')">
          <OrdersList />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
