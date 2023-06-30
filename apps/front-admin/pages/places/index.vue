<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Place, SeatType } from 'ts-interfaces'
import * as zod from 'zod'

const { data: places, refresh } = await useCustomFetch<Place[]>('/places')

const placesTable = computed(() => {
  return places.value?.map((place) => {
    return {
      ...place,
      capacity: place.seatTypes.reduce((acc, val) => acc + val.capacity, 0),
      fullAddress: `${place.address}, ${place.zip} ${place.city}`
    }
  })
})
const toast = useToast()
const loading = ref(false)
const place: Ref<Partial<Place>> = ref({})
const seatType: Ref<Partial<SeatType>> = ref({})
const placeDialog = ref(false)
const seatTypeDialog = ref(false)
const deletePlaceDialog = ref(false)
const deleteSeatTypeDialog = ref(false)
const filters = ref()
const expandedRows = ref([])

const placeSchema = zod.object({
  name: zod.string({ required_error: 'Ce champ est requis' }).min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  description: zod.string({ required_error: 'Ce champ est requis' }).min(3, { message: 'La description doit contenir au moins 3 caractères' }),
  address: zod.string({ required_error: 'Ce champ est requis' }),
  zip: zod.string({ required_error: 'Ce champ est requis' }),
  city: zod.string({ required_error: 'Ce champ est requis' })
})
const placeTypedSchema = ref(toTypedSchema(placeSchema))

const seatTypeSchema = zod.object({
  name: zod.string({ required_error: 'Ce champ est requis' }).min(3, { message: 'Le nom doit contenir au moins 3 caractères' }),
  description: zod.string({ required_error: 'Ce champ est requis' }).min(3, { message: 'La description doit contenir au moins 3 caractères' }),
  capacity: zod.number({ required_error: 'Ce champ est requis', invalid_type_error: 'Ce champ doit être un nombre' }).min(1, { message: 'La capacité doit être supérieure à 0' })
})
const seatTypeTypedSchema = ref(toTypedSchema(seatTypeSchema))

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    fullAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    capacity: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }] }
  }
}

initFilters()

const clearFilter = () => {
  initFilters()
}

const openNew = () => {
  place.value = {}
  placeDialog.value = true
  placeTypedSchema.value = toTypedSchema(placeSchema)
}

const openNewSeatType = (parentPlace: Place) => {
  place.value = parentPlace
  seatType.value = {}
  seatTypeDialog.value = true
}

const editPlace = (editedPlace: Place) => {
  place.value = { ...editedPlace }
  placeDialog.value = true
  if (place.value?.id) {
    placeTypedSchema.value = toTypedSchema(placeSchema.partial())
  }
}

const editSeatType = (editedSeatType: SeatType) => {
  place.value = places.value?.find(val => val.id === editedSeatType.place_id) as Partial<Place>
  seatType.value = { ...editedSeatType }
  seatTypeDialog.value = true
}

const confirmDeletePlace = (editedPlace: Place) => {
  place.value = editedPlace
  deletePlaceDialog.value = true
}

const confirmDeleteSeatType = (editedSeatType: SeatType) => {
  seatType.value = editedSeatType
  deleteSeatTypeDialog.value = true
}

const savePlace = async () => {
  if (place.value.id) {
    await useCustomFetch<Event>(`/places/${place.value.id}`, {
      method: 'PATCH',
      body: {
        name: place.value.name,
        description: place.value.description,
        address: place.value.address,
        zip: place.value.zip,
        city: place.value.city
      },
      key: 'place'
    })
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Evenement modifié',
      life: 3000
    })
  } else {
    await useCustomFetch<Event>('/places', {
      method: 'POST',
      body: JSON.stringify({
        ...place.value
      }),
      key: 'place'
    })
    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Evenement créé',
      life: 3000
    })
  }
  refresh()
  placeDialog.value = false
  place.value = {}
}

const saveSeatType = async () => {
  if (seatType.value.name && seatType.value.name.trim()) {
    if (seatType.value.id) {
      await useCustomFetch<Event>(`/seat-types/${seatType.value.id}`, {
        method: 'PATCH',
        body: {
          name: seatType.value.name,
          description: seatType.value.description,
          capacity: seatType.value.capacity
        },
        key: 'seatType'
      })
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Type de place modifié',
        life: 3000
      })
    } else {
      await useCustomFetch<Event>('/seat-types', {
        method: 'POST',
        body: JSON.stringify({
          ...seatType.value,
          place: {
            connect: {
              id: place.value.id
            }
          }
        }),
        key: 'seatType'
      })
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Type de place créé',
        life: 3000
      })
    }
    refresh()
    seatTypeDialog.value = false
    seatType.value = {}
  }
}

