<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="container mx-auto flex-grow">
      <slot />
    </main>
    <DefaultFooter class="mt-auto" />
  </div>
</template>
