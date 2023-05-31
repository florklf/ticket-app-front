<template>
  <div class="surface-card p-4 border-round w-full lg:w-1/2 m-auto">
    <div class="text-center mb-4">
      <div class="text-900 text-3xl font-medium mb-3">
        Inscription
      </div>
      <span class="text-600 font-medium line-height-3">Vous avez déjà un compte ?</span>
      <NuxtLink :to="constantPath.SIGNIN_PAGE" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
        Connectez-vous
      </NuxtLink>
    </div>

    <div class="m-6">
      <Message v-if="signinError" class="p-message-error mb-6" :closable="false">
        {{ signinError }}
      </Message>
    </div>
    <Form @submit="onSubmit" class="flex flex-col gap-6 items-center">
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
import { PATH as constantPath } from '@/constants/pages'

const loading = ref(false)
const [email, password, confirm] = [ref(''), ref(''), ref('')]
const signinError = ref()

const onSubmit = async (values: any) => {
  loading.value = true
  const { confirm: _, ...payload } = values
  const { error } = await useCustomFetch('/users', { method: 'POST', body: payload })
  if (!error.value) {
    return navigateTo({ path: constantPath.SIGNIN_PAGE })
  }
  if (error.value.statusCode === 409) {
    signinError.value = 'Un compte existe déjà avec cet email'
  } else {
    signinError.value = 'Une erreur est survenue'
  }
  loading.value = false
}
</script>