const deletePlace = async () => {
  const { error } = await useCustomFetch<Event>(`/places/${place.value.id}`, { method: 'DELETE', key: 'deletePlace' })
  if (!error.value) {
    places.value = places.value?.filter(val => val.id !== place.value.id) ?? null
    deletePlaceDialog.value = false
    place.value = {}
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

const deleteSeatType = async () => {
  const { error } = await useCustomFetch<Event>(`/seat-types/${seatType.value.id}`, { method: 'DELETE', key: 'deleteSeatType' })
  if (!error.value) {
    deleteSeatTypeDialog.value = false
    seatType.value = {}
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Type de lieu supprimé',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de supprimer un type de place lié à un évènement',
      life: 3000
    })
  }
  refresh()
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div v-if="places" class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <Button @click="openNew" label="Nouveau" icon="pi pi-plus" class="p-button-success mr-2" />
            </div>
          </template>
        </Toolbar>
        <DataTable
          v-model:expandedRows="expandedRows"
          v-model:filters="filters"
          :value="placesTable"
          :paginator="true"
          class="p-datatable-gridlines"
          :rows="10"
          data-key="id"
          :row-hover="true"
          filter-display="menu"
          :loading="loading"
          responsive-layout="scroll"
          :global-filter-fields="['name', 'fullAddress', 'capacity']"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">
                Gestion des lieux
              </h5>
              <div class="flex gap-4">
                <Button @click="clearFilter()" type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" />
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Search..." />
                </span>
              </div>
            </div>
          </template>
          <template #empty>
            Aucun lieu trouvé
          </template>
          <template #loading>
            Chargement des lieux...
          </template>
          <Column expander style="width: 5rem" />
          <Column sortable field="name" header="Name" style="min-width: 12rem">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by name" />
            </template>
          </Column>
          <Column sortable sort-field="fullAddress" filter-field="fullAddress" header="Place" style="min-width: 12rem">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by address" />
            </template>
            <template #body="{ data }">
              <span class="block">{{ data.address }}</span>
              <span class="text-sm font-italic">{{ data.zip }} {{ data.city }}</span>
            </template>
            <template #filterclear="{ filterCallback }">
              <Button @click="filterCallback()" type="button" icon="pi pi-times" class="p-button-secondary" />
            </template>
          </Column>
          <Column
            sortable sort-field="capacity" header="Capacité" filter-field="capacity" data-type="numeric"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <span>{{ data.seatTypes.reduce((total: number, seatType: SeatType) => total + seatType.capacity, 0) }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputNumber v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" placeholder="Capacité" />
            </template>
            <template #filterclear="{ filterCallback }">
              <Button @click="filterCallback()" type="button" icon="pi pi-times" class="p-button-secondary" />
            </template>
          </Column>
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button @click="editPlace(slotProps.data)" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" />
              <Button @click="confirmDeletePlace(slotProps.data)" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" />
            </template>
          </Column>

          <template #expansion="slotProps">
            <div class="p-3">
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">
                  Types de place pour le lieu : {{ slotProps.data?.name }}
                </h5>
                <div class="my-2">
                  <Button @click="openNewSeatType(slotProps.data)" label="New" icon="pi pi-plus" class="p-button-success mr-2" />
                </div>
              </div>
              <DataTable :value="slotProps.data.seatTypes">
                <Column field="id" header="Id" sortable />
                <Column field="name" header="Nom" sortable />
                <Column field="description" header="Description" sortable />
                <Column field="capacity" header="Places disponibles" sortable>
                  <template #body="{ data }">
                    <span>{{ data.capacity }}</span>
                  </template>
                </Column>
                <Column header-style="min-width:10rem;">
                  <template #body="slotProps">
                    <Button @click="editSeatType(slotProps.data)" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" />
                    <Button @click="confirmDeleteSeatType(slotProps.data)" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </DataTable>

        <Dialog v-model:visible="placeDialog" :style="{ width: '450px' }" header="Détails du lieu" :modal="true" class="p-fluid">
          <Form
            id="savePlaceForm"
            @submit="savePlace"
            :initial-values="place"
            :validation-schema="placeTypedSchema"
          >
            <Field v-slot="{ field, errorMessage }" name="name">
              <div class="field">
                <label for="name">Nom</label>
                <InputText id="name" v-bind="field" v-model.trim="place.name" :class="{ 'p-invalid': errorMessage }" />
                <small id="name-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
            <Field v-slot="{ field, errorMessage }" name="description">
              <div class="field">
                <label for="description">Description</label>
                <Textarea id="description" v-bind="field" v-model.trim="place.description" :class="{ 'p-invalid': errorMessage }" />
                <small id="description-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
            <Field v-slot="{ field, errorMessage }" name="address">
              <div class="field">
                <label for="address">Addresse</label>
                <InputText id="address" v-bind="field" v-model="place.address" :class="{ 'p-invalid': errorMessage }" />
                <small id="address-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
            <div class="formgrid grid">
              <Field v-slot="{ field, errorMessage }" name="city">
                <div class="field col">
                  <label for="city">Ville</label>
                  <InputText id="city" v-bind="field" v-model="place.city" :class="{ 'p-invalid': errorMessage }" />
                  <small id="city-help" class="p-error">{{ errorMessage }}</small>
                </div>
              </Field>
              <Field v-slot="{ field, errorMessage }" name="zip">
                <div class="field col">
                  <label for="zip">Code postal</label>
                  <InputText id="zip" v-bind="field" v-model="place.zip" :class="{ 'p-invalid': errorMessage }" />
                  <small id="zip-help" class="p-error">{{ errorMessage }}</small>
                </div>
              </Field>
            </div>
          </Form>
          <span v-if="place.id" class="mt-3">Capacité maximale: <span class="font-bold">{{ place.seatTypes?.reduce((total, seatType) => total + seatType.capacity, 0) }}</span></span>
          <template #footer>
            <Button @click="placeDialog = false" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button label="Save" type="submit" form="savePlaceForm" icon="pi pi-check" />
          </template>
        </Dialog>

        <Dialog v-model:visible="seatTypeDialog" :style="{ width: '450px' }" header="Détails du type de place" :modal="true" class="p-fluid">
          <Form
            id="saveSeatTypeForm"
            @submit="saveSeatType"
            :initial-values="seatType"
            :validation-schema="seatTypeTypedSchema"
          >
            <Field v-slot="{ field, errorMessage }" name="name">
              <div class="field">
                <label for="name">Nom</label>
                <InputText id="name" v-bind="field" v-model.trim="seatType.name" :class="{ 'p-invalid': errorMessage }" />
                <small id="name-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
            <Field v-slot="{ field, errorMessage }" name="description">
              <div class="field">
                <label for="description">Description</label>
                <Textarea id="description" v-bind="field" v-model.trim="seatType.description" :class="{ 'p-invalid': errorMessage }" />
                <small id="description-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
            <Field v-slot="{ errorMessage, handleChange, value }" v-model="seatType.capacity" name="capacity">
              <div class="field">
                <label for="capacity">Capacité maximale</label>
                <InputNumber id="capacity" @update:model-value="handleChange" :model-value="value" :class="{ 'p-invalid': errorMessage }" />
                <small id="capacity-help" class="p-error">{{ errorMessage }}</small>
              </div>
            </Field>
          </Form>
          <template #footer>
            <Button @click="seatTypeDialog = false" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button label="Save" type="submit" form="saveSeatTypeForm" icon="pi pi-check" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deletePlaceDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="place">Êtes-vous sûr de vouloir supprimer <b>{{ place.name }}</b>?</span>
          </div>
          <template #footer>
            <Button @click="deletePlaceDialog = false" label="No" icon="pi pi-times" class="p-button-text" />
            <Button @click="deletePlace" label="Yes" icon="pi pi-check" class="p-button-text" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteSeatTypeDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="seatType">Êtes-vous sûr de vouloir supprimer <b>{{ seatType.name }}</b>?</span>
          </div>
          <template #footer>
            <Button @click="deleteSeatTypeDialog = false" label="No" icon="pi pi-times" class="p-button-text" />
            <Button @click="deleteSeatType" label="Yes" icon="pi pi-check" class="p-button-text" />
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
