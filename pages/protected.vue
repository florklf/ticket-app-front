<template>
  <div>
    <div>I'm protected!</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
