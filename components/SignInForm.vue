<template>
  <div class="surface-card p-4 border-round w-full lg:w-1/2 m-auto">
    <div class="text-center mb-6">
      <div class="text-900 text-3xl font-medium mb-3">
        {{ $t('signin.title') }}
      </div>
      <span class="text-600 font-medium line-height-3">{{ $t('signin.subtitle') }}</span>
      <NuxtLink :to="constantPath.SIGNUP_PAGE" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
        {{ $t('signin.signup') }}
      </NuxtLink>
    </div>

    <div class="m-6">
      <Message v-if="errorMessage" class="p-message-error mb-6" :closable="false">
        {{ $t(errorMessage) }}
      </Message>
    </div>
    <form @submit="onSubmit" class="flex flex-col gap-6 items-center">
      <div class="m-auto space-x-8 w-80">
        <span class="p-float-label">
          <InputText id="email" v-model="email" type="text" :class="{ 'p-invalid': errors.email }" class="w-full" />
          <label for="email">Email</label>
        </span>
        <small v-if="errors.email" class="p-error !m-0">{{ errors.email }}</small>
      </div>

      <div class="m-auto space-x-6 w-80">
        <span class="p-float-label">
          <Password
            id="password" v-model="password" :class="{ 'p-invalid': errors.password }" inputClass="w-full" class="w-full" :feedback="false"
            toggle-mask
          />
          <label for="password">Mot de passe</label>
        </span>
        <small v-if="errors.password" id="text-error" class="p-error !m-0">{{ errors.password }}</small>
      </div>
      <div class="flex flex-col m-auto w-full gap-2">
        <a class="font-medium no-underline ml-2 text-blue-500 text-center cursor-pointer">
          {{ $t('signin.forgot') }}
        </a>
        <Button type="submit" :label="$t('signin.submit')" icon="pi pi-user" class="self-center w-full md:w-1/2 md:m-auto block" :loading="loading" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import * as zod from 'zod'
import { PATH as constantPath } from '@/constants/pages'
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

const { signIn } = useAuth()
const loading = ref(false)

const validationSchema = toTypedSchema(
  zod.object({
    email: zod.string().email({ message: "L'email n'est pas valide" }),
    password: zod.string().min(8, { message: '8 caractères minimum' })
  })
)
const { handleSubmit, errors } = useForm({
  validationSchema
})
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const errorMessage = ref()

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    await signIn(values, { redirect: false })
    return navigateTo('/')
  } catch (error) {
    errorMessage.value = 'signin.error'
  }
  loading.value = false
})
</script>
