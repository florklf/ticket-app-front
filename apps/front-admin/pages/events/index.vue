<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { EnumEventType } from '~/types/EnumEventType'
import { EnumEventStatus } from '~/types/EnumEventStatus'
import { Event } from '~/types/Events/Event'
import { Place } from '~/types/Events/Place'

const { data: events, refresh } = await useCustomFetch<Event[]>('/events', { key: 'events' })
const { data: places } = await useCustomFetch<Place[]>('/places')
const toast = useToast()
const dayjs = useDayjs()
const loading = ref(null)
const selectedEvents = ref()
const event: Ref<Partial<Event>> = ref({})
const eventDialog = ref(false)
const deleteEventDialog = ref(false)
const deleteEventsDialog = ref(false)
const submitted = ref(false)
const eventImage = ref()
const eventTypes = ref(Object.values(EnumEventType))
const eventStatuses = ref(Object.values(EnumEventStatus))
const filters = ref()

const getEventsStatuses = () => {
  events.value.forEach((event) => {
    event.date = new Date(event.date)
    if (event.date < new Date()) {
      event.status = EnumEventStatus.PAST
    } else {
      event.EventSeatType.find((seatType) => {
        if (seatType.available_seats > 0) {
          event.status = EnumEventStatus.AVAILABLE
          return true
        }
        return false
      })
      if (event.status !== EnumEventStatus.AVAILABLE) {
        event.status = EnumEventStatus.SOLD_OUT
      }
    }
  })
}

getEventsStatuses()

watch(events, () => {
  getEventsStatuses()
})

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'place.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    type: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.IN },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
  }
}

initFilters()

const clearFilter1 = () => {
  initFilters()
}

const getSeverity = (status) => {
  switch (status) {
    case EnumEventStatus.AVAILABLE:
      return 'success'
    case EnumEventStatus.SOLD_OUT:
      return 'warning'
    case EnumEventStatus.PAST:
      return 'danger'
    default:
      return 'info'
  }
}

const openNew = () => {
  event.value = {}
  submitted.value = false
  eventDialog.value = true
}

const hideDialog = () => {
  eventDialog.value = false
  submitted.value = false
}

const saveEvent = async () => {
  submitted.value = true
  console.info(event.value)
  console.info(eventImage.value)
  if (event.value.name && event.value.name.trim()) {
    if (event.value.id) {
      // event.value.inventoryStatus = event.value.inventoryStatus.value ? event.value.inventoryStatus.value : event.value.inventoryStatus
      // events.value[findIndexById(event.value.id)] = event.value
      const { data: updatedEvent } = await useCustomFetch<Event>(`/events/${event.value.id}`, {
        method: 'PATCH',
        body: {
          name: event.value.name,
          description: event.value.description,
          date: dayjs(event.value.date).format('YYYY-MM-DD HH:mm:ss'),
          type: event.value.type,
          place: {
            connect: {
              id: event.value.place.id
            }
          }
        },
        key: 'event'
      })
      if (eventImage.value) {
        uploadImage(updatedEvent)
      }
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Evenement modifié',
        life: 3000
      })
    } else {
      const { data: createdEvent } = await useCustomFetch<Event>('/events', {
        method: 'POST',
        body: JSON.stringify({
          ...event.value,
          date: dayjs(event.value.date).format('YYYY-MM-DD HH:mm:ss'),
          place: {
            connect: {
              id: event.value.place.id
            }
          }
        }),
        key: 'event'
      })
      if (eventImage.value) {
        uploadImage(createdEvent)
      }
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Evenement créé',
        life: 3000
      })
    }
    refresh()
    eventDialog.value = false
    event.value = {}
    eventImage.value = null
  }
}

const uploadImage = async (event) => {
  const formdata = new FormData()
  formdata.append('file', eventImage.value)
  await useCustomFetch<Event>(`/events/${event.value.id}/upload`, {
    method: 'POST',
    body: formdata,
    key: 'uploadImage'
  })
}

const editEvent = (editEvent) => {
  event.value = { ...editEvent }
  eventDialog.value = true
}

