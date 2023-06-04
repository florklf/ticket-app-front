<template>
  <footer>
    <div class="mx-auto max-w-7xl overflow-hidden px-6 py-10">
      <nav class="-mb-6 columns-2 flex flex-wrap justify-center space-x-12 gap-x-4" aria-label="Footer">
        <div v-for="item in navigation.main" :key="item.name" class="pb-6">
          <NuxtLink :to="item.to" class="text-sm leading-6 text-gray-600 hover:text-gray-900">
            {{ $t(item.name) }}
          </NuxtLink>
        </div>
      </nav>
      <p class="mt-8 text-center text-xs leading-5 text-gray-500">
        &copy; {{ currentYear }} Ticket App, Inc. {{ $t('footer.rights') }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { PATH as constantPath } from '@/constants/pages'

const currentYear = new Date().getFullYear()

const navigation = {
  main: [
    {
      name: 'navbar.home',
      to: constantPath.HOME_PAGE
    },
    {
      name: 'navbar.concert',
      to: constantPath.CONCERTS_PAGE
    }
  ]
}
</script>
