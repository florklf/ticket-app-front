<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { EnumRole, User } from 'ts-interfaces'
import * as zod from 'zod'

const { data: users, refresh } = await useCustomFetch<User[]>('/users')
const toast = useToast()
const loading = ref(false)
const user: Ref<Partial<User>> = ref({})
const userDialog = ref(false)
const deleteUserDialog = ref(false)
const filters = ref()
const roles = ref(Object.values(EnumRole))

const schema = zod.object({
  firstname: zod.string({ required_error: 'Ce champ est requis' }),
  lastname: zod.string({ required_error: 'Ce champ est requis' }),
  email: zod.string({ required_error: 'Ce champ est requis' }).email({ message: 'L\'adresse mail doit être valide' }),
  password: zod.string({ required_error: 'Ce champ est requis' }).min(4, { message: '4 caractères minimum' }),
  role: zod.nativeEnum(EnumRole, { required_error: 'Ce champ est requis' })
})
const typedSchema = ref(toTypedSchema(schema))

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    role: { value: null, matchMode: FilterMatchMode.IN }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const openNew = () => {
  user.value = {}
  userDialog.value = true
  typedSchema.value = toTypedSchema(schema)
}

const editUser = (editedUser: User) => {
  user.value = { ...editedUser }
  if (user.value?.id) {
    typedSchema.value = toTypedSchema(schema.partial())
  }
  userDialog.value = true
}

const confirmDeleteUser = (editedUser: User) => {
  user.value = editedUser
  deleteUserDialog.value = true
}

const saveUser = async () => {
  if (user.value.id) {
    await useCustomFetch<User>(`/users/${user.value.id}`, {
      method: 'PATCH',
      body: { ...user.value },
      key: 'user'
    })
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Utilisateur modifié',
      life: 3000
    })
  } else {
    await useCustomFetch<User>('/users', {
      method: 'POST',
      body: { ...user.value },
      key: 'user'
    })
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Utilisateur créé',
      life: 3000
    })
  }
  refresh()
  userDialog.value = false
  user.value = {}
}

const deleteUser = async () => {
  const { error } = await useCustomFetch<Event>(`/users/${user.value.id}`, { method: 'DELETE', key: 'deleteUser' })
  if (!error.value) {
    users.value = users.value?.filter(val => val.id !== user.value.id) ?? null
    deleteUserDialog.value = false
    user.value = {}
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Utilisateur supprimé',
      life: 3000
    })
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
      <div v-if="users" class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <Button @click="openNew" label="Nouveau" icon="pi pi-plus" class="p-button-success mr-2" />
            </div>
          </template>
        </Toolbar>
        <DataTable
          v-model:filters="filters"
          :value="users"
          :paginator="true"
          class="p-datatable-gridlines"
          :rows="10"
          data-key="id"
          :row-hover="true"
          filter-display="menu"
          :loading="loading"
          responsive-layout="scroll"
          :global-filter-fields="['firstname', 'lastname', 'email']"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">
                Gestion des utilisateurs
              </h5>
              <div class="flex gap-4">
                <Button @click="clearFilter()" type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" />
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" genreholder="Search..." />
                </span>
              </div>
            </div>
          </template>
          <template #empty>
            Aucun utilisateur trouvé
          </template>
          <template #loading>
            Chargement des utilisateurs...
          </template>
          <Column sortable field="firstname" header="Prénom">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" genreholder="Rechercher par prénom" />
            </template>
          </Column>
          <Column sortable field="lastname" header="Nom de famille">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" genreholder="Rechercher par nom" />
            </template>
          </Column>
          <Column sortable field="email" header="Adresse mail">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" genreholder="Rechercher par mail" />
            </template>
          </Column>
          <Column
            sortable header="Rôle" sort-field="role" filter-field="role" :show-filter-match-modes="false"
            :filter-menu-style="{ width: '14rem' }"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <Tag :value="data.role" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <div class="mb-3 text-bold">
                Rôle
              </div>
              <MultiSelect v-model="filterModel.value" @change="filterCallback" :options="roles" placeholder="Any" class="p-column-filter">
                <template #option="slotProps">
                  <div class="p-multiselect-representative-option">
                    <span>{{ slotProps.option }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column class="max-w-min">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button @click="editUser(slotProps.data)" icon="pi pi-pencil" class="p-button-rounded p-button-success" />
                <Button @click="confirmDeleteUser(slotProps.data)" icon="pi pi-trash" class="p-button-rounded p-button-warning" />
                <NuxtLink :to="`users/${slotProps.data.id}`">
                  <Button type="button" icon="pi pi-user" rounded />
                </NuxtLink>
              </div>
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="Détails de la catégorie" :modal="true" class="p-fluid">
          <Form
            id="saveUserForm"
            @submit="saveUser"
            :initial-values="user"
            :validation-schema="typedSchema"
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
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}
::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
