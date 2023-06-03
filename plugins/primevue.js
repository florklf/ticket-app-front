import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import InlineMessage from 'primevue/inlinemessage'
import Message from 'primevue/message'
import Password from 'primevue/password'
import Toast from 'primevue/toast'
import Tooltip from 'primevue/tooltip'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true })
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Checkbox', Checkbox)
  nuxtApp.vueApp.component('InlineMessage', InlineMessage)
  nuxtApp.vueApp.component('Message', Message)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.directive('tooltip', Tooltip)
})
