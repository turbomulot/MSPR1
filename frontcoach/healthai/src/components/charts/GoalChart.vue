<template>
  <div class="chart-container">
    <canvas ref="chartCanvas" style="max-height: 200px;"></canvas>
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
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
)

const chartCanvas = ref<HTMLCanvasElement>()
const isLoading = ref(true)
const dashboardStore = useDashboardStore()
let chartInstance: Chart | null = null

const chartData = computed(() => dashboardStore.goalDistribution)

const createChart = () => {
  if (!chartCanvas.value || !chartData.value.length) return
  
  try {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels: chartData.value.map(item => item.label),
        datasets: [{
          label: 'Nombre d\'utilisateurs',
          data: chartData.value.map(item => item.value),
          backgroundColor: [
            'rgba(13, 110, 253, 0.8)',
            'rgba(40, 167, 69, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(253, 126, 20, 0.8)',
            'rgba(220, 53, 69, 0.8)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
    
    isLoading.value = false
    console.log('GoalChart created successfully')
  } catch (error) {
    console.error('Erreur création GoalChart:', error)
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
  console.log('GoalChart mounted')
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
  height: 200px;
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