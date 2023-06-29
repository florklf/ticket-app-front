<script setup lang="ts">
import { EnumRole, Order, User } from 'ts-interfaces'
import { useRoute } from 'vue-router'
import * as zod from 'zod'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode, FilterOperator } from 'primevue/api'

const userDialog = ref(false)
const deleteUserDialog = ref(false)
const filters = ref()
const expandedRows = ref([])
const loading = ref(false)

const route = useRoute()
const toast = useToast()
const dayjs = useDayjs()

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

// const { data: orders } = await useCustomFetch<Order[]>('/orders')

const ordersTable = computed(() => {
  return orders.value?.map((order: Order) => {
    return {
      ...order,
      created_at: new Date(order.created_at),
      name: `${order.user.firstname} ${order.user.lastname}`,
      fullBillingAddress: `${order.billing_address}, ${order.billing_zip} ${order.billing_city} ${order.billing_country}`,
      fullShippingAddress: `${order.shipping_address}, ${order.shipping_zip} ${order.shipping_city} ${order.shipping_country}`
    }
  })
})

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    fullBillingAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    fullShippingAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    'payment.amount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
  }
}

initFilters()

const clearFilter1 = () => {
  initFilters()
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
    <div>
      <DataTable
        ref="dataTable"
        v-model:expanded-rows="expandedRows"
        v-model:filters="filters"
        :value="ordersTable"
        :paginator="true"
        class="p-datatable-gridlines"
        :rows="10"
        data-key="id"
        :row-hover="true"
        filter-display="menu"
        :loading="loading"
        responsive-layout="scroll"
        :global-filter-fields="['id', 'fullBillingAddress', 'fullShippingAddress', 'name', 'amount', 'country']"
      >
        <template #header>
          <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 class="m-0">
              Commandes du client
            </h5>
            <div class="flex gap-4">
              <Button @click="clearFilter1()" type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" />
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" orderholder="Search..." />
              </span>
            </div>
          </div>
        </template>
        <template #empty>
          Aucune commande trouvé
        </template>
        <template #loading>
          Chargement des commandes...
        </template>
        <Column expander style="width: 3rem" />
        <Column field="id" header="Id" sortable />
        <Column
          field="created_at" filter-field="created_at" sortable header="Date" data-type="date"
          style="min-width: 10rem"
        >
          <template #body="{ data }">
            {{ dayjs(data?.created_at).format('DD/MM/YYYY HH[h]mm') }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar v-model="filterModel.value" date-format="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
          </template>
        </Column>
        <Column field="name" header="Nom" sortable style="min-width: 12rem">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by name" />
          </template>
        </Column>
        <Column sortable sort-field="fullBillingAddress" filter-field="fullBillingAddress" header="Addresse de facturation" style="min-width: 12rem">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by address" />
          </template>
          <template #body="{ data }">
            <span class="block">{{ data.billing_address }}</span>
            <span class="text-sm font-italic">{{ data.billing_zip }} {{ data.billing_city }}</span>
          </template>
          <template #filterclear="{ filterCallback }">
            <Button @click="filterCallback()" type="button" icon="pi pi-times" class="p-button-secondary" />
          </template>
        </Column>
        <Column sortable sort-field="fullShippingAddress" filter-field="fullShippingAddress" header="Addresse de livraison" style="min-width: 12rem">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" type="text" class="p-column-filter" placeholder="Search by address" />
          </template>
          <template #body="{ data }">
            <span class="block">{{ data.shipping_address }}</span>
            <span class="text-sm font-italic">{{ data.shipping_zip }} {{ data.shipping_city }}</span>
          </template>
          <template #filterclear="{ filterCallback }">
            <Button @click="filterCallback()" type="button" icon="pi pi-times" class="p-button-secondary" />
          </template>
        </Column>
        <Column field="payment.amount" header="Montant" sortable data-type="numeric">
          <template #body="slotProps">
            {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(slotProps.data.payment.amount) }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" type="number" class="p-column-filter" />
          </template>
        </Column>
        <Column header-style="width: 5rem; text-align: center" body-style="text-align: center; overflow: visible">
          <template #body="slotProps">
            <NuxtLink :to="`/orders/${slotProps.data.id}`">
              <Button type="button" icon="pi pi-cog" rounded />
            </NuxtLink>
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="p-3">
            <h5>
              Articles de la commande #{{ slotProps.data?.id }}
            </h5>
            <DataTable :value="slotProps.data.orderItems">
              <Column field="id" header="Id" sortable />
              <Column field="seatType.event.name" header="Evenement" sortable />
              <Column field="seatType.event.date" sortable header="Date" data-type="date" style="min-width: 10rem">
                <template #body="{ data }">
                  {{ dayjs(data?.created_at).format('DD/MM/YYYY HH[h]mm') }}
                </template>
              </Column>
              <Column field="seatType.seatType.name" header="Nom" sortable />
              <Column field="seatType.price" header="Montant" sortable data-type="numeric">
                <template #body="slotProps">
                  {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(slotProps.data.seatType.price) }}
                </template>
              </Column>
              <Column field="quantity" header="Quantité" sortable />
            </DataTable>
          </div>
        </template>
      </DataTable>
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
