<template>
  <header class="mb-10">
    <nav class="border-gray-200 px-4 lg:px-6 py-2.5">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <NuxtLink :to="constantPath.HOME_PAGE" class="styled-logo" />
        <div class="flex items-center gap-x-3 lg:order-2">
          <div>
            <template v-if="status === 'unauthenticated'">
              <Button
                @click="() => $router.push(constantPath.SIGNIN_PAGE)"
                size="small"
                :label="$t('navbar.signin')"
              />
            </template>
            <template v-else>
              <Button
                @click="signOut()"
                severity="danger"
                size="small"
                :label="$t('navbar.signout')"
                outlined
              />
            </template>
          </div>
          <Dropdown v-model="lang" :options="locales" optionLabel="label" :pt="{trigger: { style: 'display: none;' }}" @change="switchLang(lang)" />
        </div>
        <div class="justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <NuxtLink :to="constantPath.HOME_PAGE" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0">
                {{ $t('navbar.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="constantPath.CONCERTS_PAGE" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0">
                {{ $t('navbar.concert') }}
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
import { PATH as constantPath } from '@/constants/pages';

const { status, signOut } = useAuth();
const { locale, availableLocales, setLocale } = useI18n();

interface ILocale {
  label: string;
  value: string;
}

const getCountryFlag = (lang: string) => {
  if (lang === 'en') return '🇬🇧';
  return String.fromCodePoint(...[...lang.toUpperCase()].map((char) => char.charCodeAt(0) + 127397));
};

const locales: ILocale[] = availableLocales.map((locale) => ({
    label: getCountryFlag(locale),
    value: locale,
}));
const lang = ref(locales.find((localeArr) => localeArr.value === locale.value) ?? locales[0]);

const switchLang = (lang: ILocale) => {
  window.Snipcart.api.session.setLanguage(lang.value);
  setLocale(lang.value);
};
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
