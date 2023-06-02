<template>
  <header class="mb-10">
    <nav class="border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <NuxtLink :to="constantPath.HOME_PAGE" class="styled-logo" />
        <div class="flex items-center lg:order-2">
          <template v-if="status === 'unauthenticated'">
            <NuxtLink :to="constantPath.SIGNIN_PAGE" active-class="text-white" exact-active-class="text-white" class="text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-primary-800">
              Je me connecte
            </NuxtLink>
          </template>
          <template v-else>
            <button @click="signOut()" class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">
              Déconnexion
            </button>
          </template>
        </div>
        <div class="justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <NuxtLink :to="constantPath.HOME_PAGE" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="constantPath.CONCERTS_PAGE" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                Concerts
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <hr>
  </header>
</template>

<script setup lang="ts">
import { PATH as constantPath } from '@/constants/pages'

const { status, signOut } = useAuth()
</script>

<style scoped>
.styled-logo {
    text-decoration: none;
    height: 30px;
    width: 135px;
    background-image: url('@/assets/logo.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
}
</style>
