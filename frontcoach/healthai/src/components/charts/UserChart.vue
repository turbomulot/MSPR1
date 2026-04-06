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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartCanvas = ref<HTMLCanvasElement>()
const isLoading = ref(true)
const dashboardStore = useDashboardStore()
let chartInstance: Chart | null = null

const chartData = computed(() => dashboardStore.userChartData)

const createChart = () => {
  if (!chartCanvas.value || !chartData.value) return
  
  try {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: chartData.value.labels,
        datasets: [
          {
            label: 'Nouveaux utilisateurs',
            data: chartData.value.newUsers,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Utilisateurs Premium',
            data: chartData.value.premiumUsers,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
    
    isLoading.value = false
    console.log('UserChart created successfully')
  } catch (error) {
    console.error('Erreur création UserChart:', error)
    isLoading.value = false
  }
}

const updateChart = () => {
  if (chartInstance && chartData.value) {
    chartInstance.data.labels = chartData.value.labels
    chartInstance.data.datasets[0].data = chartData.value.newUsers
    chartInstance.data.datasets[1].data = chartData.value.premiumUsers
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
  console.log('UserChart mounted')
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