<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { defineRule } from 'vee-validate'
import AllRules from '@vee-validate/rules'

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
