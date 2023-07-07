import { EnumRole } from 'ts-interfaces'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { signOut, data } = useAuth()
  if (data.value) {
    if (data.value.user.role as EnumRole === EnumRole.USER) {
      await signOut({ callbackUrl: '/signin', redirect: true })
    }
  }
})
