<template>
  <div class="flex flex-col min-h-screen">
    <DefaultNavbar />
    <main class="flex-grow text-text">
      <slot />
    </main>
    <ScrollTop />
    <DefaultFooter class="mt-auto" />
  </div>
</template>
<script lang="ts">
</script>
