<template>
    <n-layout>
        <n-layout-header>
            <Navbar />
        </n-layout-header>
        <n-layout-content class="container mx-auto">
            <slot></slot>
        </n-layout-content>
        <n-layout-footer>
            <slot name="footer"></slot>
        </n-layout-footer>
    </n-layout>
</template>
  
<style scoped></style>