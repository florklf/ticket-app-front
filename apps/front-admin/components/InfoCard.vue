<script setup lang="ts">

defineProps({
  title: String,
  body: [String, Number],
  icon: {
    type: String,
    default: 'pi pi-shopping-cart'
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  footer: String
})
</script>

<template>
  <div class="card mb-0">
    <div class="flex justify-content-between mb-3">
      <div>
        <slot name="title">
          <span class="block text-500 font-medium mb-3">
            {{ title }}
          </span>
        </slot>
        <slot name="body">
          <div class="text-900 font-medium text-xl">
            {{ body }}
          </div>
        </slot>
      </div>
      <div
        style="width: 2.5rem; height: 2.5rem" class="flex align-items-center justify-content-center bg-blue-100 border-round" :class="{
          [`bg-${iconColor}-100`]: iconColor
        }"
      >
        <slot name="icon">
          <i
            class="text-xl" :class="{
              [icon as any]: icon,
              [`text-${iconColor}-500`]: iconColor,
            }"
          />
        </slot>
      </div>
    </div>
    <slot name="footer">
      <span class="text-500">{{ footer }}</span>
    </slot>
  </div>
</template>
