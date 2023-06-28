<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { EnumEventType, Genre } from 'ts-interfaces'
import * as zod from 'zod'

const { data: genres, refresh } = await useCustomFetch<Genre[]>('/genres')

const toast = useToast()
const loading = ref(false)
const genre: Ref<Partial<Genre>> = ref({})
const genreDialog = ref(false)
const deleteGenreDialog = ref(false)
const filters = ref()
const eventTypes = ref(Object.values(EnumEventType))

const schema = zod.object({
  name: zod.string({ required_error: 'Ce champ est requis' }).min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  type: zod.nativeEnum(EnumEventType, { required_error: 'Ce champ est requis' })
})
const typedSchema = ref(toTypedSchema(schema))

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'type.name': { value: null, matchMode: FilterMatchMode.IN }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const openNew = () => {
  genre.value = {
    name: '',
    type: EnumEventType.CONCERT
  } as any
  console.info(genre.value)
  genreDialog.value = true
  typedSchema.value = toTypedSchema(schema)
}

const editGenre = (editedGenre: Genre) => {
  genre.value = { ...editedGenre }
  genre.value.type = editedGenre.type.name as any
  if (genre.value?.id) {
    typedSchema.value = toTypedSchema(schema.partial())
  }
  genreDialog.value = true
}

const confirmDeleteGenre = (editedGenre: Genre) => {
  genre.value = editedGenre
  deleteGenreDialog.value = true
}

const saveGenre = async () => {
  if (genre.value.id) {
    await useCustomFetch<Event>(`/genres/${genre.value.id}`, {
      method: 'PATCH',
      body: {
        name: genre.value.name,
        type: {
          connect: {
            name: genre.value.type
          }
        }
      },
      key: 'genre'
    })
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Evenement modifié',
      life: 3000
    })
  } else {
    await useCustomFetch<Event>('/genres', {
      method: 'POST',
      body: JSON.stringify({
        name: genre.value.name,
        type: {
          connect: {
            name: genre.value.type
          }
        }
      }),
      key: 'genre'
    })
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Evenement créé',
      life: 3000
    })
  }
  refresh()
  genreDialog.value = false
  genre.value = {}
}

const deleteGenre = async () => {
  const { error } = await useCustomFetch<Event>(`/genres/${genre.value.id}`, { method: 'DELETE', key: 'deleteGenre' })
  if (!error.value) {
    genres.value = genres.value?.filter(val => val.id !== genre.value.id) ?? null
    deleteGenreDialog.value = false
    genre.value = {}
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Catégorie supprimée',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de supprimer une catégorie liée à des évènements ou des artistes',
      life: 3000
    })
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div v-if="genres" class="card">
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
          :value="genres"
          :paginator="true"
          class="p-datatable-gridlines"
          :rows="10"
          data-key="id"
          :row-hover="true"
          filter-display="menu"
          :loading="loading"
          responsive-layout="scroll"
          :global-filter-fields="['name']"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">
                Gestion des catégories
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
            Aucune catégorie trouvé
          </template>
          <template #loading>
            Chargement des catégories...
          </template>
          <Column sortable field="name" header="Nom">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" genreholder="Rechercher par nom" />
            </template>
          </Column>
          <Column
            sortable header="Type" sort-field="type.name" filter-field="type.name" :show-filter-match-modes="false"
            :filter-menu-style="{ width: '14rem' }"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <Tag :value="data.type.name" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <div class="mb-3 text-bold">
                Type d'évènement
              </div>
              <MultiSelect v-model="filterModel.value" @change="filterCallback" :options="eventTypes" placeholder="Any" class="p-column-filter">
                <template #option="slotProps">
                  <div class="p-multiselect-representative-option">
                    <span>{{ slotProps.option }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column class="max-w-1rem">
            <template #body="slotProps">
              <Button @click="editGenre(slotProps.data)" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" />
              <Button @click="confirmDeleteGenre(slotProps.data)" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="genreDialog" :style="{ width: '450px' }" header="Détails de la catégorie" :modal="true" class="p-fluid">
          <Form
            id="saveGenreForm"
            @submit="saveGenre"
            :initial-values="genre"
            :validation-schema="typedSchema"
          >
            <Field v-slot="{ field, errorMessage }" name="name">
              <div class="field">
                <label for="name">Nom</label>
                <InputText id="name" v-bind="field" v-model.trim="genre.name" :class="{ 'p-invalid': errorMessage }" />
                <small id="name-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
            <Field v-slot="{ field, errorMessage, }" name="type">
              <div class="field">
                <label for="type">Type d'évènement</label>
                <div v-for="(type, index) in eventTypes" :key="index" class="field-radiobutton col-6">
                  <RadioButton v-bind="field" v-model="(genre as Genre).type" :input-id="type" name="type" :value="type" />
                  <label :for="type">{{ type }}</label>
                </div>
                <small id="name-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
          </Form>
          <template #footer>
            <Button @click="genreDialog = false" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button
              label="Save" icon="pi pi-check" class="p-button-text" form="saveGenreForm"
              type="submit"
            />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteGenreDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="genre">Êtes-vous sûr de vouloir supprimer <b>{{ genre.name }}</b>?</span>
          </div>
          <template #footer>
            <Button @click="deleteGenreDialog = false" label="No" icon="pi pi-times" class="p-button-text" />
            <Button @click="deleteGenre" label="Yes" icon="pi pi-check" class="p-button-text" />
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
