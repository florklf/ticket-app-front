<template>
  <header class="mb-10">
    <nav class="border-gray-200 px-4 lg:px-6 py-2.5">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <NuxtLink :to="constantPath.HOME_PAGE" class="styled-logo" />
        <div class="flex items-center lg:order-2">
          <template v-if="status === 'unauthenticated'">
            <Button
              @click="() => $router.push(constantPath.SIGNIN_PAGE)"
              size="small"
              label="Je me connecte" 
            />
          </template>
          <template v-else>
            <Button
              @click="signOut()"
              severity="danger"
              size="small"
              label="Déconnexion"
              outlined
            />
          </template>
        </div>
        <div class="justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <NuxtLink :to="constantPath.HOME_PAGE" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="constantPath.CONCERTS_PAGE" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0">
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
