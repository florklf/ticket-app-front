<template>
  <div class="surface-card p-4 border-round w-full lg:w-1/2 m-auto">
    <div class="text-center mt-8">
      <div class="text-900 text-3xl font-medium">
        {{ $t('signup.title') }}
      </div>
      <div class="mt-4 mb-8">
        <span class="text-600 font-medium line-height-3">{{ $t('signup.subtitle') }}</span>
        <NuxtLink :to="constantPath.SIGNIN_PAGE" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          {{ $t('signup.signin') }}
        </NuxtLink>
      </div>
    </div>

    <div class="m-6">
      <Message v-if="signupError" class="p-message-error mb-6" :closable="false">
        {{ $t(signupError) }}
      </Message>
    </div>
    <Form @submit="onSubmit" class="flex flex-col gap-6 items-center">
      <Field v-slot="{ field, errorMessage }" name="firstname" class="m-auto w-80" rules="required" as="div">
        <span class="p-float-label">
          <InputText
            id="firstname" v-bind="field" v-model="firstname" type="text" :class="{ 'p-invalid': errorMessage }"
            class="w-full"
          />
          <label for="firstname">{{ $t('signup.firstname') }}</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="lastname" class="m-auto w-80" rules="required" as="div">
        <span class="p-float-label">
          <InputText
            id="lastname" v-bind="field" v-model="lastname" type="text" :class="{ 'p-invalid': errorMessage }"
            class="w-full"
          />
          <label for="lastname">{{ $t('signup.lastname') }}</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="email" class="m-auto w-80" rules="email" as="div">
        <span class="p-float-label">
          <InputText
            id="email" v-bind="field" v-model="email" type="text" :class="{ 'p-invalid': errorMessage }"
            class="w-full"
          />
          <label for="email">Email</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <Field v-slot="{ field, errorMessage }" name="password" class="m-auto w-80" rules="required|minLength:8" as="div">
        <span class="p-float-label">
          <Password
            id="password" v-bind="field" v-model="password" type="text" :class="{ 'p-invalid': errorMessage }"
            input-class="w-full" class="w-full" toggle-mask
          />
          <label for="password">{{ $t('signup.password') }}</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <Field
        v-slot="{ field, errorMessage }" name="confirm" class="m-auto space-x-6 w-80" rules="confirmed:@password"
        as="div"
      >
        <span class="p-float-label">
          <Password
            id="confirm" v-bind="field" v-model="confirm" type="text" :class="{ 'p-invalid': errorMessage }"
            input-class="w-full" class="w-full" toggle-mask
          />
          <label for="confirm">{{ $t('signup.passwordConfirm') }}</label>
        </span>
        <small v-if="errorMessage" class="p-error !m-0">{{ errorMessage }}</small>
      </Field>

      <div class="flex flex-col m-auto w-full gap-2">
        <Button
          type="submit" :label="$t('signup.submit')" class="self-center w-full lg:w-1/2 lg:m-auto block"
          :loading="loading"
        />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { PATH as constantPath } from '@/constants/pages'

const loading = ref(false)
const [firstname, lastname, email, password, confirm] = [ref(''), ref(''), ref(''), ref(''), ref('')]
const signupError = ref()

const onSubmit = async (values: any) => {
  loading.value = true
  const { confirm: _, ...payload } = values
  const { error } = await useCustomFetch('/users', { method: 'POST', body: payload })
  if (!error.value) {
    return navigateTo({ path: constantPath.SIGNIN_PAGE })
  }
  if (error.value.statusCode === 409) {
    signupError.value = 'signup.error.email'
  } else {
    signupError.value = 'signup.error.generic'
  }
  loading.value = false
}
</script>
