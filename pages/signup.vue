<template>
  <div>
    <SignUpForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})
</script>
