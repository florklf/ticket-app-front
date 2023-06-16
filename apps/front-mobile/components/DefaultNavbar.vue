<template>
  <header class="sticky top-0 z-20 bg-white shadow-md">
    <nav class="border-gray-200 px-4 lg:px-6 py-2.5">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <NuxtLink :to="constantPath.HOME_PAGE" class="styled-logo" />
        <div class="flex items-center gap-x-2 lg:order-2">
          <div>
            <template v-if="status === 'unauthenticated'">
              <NuxtLink :to="constantPath.SIGNIN_PAGE">
                <Button :label="$t('navbar.signin')" />
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink :to="constantPath.HOME_PAGE">
                <Button @click="signOut({ callbackUrl: constantPath.HOME_PAGE })" severity="danger" outlined>
                  <template #icon>
                    <Icon name="fa6-solid:right-from-bracket" />
                  </template>
                </Button>
              </NuxtLink>
            </template>
          </div>
          <div>
            <template v-if="status === 'authenticated'">
              <NuxtLink to="/dashboard">
                <Button outlined>
                  <template #icon>
                    <Icon name="fa-solid:user" />
                  </template>
                </Button>
              </NuxtLink>
            </template>
          </div>
          <div v-if="status === 'authenticated'" class="hidden lg:block">
            <NuxtLink to="#" class="snipcart-checkout">
              <Button outlined>
                <template #icon>
                  <Icon name="fa-solid:shopping-cart" />
                </template>
              </Button>
            </NuxtLink>
          </div>
          <div class="hidden lg:block">
            <Dropdown
              v-model="lang" @change="switchLang(lang)" :options="locales" option-label="label"
              :pt="{ trigger: { style: 'display: none;' } }" class="xs:hidden"
            />
          </div>
          <div class="lg:hidden">
            <Button @click="toggleMenu" outlined>
              <template #icon>
                <Icon name="fa-solid:bars" />
              </template>
            </Button>
          </div>
        </div>
        <div class="justify-between items-center w-full lg:flex lg:w-auto lg:order-1" :class="{ 'hidden': !showMenu }">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <NuxtLink
                :to="constantPath.HOME_PAGE"
                class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
              >
                {{ $t('navbar.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="constantPath.CONCERTS_PAGE"
                class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
              >
                {{ $t('navbar.concert') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="constantPath.SPECTACLES_PAGE"
                class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
              >
                {{ $t('navbar.spectacles') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="constantPath.FESTIVALS_PAGE"
                class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
              >
                {{ $t('navbar.festivals') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="constantPath.CONFERENCES_PAGE"
                class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
              >
                {{ $t('navbar.conferences') }}
              </NuxtLink>
            </li>
            <li v-if="status === 'authenticated'" class="lg:hidden">
              <NuxtLink class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 snipcart-checkout">
                {{ $t('navbar.cart') }}
              </NuxtLink>
            </li>
            <li class="lg:hidden">
              <div>
                <Dropdown
                  v-model="lang" @change="switchLang(lang)" :options="locales" option-label="label" placeholder="Choose a lang"
                  class="w-full mt-2"
                />
              </div>
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
import { ILocale } from '@/types/ILocale'

const { status, signOut } = useAuth()
const { locale, availableLocales, setLocale } = useI18n()

const getCountryFlag = (lang: string) => {
  if (lang === 'en') { return '🇬🇧' }
  return String.fromCodePoint(...[...lang.toUpperCase()].map(char => char.charCodeAt(0) + 127397))
}

const locales: ILocale[] = (availableLocales as string[]).map(locale => ({
  label: getCountryFlag(locale),
  value: locale
}))
const lang = ref(locales.find(localeArr => localeArr.value === locale.value) ?? locales[0])

const switchLang = (lang: ILocale) => {
  window.Snipcart.api.session.setLanguage(lang.value)
  setLocale(lang.value)
}

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<style scoped>
.styled-logo {
  text-decoration: none;
  height: 30px;
  width: 135px;
  background-image: url('/logo.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
</style>
