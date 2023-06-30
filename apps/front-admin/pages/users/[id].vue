<script setup lang="ts">
import { EnumRole, Order, User } from 'ts-interfaces'
import { useRoute } from 'vue-router'
import * as zod from 'zod'
import { useToast } from 'primevue/usetoast'

const userDialog = ref(false)
const deleteUserDialog = ref(false)

const route = useRoute()
const toast = useToast()

const roles = ref(Object.values(EnumRole))
const { data: user, refresh } = await useCustomFetch<User>(`/users/${route.params.id}`)
const { data: orders } = await useCustomFetch<Order[]>(`/users/${route.params.id}/orders`)
const schema = toTypedSchema(zod.object({
  firstname: zod.string({ required_error: 'Ce champ est requis' }),
  lastname: zod.string({ required_error: 'Ce champ est requis' }),
  email: zod.string({ required_error: 'Ce champ est requis' }).email({ message: 'L\'adresse mail doit être valide' }),
  password: zod.string({ required_error: 'Ce champ est requis' }).min(4, { message: '4 caractères minimum' }),
  role: zod.nativeEnum(EnumRole, { required_error: 'Ce champ est requis' })
}).partial())

const saveUser = async () => {
  if (user.value?.id) {
    await useCustomFetch<User>(`/users/${user.value.id}`, {
      method: 'PATCH',
      body: {
        ...user.value
      },
      key: 'user'
    })
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Utilisateur modifié',
      life: 3000
    })
  }
  refresh()
  userDialog.value = false
}

const deleteUser = async () => {
  const { error } = await useCustomFetch<Event>(`/users/${user.value?.id}`, { method: 'DELETE', key: 'deleteUser' })
  if (!error.value) {
    navigateTo('/users')
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de supprimer cet utilisateur',
      life: 3000
    })
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div v-if="user?.id" class="card">
        <Toast />
        <Toolbar>
          <template #start>
            <h2 class="m-0">
              {{ user?.firstname }} {{ user?.lastname }}
            </h2>
          </template>
          <template #end>
            <div class="flex gap-2">
              <Button @click="userDialog = true" icon="pi pi-pencil" variant="primary" />
              <Button @click="deleteUserDialog = true" icon="pi pi-trash" class="p-button-danger" />
            </div>
          </template>
        </Toolbar>
      </div>
    </div>
    <div class="col-12">
      <OrderTable :orders="orders" />
    </div>
    <Dialog
      v-if="user" v-model:visible="userDialog" :style="{ width: '450px' }" header="Détails de la catégorie" :modal="true"
      class="p-fluid"
    >
      <Form
        id="saveUserForm"
        @submit="saveUser"
        :validation-schema="schema"
        :initial-values="user as any"
      >
        <Field v-slot="{ field, errorMessage }" name="firstname">
          <div class="field">
            <label for="firstname">Prénom</label>
            <InputText id="firstname" v-bind="field" v-model.trim="user.firstname" :class="{ 'p-invalid': errorMessage }" />
            <small id="firstname-help" class="p-error">{{ errorMessage }}</small>
          </div>
        </Field>
        <Field v-slot="{ field, errorMessage }" name="lastname">
          <div class="field">
            <label for="lastname">Nom de famille</label>
            <InputText id="lastname" v-bind="field" v-model.trim="user.lastname" :class="{ 'p-invalid': errorMessage }" />
            <small id="lastname-help" class="p-error">{{ errorMessage }}</small>
          </div>
        </Field>
        <Field v-slot="{ field, errorMessage }" name="email">
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-bind="field" v-model="user.email" aria-describedby="email-help" :class="{ 'p-invalid': errorMessage }" />
            <small id="email-help" class="p-error">{{ errorMessage }}</small>
          </div>
        </Field>
        <Field v-slot="{ field, errorMessage }" name="password">
          <div class="field">
            <label for="password">Mot de passe</label>
            <Password id="password" v-bind="field" v-model="user.password" aria-describedby="password-help" :class="{ 'p-invalid': errorMessage }" />
            <small id="password-help" class="p-error">{{ errorMessage }}</small>
          </div>
        </Field>
        <Field v-slot="{ field, errorMessage }" name="role">
          <div class="field">
            <label class="mb-3">Rôle</label>
            <div class="formgrid grid">
              <div v-for="(type, index) in roles" :key="index" class="field-radiobutton col-6">
                <RadioButton
                  v-bind="field" v-model="user.role" :input-id="type" name="type" :value="type"
                  :class="{ 'p-invalid': errorMessage }"
                />
                <label :for="type">{{ type }}</label>
              </div>
              <small id="role-help" class="p-error">{{ errorMessage }}</small>
            </div>
          </div>
        </Field>
      </Form>
      <template #footer>
        <Button @click="userDialog = false" label="Cancel" icon="pi pi-times" class="p-button-text" />
        <Button label="Save" type="submit" form="saveUserForm" icon="pi pi-check" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="user">Êtes-vous sûr de vouloir supprimer <b>{{ user.firstname }} {{ user.lastname }}</b>?</span>
      </div>
      <template #footer>
        <Button @click="deleteUserDialog = false" label="No" icon="pi pi-times" class="p-button-text" />
        <Button @click="deleteUser" label="Yes" icon="pi pi-check" class="p-button-text" />
      </template>
    </Dialog>
  </div>
</template>
