<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="5" color="#7254f3" />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { defineRule } from 'vee-validate'
import AllRules from '@vee-validate/rules'
useHead({
  title: 'TicketApp'
})

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})
defineRule('minLength', (value, [limit]) => {
  if (!value || !value.length) {
    return true
  }
  if (value.length < limit) {
    return `This field must be at least ${limit} characters`
  }
  return true
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
