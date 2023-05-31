import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

export function useCustomFetch<T> (url: string, options: UseFetchOptions<T> = {}) {
  const { status, token } = useAuth()
  const config = useRuntimeConfig()

  console.info(status.value, token.value)
  const defaults: UseFetchOptions<T> = {
    key: url,

    // set user token if connected
    headers: status.value === 'authenticated' && token.value
      ? { Authorization: token.value }
      : {},

    onResponse (_ctx) {
      console.info('onResponseError', _ctx)
    },

    onResponseError (_ctx) {
      console.info('onResponseError', _ctx)
    }
  }

  const params = defu(options, defaults)

  return useFetch(`${config.public.apiBase}${url}`, params)
}
