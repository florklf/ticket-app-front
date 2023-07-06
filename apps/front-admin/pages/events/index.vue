<script setup lang="ts">
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { Event, Place, SeatType, EnumEventType, EnumEventStatus } from 'ts-interfaces'
import { Type } from 'ts-interfaces/types/Events/Type'

interface EventSeatType {
    id: number;
    price: number;
    available_seats: number;
    event_id: number;
    seat_type_id: number;
    assignedAt: string;
    seatType: SeatType;
}

const { data: events, refresh } = await useCustomFetch<Event[]>('/events', { key: 'events' })
const { data: places } = await useCustomFetch<Place[]>('/places')
const toast = useToast()
const dayjs = useDayjs()
const loading = ref(false)
const selectedEvents = ref()
const event: Ref<Partial<Event>> = ref({})
const eventSeatType: Ref<Partial<EventSeatType>> = ref({})
const selectedSeatType: Ref<Partial<SeatType>> = ref({})
const expandedEvent: Ref<Partial<Event>> = ref({})
const eventDialog = ref(false)
const eventSeatTypeDialog = ref(false)
const deleteEventDialog = ref(false)
const deleteEventSeatTypeDialog = ref(false)
const deleteEventsDialog = ref(false)
const submitted = ref(false)
const eventImage = ref()
const eventTypes = ref(Object.values(EnumEventType))
const eventStatuses = ref(Object.values(EnumEventStatus))
const filters = ref()
const expandedRows = ref([])

