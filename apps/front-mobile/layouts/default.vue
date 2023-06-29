<template>
  <div class="flex flex-col min-h-screen">
    <DefaultNavbar />
    <PwaPrompt />
    <main class="flex-grow text-text">
      <slot />
    </main>
    <ScrollTop />
    <DefaultFooter class="mt-auto" />
  </div>
</template>
<script lang="ts">
</script>