const confirmDeleteEvent = (editEvent) => {
  event.value = editEvent
  deleteEventDialog.value = true
}

const deleteEvent = async () => {
  const { error } = await useCustomFetch<Event>(`/events/${event.value.id}`, { method: 'DELETE', key: 'deleteEvent' })
  console.info(error)
  if (!error.value) {
    events.value = events.value.filter(val => val.id !== event.value.id)
    deleteEventDialog.value = false
    event.value = {}
    toast.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Event Deleted',
      life: 3000
    })
  } else if (error.value.statusCode === 400) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Impossible de supprimer un évènement lié à des réservations ou des types de places',
      life: 3000
    })
  }
}
const confirmDeleteSelected = () => {
  deleteEventsDialog.value = true
}

const deleteSelectedEvents = () => {
  events.value = events.value.filter(val => !selectedEvents.value.includes(val))
  deleteEventsDialog.value = false
  selectedEvents.value = null
  toast.add({
    severity: 'success',
    summary: 'Successful',
    detail: 'Products Deleted',
    life: 3000
  })
}

const onFileChange = (event) => {
  eventImage.value = event.target.files[0]
  if (event.target.files[0]?.name) {
    document.getElementById('image-field-label').textContent = event.target.files[0].name.slice(0, 30) + '...'
  } else {
    document.getElementById('image-field-label').textContent = 'Choisir une image'
  }
  console.info(event)
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div v-if="events" class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template #start>
            <div class="my-2">
              <Button @click="openNew" label="New" icon="pi pi-plus" class="p-button-success mr-2" />
            </div>
          </template>

          <template #end>
            <Button @click="confirmDeleteSelected" label="Delete" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedEvents || !selectedEvents.length" />
          </template>
        </Toolbar>
        <DataTable
          v-model:filters="filters"
          :value="events"
          :paginator="true"
          class="p-datatable-gridlines"
          :rows="10"
          data-key="id"
          :row-hover="true"
          filter-display="menu"
          :loading="loading"
          responsive-layout="scroll"
          :global-filter-fields="['name', 'place.name', 'type']"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">
                Manage Events
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
            No events found.
          </template>
          <template #loading>
            Loading events data. Please wait.
          </template>
          <Column sortable field="name" header="Name" style="min-width: 12rem">
            <template #body="{ data }">
              <img :alt="data.type" :src="data.image" class="shadow-2 border-round" width="32" style="vertical-align: middle">
              <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.name }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by name" />
            </template>
          </Column>
          <Column sortable sort-field="place.name" header="Place" filter-field="place.name" style="min-width: 12rem">
            <template #body="{ data }">
              <img src="/demo/images/flag/flag_placeholder.png" :alt="data.place.name" width="30">
              <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.place.name }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by place" />
            </template>
            <template #filterclear="{ filterCallback }">
              <Button @click="filterCallback()" type="button" icon="pi pi-times" class="p-button-secondary" />
            </template>
            <template #filterapply="{ filterCallback }">
              <Button @click="filterCallback()" type="button" icon="pi pi-check" class="p-button-success" />
            </template>
          </Column>
          <Column
            sortable header="Type" sort-field="type" filter-field="type" :show-filter-match-modes="false"
            :filter-menu-style="{ width: '14rem' }"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <Tag :value="data.type" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <div class="mb-3 text-bold">
                Type de concert
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
          <Column
            sortable header="Date" sort-field="date" filter-field="date" data-type="date"
            style="min-width: 10rem"
          >
            <template #body="{ data }">
              {{ dayjs(data?.date).format('DD/MM/YYYY HH[h]mm') }}
            </template>
            <template #filter="{ filterModel }">
              <Calendar v-model="filterModel.value" date-format="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
            </template>
          </Column>

          <Column
            sortable header="Statut" sort-field="status" filter-field="status" :show-filter-match-modes="false"
            :filter-menu-style="{ width: '14rem' }"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <Tag :value="$t(`event.status.${data.status}`)" :severity="getSeverity(data.status)" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <div class="mb-3 text-bold">
                Statut du concert
              </div>
              <MultiSelect v-model="filterModel.value" @change="filterCallback" :options="eventStatuses" placeholder="Any" class="p-column-filter">
                <template #option="slotProps">
                  <div class="p-multiselect-representative-option">
                    <span>{{ $t(`event.status.${slotProps.option}`) }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column field="available_seats" header="Places disponibles" :show-filter-match-modes="false" style="min-width: 12rem">
            <template #body="{ data }">
              <ClientOnly>
                <span class="block mx-auto text-right text-sm font-bold">{{ data.EventSeatType.reduce((total, eventSeat) => total + eventSeat.available_seats, 0).toLocaleString() }}</span>
                <ProgressBar
                  :value="(data.EventSeatType.reduce((total, seatType) => total + seatType.available_seats, 0) / data.EventSeatType.reduce((total, eventSeatType) => total + eventSeatType.seatType?.capacity, 0)) * 100"
                  :show-value="false" style="height: 0.5rem"
                />
                <template #fallback>
                  Loading progress bar...
                </template>
              </ClientOnly>
            </template>
            <template #filter="{ filterModel }">
              <Slider v-model="filterModel.value" :range="true" class="m-3" />
              <div class="flex align-items-center justify-content-between px-2">
                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
              </div>
            </template>
          </Column>
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button @click="editEvent(slotProps.data)" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" />
              <Button @click="confirmDeleteEvent(slotProps.data)" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="eventDialog" :style="{ width: '450px' }" header="Détails de l'évènement" :modal="true" class="p-fluid">
          <img v-if="event?.image" :src="event?.image" :alt="event?.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2">
          <div class="field">
            <label for="name">Name</label>
            <InputText id="name" v-model.trim="event.name" required="true" autofocus :class="{ 'p-invalid': submitted && !event.name }" />
            <small v-if="submitted && !event.name" class="p-invalid">Le nom est requis.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="event.description" required="true" rows="3" cols="20" />
          </div>

          <div class="field flex flex-column align-items-start">
            <label for="image-field">Image</label>
            <label id="image-field-label" for="image-field" class="mb-3 cursor-pointer p-2 bg-primary">
              <i class="pi pi-upload mr-2" />Choisir une image
            </label>
            <input id="image-field" @change="(e) => onFileChange(e)" class="btn hidden" type="file">
          </div>

          <div class="field">
            <label class="mb-3">Type d'évènement</label>
            <div class="formgrid grid">
              <div v-for="(type, index) in eventTypes" :key="index" class="field-radiobutton col-6">
                <RadioButton v-model="event.type" :input-id="type" name="type" :value="type" />
                <label :for="type">{{ type }}</label>
              </div>
            </div>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label class="mb-3">Lieu de l'évènement</label>
              <Dropdown
                v-model="event.place"
                @change="console.info(event); console.info()" :options="places" filter option-label="name"
                placeholder="Sélectionner un lieu" class="w-full md:w-14rem"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex align-items-center">
                    <div>{{ slotProps.value.name }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex align-items-center">
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
              </Dropdown>
            </div>
            <div class="field col">
              <label class="mb-3">Date</label>
              <Calendar v-model="event.date" show-time hour-format="24" />
            </div>
          </div>
          <template #footer>
            <Button @click="hideDialog" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button @click="saveEvent" label="Save" icon="pi pi-check" class="p-button-text" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteEventDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="event">Are you sure you want to delete <b>{{ event.name }}</b>?</span>
          </div>
          <template #footer>
            <Button @click="deleteEventDialog = false" label="No" icon="pi pi-times" class="p-button-text" />
            <Button @click="deleteEvent" label="Yes" icon="pi pi-check" class="p-button-text" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteEventsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="event">Are you sure you want to delete the selected events?</span>
          </div>
          <template #footer>
            <Button @click="deleteEventsDialog = false" label="No" icon="pi pi-times" class="p-button-text" />
            <Button @click="deleteSelectedEvents" label="Yes" icon="pi pi-check" class="p-button-text" />
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
