<template>
  <div class="h-full mx-auto surface-card px-4 py-6 shadow-2 border-round w-full lg:w-6">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">
        Bienvenue
      </div>
    </div>

    <div class="m-6">
      <Message v-if="errorMessage" class="p-message-error mb-6" :closable="false">
        {{ errorMessage }}
      </Message>
    </div>
    <form @submit="onSubmit" class="flex flex-column gap-4 align-items-center">
      <div class="m-auto space-x-8 w-6">
        <span class="p-float-label">
          <InputText id="email" v-model="email" type="text" :class="{ 'p-invalid': errors.email }" class="w-full" />
          <label for="email">Email</label>
        </span>
        <small v-if="errors.email" class="p-error !m-0">{{ errors.email }}</small>
      </div>

      <div class="m-auto space-x-6 w-6">
        <span class="p-float-label">
          <Password
            id="password" v-model="password" :class="{ 'p-invalid': errors.password }" input-class="w-full" class="w-full"
            :feedback="false"
            toggle-mask
          />
          <label for="password">Mot de passe</label>
        </span>
        <small v-if="errors.password" id="text-error" class="p-error !m-0">{{ errors.password }}</small>
      </div>
      <Button type="submit" label="Se connecter" icon="pi pi-user" class="self-center w-full md:w-6 md:m-auto block" :loading="loading" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { EnumRole } from 'ts-interfaces'
import * as zod from 'zod'
definePageMeta({
  layout: 'guest',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})

const { signIn, signOut, data } = useAuth()
const loading = ref(false)

const validationSchema = toTypedSchema(
  zod.object({
    email: zod.string().email({ message: "L'email n'est pas valide" }),
    password: zod.string().min(4, { message: '8 caractères minimum' })
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
    if (data.value) {
      if (data.value.user.role as EnumRole === EnumRole.ADMIN) {
        return navigateTo('/')
      } else {
        await signOut()
      }
    }
  } catch (error) {
    errorMessage.value = 'Une erreur est survenue lors de la connexion. Veuillez vérifier les informations saisies.'
  }
  loading.value = false
})
</script>
