<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLayout } from './composables/layout'
const { onMenuToggle } = useLayout()
const outsideClickListener = ref(null)
const topbarMenuActive = ref(false)
const { signOut } = useAuth()

onMounted(() => {
  bindOutsideClickListener()
})
onBeforeUnmount(() => {
  unbindOutsideClickListener()
})

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value
}

const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  }
})

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false
      }
    }

    document.addEventListener('click', outsideClickListener.value)
  }
}

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener)
    outsideClickListener.value = null
  }
}

const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) { return }
  const sidebarEl = document.querySelector('.layout-topbar-menu')
  const topbarEl = document.querySelector('.layout-topbar-menu-button')

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target))
}

const handleSignOut = async () => {
  await signOut({ callbackUrl: '/signin' })
}
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo gap-3">
      <img src="/layout/images/logo.svg" alt="Logo">
      <span>Ticket Admin</span>
    </router-link>

    <button @click="onMenuToggle()" class="p-link layout-menu-button layout-topbar-button">
      <i class="pi pi-bars" />
    </button>

    <button @click="onTopBarMenuButton()" class="p-link layout-topbar-menu-button layout-topbar-button">
      <i class="pi pi-ellipsis-v" />
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <button @click="handleSignOut()" class="p-link layout-topbar-button">
        <i class="pi pi-sign-out" />
        <span>Signout</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
