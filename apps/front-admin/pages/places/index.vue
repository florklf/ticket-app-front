<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Place, SeatType } from 'ts-interfaces'

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
const submitted = ref(false)
const filters = ref()
const expandedRows = ref([])

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    fullAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    capacity: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }] }
  }
}

initFilters()

const clearFilter1 = () => {
  initFilters()
}

const openNew = () => {
  place.value = {}
  submitted.value = false
  placeDialog.value = true
}

const openNewSeatType = (parentPlace: Place) => {
  place.value = parentPlace
  seatType.value = {}
  submitted.value = false
  seatTypeDialog.value = true
}

const editPlace = (editedPlace: Place) => {
  place.value = { ...editedPlace }
  placeDialog.value = true
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

const hidePlaceDialog = () => {
  placeDialog.value = false
  submitted.value = false
}

const hideSeatTypeDialog = () => {
  seatTypeDialog.value = false
  submitted.value = false
}

const savePlace = async () => {
  submitted.value = true
  if (place.value.name && place.value.name.trim()) {
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
}

const saveSeatType = async () => {
  submitted.value = true
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
                <Button @click="clearFilter1()" type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" />
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
          <div class="field">
            <label for="name">Nom</label>
            <InputText id="name" v-model.trim="place.name" required="true" autofocus :class="{ 'p-invalid': submitted && !place.name }" />
            <small v-if="submitted && !place.name" class="p-invalid">Le nom est requis.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="place.description" required="true" rows="3" cols="20" />
          </div>
          <div class="formgrid grid">
            <div class="field col-12">
              <label class="mb-3">Adresse</label>
              <InputText id="name" v-model.trim="place.address" required="true" autofocus :class="{ 'p-invalid': submitted && !place.address }" />
            </div>
            <div class="field col">
              <label class="mb-3">Ville</label>
              <InputText id="name" v-model.trim="place.city" required="true" autofocus :class="{ 'p-invalid': submitted && !place.city }" />
            </div>
            <div class="field col">
              <label class="mb-3">Code postal</label>
              <InputMask
                id="name" v-model.trim="place.zip" required="true" autofocus :class="{ 'p-invalid': submitted && !place.zip }"
                mask="99999" placeholder=""
              />
            </div>
          </div>
          <span v-if="place.id" class="mt-3">Capacité maximale: <span class="font-bold">{{ place.seatTypes?.reduce((total, seatType) => total + seatType.capacity, 0) }}</span></span>
          <template #footer>
            <Button @click="hidePlaceDialog" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button @click="savePlace" label="Save" icon="pi pi-check" class="p-button-text" />
          </template>
        </Dialog>

        <Dialog v-model:visible="seatTypeDialog" :style="{ width: '450px' }" header="Détails du type de place" :modal="true" class="p-fluid">
          <div class="field">
            <label for="name">Nom</label>
            <InputText id="name" v-model.trim="seatType.name" required="true" autofocus :class="{ 'p-invalid': submitted && !seatType.name }" />
            <small v-if="submitted && !seatType.name" class="p-invalid">Le nom est requis.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="seatType.description" required="true" rows="3" cols="20" />
          </div>
          <div class="field">
            <label class="mb-3">Capacité maximale</label>
            <InputNumber v-model="seatType.capacity" :min="1" />
          </div>
          <template #footer>
            <Button @click="hideSeatTypeDialog" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button @click="saveSeatType" label="Save" icon="pi pi-check" class="p-button-text" />
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
            <span v-if="seatType">Êtes-vous sûr de vous supprimer <b>{{ seatType.name }}</b>?</span>
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
