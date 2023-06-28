<script setup lang="ts">
import { Order } from 'ts-interfaces'
import { EnumTimeScope } from '~/types/EnumTimeScope'

const props = defineProps({
  orders: {
    type: Array as PropType<Order[]|null|undefined>,
    required: true
  },
  timeScope: {
    type: String as PropType<EnumTimeScope>,
    required: true
  }
})

const orders = toRefs(props).orders
const timeScope = toRefs(props).timeScope
const dayjs = useDayjs()

const chartData = computed(() => {
  const dates = {} as any

  orders.value?.forEach((order) => {
    let dateKey
    const createdAt = dayjs(order.created_at)

    switch (timeScope.value) {
      case 'day':
        dateKey = createdAt.format('HH:00')
        break
      case 'week':
        dateKey = createdAt.format('dddd DD/MM')
        break
      case 'month':
        dateKey = `du ${createdAt.startOf('week').format('DD/MM')} au ${createdAt.endOf('week').format('DD/MM')}`
        break
      case 'year':
        dateKey = createdAt.format('MM/YYYY')
        break
      case 'all':
        dateKey = createdAt.format('YYYY')
        break
      default:
        dateKey = createdAt.format('YYYY-MM-DD')
    }

    dates[dateKey] = {
      quantity: (dates[dateKey]?.quantity || 0) + order.orderItems.reduce((acc, item) => acc + item.quantity, 0),
      date: createdAt
    }
  })

  const sortedDates = Object.keys(dates).sort((a, b) => dates[a].date - dates[b].date)

  return {
    labels: sortedDates,
    datasets: [{
      label: 'Nombre de places vendues',
      data: sortedDates.map(date => dates[date].quantity),
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  }
})

const config = computed(() => ({
  type: 'line',
  data: chartData.value,
  options: {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Nombre de places vendues'
        }
      }
    }
  }
}))
</script>

<template>
  <Chart type="line" :data="chartData" :options="config" />
</template>
