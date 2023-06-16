<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Genre } from '~/types/Events/Genre'

const { data: genres, refresh } = await useCustomFetch<Genre[]>('/genres')

const toast = useToast()
const loading = ref(null)
const genre: Ref<Partial<Genre>> = ref({})
const genreDialog = ref(false)
const deleteGenreDialog = ref(false)
const submitted = ref(false)
const filters = ref()

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
  }
}

initFilters()

const clearFilter1 = () => {
  initFilters()
}

const openNew = () => {
  genre.value = {}
  submitted.value = false
  genreDialog.value = true
}

const editGenre = (editedGenre) => {
  genre.value = { ...editedGenre }
  genreDialog.value = true
}

const confirmDeleteGenre = (editedGenre) => {
  genre.value = editedGenre
  deleteGenreDialog.value = true
}

const hideGenreDialog = () => {
  genreDialog.value = false
  submitted.value = false
}

const saveGenre = async () => {
  submitted.value = true
  if (genre.value.name && genre.value.name.trim()) {
    if (genre.value.id) {
      await useCustomFetch<Event>(`/genres/${genre.value.id}`, {
        method: 'PATCH',
        body: {
          name: genre.value.name
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
          ...genre.value
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
}

const deleteGenre = async () => {
  const { error } = await useCustomFetch<Event>(`/genres/${genre.value.id}`, { method: 'DELETE', key: 'deleteGenre' })
  if (!error.value) {
    genres.value = genres.value.filter(val => val.id !== genre.value.id)
    deleteGenreDialog.value = false
    genre.value = {}
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Lieu supprimé',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de supprimer un lieu lié à des évènements',
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
                <Button @click="clearFilter1()" type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" />
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
          <Column sortable field="name" header="Name">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" genreholder="Search by name" />
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
          <div class="field">
            <label for="name">Nom</label>
            <InputText id="name" v-model.trim="genre.name" required="true" autofocus :class="{ 'p-invalid': submitted && !genre.name }" />
            <small v-if="submitted && !genre.name" class="p-invalid">Le nom est requis.</small>
          </div>
          <template #footer>
            <Button @click="hideGenreDialog" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button @click="saveGenre" label="Save" icon="pi pi-check" class="p-button-text" />
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