const getEventsStatuses = () => {
  events.value?.forEach((event) => {
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
    'type.name': { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.IN },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
  }
}

initFilters()

const clearFilter1 = () => {
  initFilters()
}

const getSeverity = (status: EnumEventStatus) => {
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
  event.value = {
    name: '',
    description: '',
    date: new Date(),
    type: {
      name: EnumEventType.CONCERT
    } as Type
  }
  submitted.value = false
  eventDialog.value = true
}

const openNewEventSeatType = (event: Event) => {
  expandedEvent.value = event
  eventSeatType.value = {}
  submitted.value = false
  eventSeatTypeDialog.value = true
}

const hideDialog = () => {
  eventDialog.value = false
  submitted.value = false
}

const hideEventSeatTypeDialog = () => {
  eventSeatTypeDialog.value = false
  submitted.value = false
}

const saveEvent = async () => {
  submitted.value = true
  if (event.value.name?.trim() && event.value.description && event.value.place && event.value.type && event.value.date && event.value.date > new Date()) {
    if (event.value.id) {
      const { data: updatedEvent } = await useCustomFetch<Event>(`/events/${event.value.id}`, {
        method: 'PATCH',
        body: {
          name: event.value.name,
          description: event.value.description,
          date: dayjs(event.value.date).format('YYYY-MM-DD HH:mm:ss'),
          type: {
            connect: {
              name: event.value.type.name
            }
          },
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
      const { type, ...eventWithoutType } = event.value
      const { data: createdEvent } = await useCustomFetch<Event>('/events', {
        method: 'POST',
        body: JSON.stringify({
          ...eventWithoutType,
          type: {
            connect: {
              name: type.name
            }
          },
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

const saveEventSeatType = async () => {
  submitted.value = true
  if (eventSeatType.value.price && eventSeatType.value.price > 0) {
    if (eventSeatType.value.id) {
      await useCustomFetch<EventSeatType>(`/events/seat-types/${eventSeatType.value.id}`, {
        method: 'PATCH',
        body: {
          price: eventSeatType.value.price,
          available_seats: eventSeatType.value.available_seats,
          seatType: {
            connect: {
              id: eventSeatType.value.seatType?.id
            }
          }
        },
        key: 'eventSeatType'
      })
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Type de place modifié',
        life: 3000
      })
    } else {
      await useCustomFetch<EventSeatType>('/events/seat-types', {
        method: 'POST',
        body: JSON.stringify({
          ...eventSeatType.value,
          available_seats: selectedSeatType.value.capacity,
          seatType: {
            connect: {
              id: selectedSeatType.value.id
            }
          },
          event: {
            connect: {
              id: expandedEvent.value.id
            }
          }
        }),
        key: 'eventSeatType'
      })
      toast.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Type de place créé',
        life: 3000
      })
    }
    refresh()
    eventSeatTypeDialog.value = false
    eventSeatType.value = {}
  }
}

const uploadImage = async (event: Ref<Event | null>) => {
  const formdata = new FormData()
  formdata.append('file', eventImage.value)
  await useCustomFetch<Event>(`/events/${event.value?.id}/upload`, {
    method: 'POST',
    body: formdata,
    key: 'uploadImage'
  })
}

const editEvent = (editEvent: Event) => {
  event.value = { ...editEvent }
  eventDialog.value = true
}

const editEventSeatType = (editEventSeatType: EventSeatType) => {
  eventSeatType.value = { ...editEventSeatType }
  eventSeatTypeDialog.value = true
}

const confirmDeleteEvent = (editEvent: Event) => {
  event.value = editEvent
  deleteEventDialog.value = true
}

const confirmDeleteEventSeatType = (editEventSeatType: EventSeatType) => {
  eventSeatType.value = editEventSeatType
  deleteEventSeatTypeDialog.value = true
}

const deleteEvent = async () => {
  const { error } = await useCustomFetch<Event>(`/events/${event.value.id}`, { method: 'DELETE', key: 'deleteEvent' })
  if (!error.value) {
    events.value = events.value?.filter(val => val.id !== event.value.id) ?? null
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

const deleteEventSeatType = async () => {
  const { error } = await useCustomFetch<Event>(`/events/seat-types/${eventSeatType.value.id}`, { method: 'DELETE', key: 'deleteEventSeatType' })
  if (!error.value) {
    events.value = events.value?.filter(val => val.id !== eventSeatType.value.id) ?? null
    deleteEventSeatTypeDialog.value = false
    eventSeatType.value = {}
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
  refresh()
}

const deleteSelectedEvents = () => {
  events.value = events.value?.filter(val => !selectedEvents.value.includes(val)) ?? null
  deleteEventsDialog.value = false
  selectedEvents.value = null
  toast.add({
    severity: 'success',
    summary: 'Successful',
    detail: 'Products Deleted',
    life: 3000
  })
}

const onFileChange = (e: any) => {
  eventImage.value = e.target?.files[0]
  const imageFieldLabel = document.getElementById('image-field-label')
  if (imageFieldLabel) {
    if (e.target.files[0]?.name) {
      imageFieldLabel.textContent = e.target.files[0].name.slice(0, 30) + '...'
    } else {
      imageFieldLabel.textContent = 'Choisir une image'
    }
  }
}
const eventStatusLabel = (eventStatus: EnumEventStatus) => {
  switch (eventStatus) {
    case EnumEventStatus.AVAILABLE:
      return 'Disponible'
    case EnumEventStatus.SOLD_OUT:
      return 'Complet'
    case EnumEventStatus.PAST:
      return 'Passé'
    case EnumEventStatus.UNAVAILABLE:
      return 'Indisponible'
    default:
      return 'Indéfini'
  }
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
              <Button @click="openNew" label="Nouveau" icon="pi pi-plus" class="p-button-success mr-2" />
            </div>
          </template>
        </Toolbar>
        <DataTable
          v-model:expandedRows="expandedRows"
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
                Gestion des évènements
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
          <Column expander style="width: 5rem" />
          <Column sortable field="name" header="Name" style="min-width: 12rem">
            <template #body="{ data }">
              <div v-if="data.image">
                <img :alt="data.type" :src="data.image" class="shadow-2 border-round" width="32" style="vertical-align: middle">
                <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.name }}</span>
              </div>
              <div v-else>
                <span>{{ data.name }}</span>
              </div>
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by name" />
            </template>
          </Column>
          <Column sortable sort-field="place.name" header="Place" filter-field="place.name" style="min-width: 12rem">
            <template #body="{ data }">
              <span>{{ data.place.name }}</span>
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
              <Tag :value="eventStatusLabel(data.status)" :severity="getSeverity(data.status)" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <div class="mb-3 text-bold">
                Statut du concert
              </div>
              <MultiSelect v-model="filterModel.value" @change="filterCallback" :options="eventStatuses" placeholder="Any" class="p-column-filter">
                <template #option="slotProps">
                  <div class="p-multiselect-representative-option">
                    <span>{{ eventStatusLabel(slotProps.option) }}</span>
                  </div>
                </template>
              </MultiSelect>
            </template>
          </Column>
          <Column field="available_seats" header="Places disponibles" :show-filter-match-modes="false" style="min-width: 12rem">
            <template #body="{ data }">
              <ClientOnly>
                <span class="block mx-auto text-right text-sm font-bold">{{ data.EventSeatType.reduce((total: number, eventSeatType: EventSeatType) => total + eventSeatType.available_seats, 0).toLocaleString() }}</span>
                <ProgressBar
                  :value="(data.EventSeatType.reduce((total: number, seatType: EventSeatType) => total + seatType.available_seats, 0) / data.EventSeatType.reduce((total: number, eventSeatType: EventSeatType) => total + eventSeatType.seatType?.capacity, 0)) * 100"
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
              <Button
                @click="confirmDeleteEvent(slotProps.data)" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                :disabled="slotProps.data.EventSeatType.some((eventSeatType: EventSeatType) => eventSeatType.available_seats !== eventSeatType.seatType.capacity)"
              />
            </template>
          </Column>

          <template #expansion="slotProps">
            <div class="p-3">
              <div class="flex justify-content-between align-items-center">
                <h5 class="m-0">
                  Types de place pour {{ slotProps.data?.name }}
                </h5>
                <div class="my-2">
                  <Dropdown
                    v-model="selectedSeatType"
                    @change="openNewEventSeatType(slotProps.data)" :options="slotProps.data.place.seatTypes.filter((seatType: SeatType) => !(slotProps.data.EventSeatType.map((eventSeatType: EventSeatType) => eventSeatType.seat_type_id)).includes(seatType.id))"
                    option-label="name" placeholder="Nouveau" :disabled="!slotProps.data.place.seatTypes.some((seatType: SeatType) => !(slotProps.data.EventSeatType.map((eventSeatType: EventSeatType) => eventSeatType.seat_type_id)).includes(seatType.id))"
                    class="w-full bg-primary text-white"
                  >
                    <template #value>
                      <span class="text-white font-bold">Nouveau</span>
                    </template>
                    <template #dropdownicon>
                      <i class="pi pi-plus text-white" />
                    </template>
                  </Dropdown>
                </div>
              </div>
              <DataTable :value="slotProps.data.EventSeatType">
                <Column field="id" header="Id" sortable />
                <Column field="seatType.name" header="Nom" sortable />
                <Column field="available_seats" header="Places disponibles" sortable />
                <Column field="amount" header="Amount" sortable>
                  <template #body="slotProps">
                    {{ slotProps.data.price.toLocaleString() }} €
                  </template>
                </Column>
                <Column field="available_seats" header="Places disponibles" :show-filter-match-modes="false" style="min-width: 12rem">
                  <template #body="{ data }">
                    <ClientOnly>
                      <span class="block mx-auto text-right text-sm font-bold">{{ data.available_seats.toLocaleString() }}</span>
                      <ProgressBar
                        :value="(data.available_seats / data.seatType?.capacity) * 100"
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
                    <Button @click="editEventSeatType(slotProps.data)" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" />
                    <Button
                      @click="confirmDeleteEventSeatType(slotProps.data)" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                      :disabled="slotProps.data.available_seats !== slotProps.data.seatType.capacity"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </DataTable>

        <Dialog v-model:visible="eventDialog" :style="{ width: '450px' }" header="Détails de l'évènement" :modal="true" class="p-fluid">
          <img v-if="event?.image" :src="event?.image" :alt="event?.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2">
          <div class="field">
            <label for="name">Name</label>
            <InputText id="name" v-model.trim="event.name" required="true" autofocus :class="{ 'p-invalid': submitted && !event.name }" />
            <small v-if="submitted && !event.name" class="p-error">Le nom est requis.</small>
          </div>
          <div class="field">
            <label for="description">Description</label>
            <Textarea
              id="description" v-model="event.description" required="true" rows="3" cols="20"
              :class="{ 'p-invalid': submitted && !event.description }"
            />
            <small v-if="submitted && !event.description" class="p-error">La description est requise.</small>
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
                <RadioButton v-model="(event as Event).type.name" :input-id="type" name="type" :value="type" :class="{ 'p-invalid': submitted && !event.type?.name }" />
                <label :for="type">{{ type }}</label>
              </div>
            </div>
            <small v-if="submitted && !event.type?.name" class="p-error">Le type est requis.</small>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <label class="mb-3">Lieu de l'évènement</label>
              <Dropdown
                v-model="event.place"
                :disabled="event.EventSeatType?.some(eventSeat => eventSeat.available_seats < eventSeat.seatType.capacity)" :options="places as Place[]" filter option-label="name"
                placeholder="Sélectionner un lieu" class="w-full md:w-14rem" :class="{ 'p-invalid': submitted && !event.place?.name }"
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
              <small v-if="submitted && !event.place?.name" class="p-error">Le type est requis.</small>
              <small v-if="event.EventSeatType?.some(eventSeat => eventSeat.available_seats < eventSeat.seatType.capacity)">Impossible de modifier le lieu une fois la vente démarrée</small>
            </div>
            <div class="field col">
              <label class="mb-3">Date</label>
              <Calendar v-model="event.date" show-time hour-format="24" :min="Date.now()" :class="{ 'p-invalid': submitted && (!event.date || event.date < new Date()) }" />
              <small v-if="submitted && !event.date" class="p-error">La date est requise</small>
              <small v-else-if="submitted && event.date && (event.date < new Date())" class="p-error">La date ne peut pas être dans le passé</small>
            </div>
          </div>
          <template #footer>
            <Button @click="hideDialog" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button @click="saveEvent" label="Save" icon="pi pi-check" class="p-button-text" />
          </template>
        </Dialog>

        <Dialog v-model:visible="eventSeatTypeDialog" :style="{ width: '450px' }" :header="`Détails du type de place - ${eventSeatType.seatType?.name ?? selectedSeatType.name}`" :modal="true" class="p-fluid">
          <img v-if="event?.image" :src="event?.image" :alt="event?.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2">
          <div class="field">
            <label class="font-bold">Description</label>
            <p>{{ eventSeatType.seatType?.description ?? selectedSeatType.description }}</p>
          </div>
          <div class="field">
            <label class="font-bold">Capacité maximale</label>
            <p>{{ eventSeatType.seatType?.capacity ?? selectedSeatType.capacity }}</p>
          </div>
          <div class="field">
            <label for="name">Prix</label>
            <InputNumber id="name" v-model.trim="eventSeatType.price" required="true" autofocus :class="{ 'p-invalid': submitted && !eventSeatType.price }" />
            <small v-if="submitted && !eventSeatType.seatType?.name" class="p-invalid">Le prix est requis.</small>
          </div>
          <template #footer>
            <Button @click="hideEventSeatTypeDialog" label="Cancel" icon="pi pi-times" class="p-button-text" />
            <Button @click="saveEventSeatType" label="Save" icon="pi pi-check" class="p-button-text" />
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

        <Dialog v-model:visible="deleteEventSeatTypeDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="event">Are you sure you want to delete <b>{{ eventSeatType.seatType?.name }}</b>?</span>
          </div>
          <template #footer>
            <Button @click="deleteEventSeatTypeDialog = false" label="No" icon="pi pi-times" class="p-button-text" />
            <Button @click="deleteEventSeatType" label="Yes" icon="pi pi-check" class="p-button-text" />
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
