<template>
  <div id="app">
    <Navbar />
    <main class="container-fluid mt-4">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  width: 100%;
  display: block;
  overflow-x: hidden;
}

nav.navbar {
  width: 100% !important;
  margin: 0 !important;
  position: relative !important;
  display: block !important;
  float: none !important;
  clear: both;
}

main.container-fluid {
  width: 100% !important;
  margin-top: 0 !important;
  padding-top: 1.5rem;
  clear: both;
  display: block;
}

@media (min-width: 1200px) {
  main.container-fluid {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  margin-bottom: 1rem;
}

.card:hover {
  transform: translateY(-2px);
}

.metric-card {
  text-align: center;
  padding: 20px;
}

.metric-card h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.metric-card .card-title {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

.filter-bar {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}

.progress {
  height: 8px;
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

@media (max-width: 768px) {
  .container-fluid {
    padding: 0 10px;
  }
  
  .metric-card {
    padding: 15px;
  }
  
  .metric-card h2 {
    font-size: 1.8rem;
  }
  
  .filter-bar {
    padding: 15px;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .navbar-brand {
    font-size: 1rem;
  }
  
  .navbar-nav .nav-link {
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 576px) {
  .metric-card h2 {
    font-size: 1.5rem;
  }
  
  .metric-card .card-title {
    font-size: 0.8rem;
  }
  
  .container-fluid {
    padding: 0 5px;
  }
  
  .filter-bar .row > div {
    margin-bottom: 1rem;
  }
  
  .table {
    font-size: 0.75rem;
  }
  
  .card-header h5 {
    font-size: 1rem;
  }
  
  .btn {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .mobile-stack {
    display: none;
  }
  
  .mobile-card {
    display: block;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    margin-bottom: 1rem;
    padding: 1rem;
  }
  
  .mobile-card .mobile-field {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f8f9fa;
  }
  
  .mobile-card .mobile-field:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .mobile-field-label {
    font-weight: 600;
    color: #495057;
  }
}

@media (min-width: 769px) {
  .mobile-card {
    display: none;
  }
  
  .desktop-table {
    display: block;
  }
}

@media (min-width: 1200px) {
  .metric-card {
    padding: 2rem;
  }
  
  .metric-card h2 {
    font-size: 3rem;
  }
  
  .metric-card .card-title {
    font-size: 1.1rem;
  }
  
  .filter-bar {
    padding: 2rem;
  }
  
  .card {
    margin-bottom: 2rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .card-header {
    padding: 1rem 1.5rem;
  }
  
  .card-header h5 {
    font-size: 1.2rem;
  }
}

@media (min-width: 1400px) {
  main.container-fluid {
    max-width: 1600px;
  }
  
  .metric-card {
    padding: 2.5rem;
  }
  
  .metric-card h2 {
    font-size: 3.5rem;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .metric-card {
    padding: 1.5rem;
  }
  
  .metric-card h2 {
    font-size: 2.2rem;
  }
}
</style>
