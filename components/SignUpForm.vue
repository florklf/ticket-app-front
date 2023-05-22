<template>
  <div class="surface-card p-4 shadow-2 border-round w-full lg:w-1/2 m-auto">
    <div class="text-center mb-8">
      <div class="text-900 text-3xl font-medium mb-3">
        Inscription
      </div>
      <span class="text-600 font-medium line-height-3">Vous avez déjà un compte ?</span>
      <NuxtLink :to="constantPath.SIGNIN_PAGE" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
        Connectez-vous
      </NuxtLink>
    </div>

    <div class="m-10">
      <Message v-if="signinError" class="p-message-error mb-10" :closable="false">
        {{ signinError }}
      </Message>
    </div>
    <Form @submit="onSubmit" class="flex flex-col gap-8 items-center">
      <Field v-slot="{ field, errorMessage }" name="email" class="m-auto" rules="email" as="div">
        <span class="p-float-label">
          <InputText
            id="email" v-bind="field" v-model="email" type="text" class="p-inputtext-lg"
            :class="{ 'p-invalid': errorMessage }"
          />
          <label for="email">Email</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="password" class="m-auto" rules="required|minLength:8" as="div">
        <span class="p-float-label">
          <Password
            id="password" v-bind="field" v-model="password" type="text" class="p-inputtext-lg"
            :class="{ 'p-invalid': errorMessage }" toggle-mask
          />
          <label for="password">Password</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="confirm" class="m-auto space-x-6" rules="confirmed:@password" as="div">
        <span class="p-float-label">
          <Password
            id="confirm" v-bind="field" v-model="confirm" type="text" class="p-inputtext-lg"
            :class="{ 'p-invalid': errorMessage }" toggle-mask
          />
          <label for="confirm">Confirm password</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <a class="font-medium no-underline ml-2 text-blue-500 text-center cursor-pointer">Forgot password?</a>
      <Button type="submit" label="Sign In" icon="pi pi-user" class="w-full lg:w-1/2 lg:m-auto block" :loading="loading" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { PATH as constantPath } from '@/constants/pages'

const loading = ref(false)
const [email, password, confirm] = [ref(''), ref(''), ref('')]
const signinError = ref()
const toast = useToast()

const onSubmit = async (values: any) => {
  console.info('onSubmit', values)
  loading.value = true
  const { confirm, ...payload } = values
  const { error } = await useFetch('/users', { method: 'POST', body: payload })
  if (!error.value) {
    const message = useMessage()
    message.value = { type: 'success', text: 'Votre compte a été créé avec succès.' }
    return navigateTo({ path: constantPath.SIGNIN_PAGE })
  }
  loading.value = false
  toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création de votre compte.' })
}
</script>
