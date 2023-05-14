<template>
  <Layout>
    <n-gradient-text type="info" :size="30">
      Connexion
    </n-gradient-text>

    <SignInForm />
  </Layout>
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
