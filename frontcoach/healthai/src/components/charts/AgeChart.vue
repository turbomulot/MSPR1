<template>
  <div class="chart-container">
    <canvas ref="chartCanvas" style="max-height: 250px;"></canvas>
    <div v-if="isLoading" class="loading-text">
      Chargement du graphique...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'
import {
  Chart,
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(ArcElement, DoughnutController, Tooltip, Legend)

const chartCanvas = ref<HTMLCanvasElement>()
const isLoading = ref(true)
const dashboardStore = useDashboardStore()
let chartInstance: Chart | null = null

const chartData = computed(() => dashboardStore.ageDistribution)

const createChart = () => {
  if (!chartCanvas.value || !chartData.value.length) return
  
  try {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: chartData.value.map(item => item.label),
        datasets: [{
          data: chartData.value.map(item => item.value),
          backgroundColor: [
            '#0d6efd',
            '#28a745',
            '#ffc107',
            '#fd7e14',
            '#dc3545'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    })
    
    isLoading.value = false
    console.log('AgeChart created successfully')
  } catch (error) {
    console.error('Erreur création AgeChart:', error)
    isLoading.value = false
  }
}

const updateChart = () => {
  if (chartInstance && chartData.value.length) {
    chartInstance.data.labels = chartData.value.map(item => item.label)
    chartInstance.data.datasets[0].data = chartData.value.map(item => item.value)
    chartInstance.update()
  }
}

// Watcher pour mettre à jour le graphique quand les données changent
watch(chartData, () => {
  if (chartInstance) {
    updateChart()
  } else {
    createChart()
  }
}, { deep: true })

onMounted(() => {
  console.log('AgeChart mounted')
  setTimeout(() => {
    createChart()
  }, 100)
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  position: absolute;
  color: #6c757d;
  font-size: 14px;
}

canvas {
  max-width: 100%;
}
</style>