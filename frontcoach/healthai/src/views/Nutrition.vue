<template>
  <div class="container-fluid mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary">Base Nutritionnelle</h2>
      <div>
        <button class="btn btn-outline-secondary me-2" @click="refreshData" :disabled="nutritionStore.loading">
          <i class="bi bi-arrow-clockwise" :class="{ 'spinner-border spinner-border-sm': nutritionStore.loading }"></i> 
          {{ nutritionStore.loading ? 'Chargement...' : 'Actualiser' }}
        </button>
        <button class="btn btn-primary" @click="openAddProductModal">
          <i class="bi bi-plus"></i> Ajouter un produit
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="nutritionStore.error" class="alert alert-danger alert-dismissible" role="alert">
      {{ nutritionStore.error }}
      <button type="button" class="btn-close" @click="nutritionStore.clearError()"></button>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">Total Produits</h5>
                <h3>{{ nutritionStore.nutritionStats.total }}</h3>
              </div>
              <i class="bi bi-basket3 fs-2"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">Catégories</h5>
                <h3>{{ nutritionStore.nutritionStats.categories }}</h3>
              </div>
              <i class="bi bi-tags fs-2"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">Marques</h5>
                <h3>{{ nutritionStore.nutritionStats.brands }}</h3>
              </div>
              <i class="bi bi-building fs-2"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5 class="card-title">Calories Moy.</h5>
                <h3>{{ nutritionStore.nutritionStats.averageCalories }}</h3>
              </div>
              <i class="bi bi-lightning fs-2"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Rechercher</label>
            <input 
              :value="nutritionStore.filters.search"
              @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
              type="text" 
              class="form-control" 
              placeholder="Nom, marque..."
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">Catégorie</label>
            <select 
              :value="nutritionStore.filters.category"
              @change="updateFilter('category', ($event.target as HTMLSelectElement).value)"
              class="form-select"
            >
              <option value="">Toutes</option>
              <option v-for="category in nutritionStore.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Marque</label>
            <select 
              :value="nutritionStore.filters.brand"
              @change="updateFilter('brand', ($event.target as HTMLSelectElement).value)"
              class="form-select"
            >
              <option value="">Toutes</option>
              <option v-for="brand in nutritionStore.brands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">&nbsp;</label>
            <button class="btn btn-outline-secondary d-block" @click="resetFilters">Réinitialiser</button>
          </div>
        </div>
      </div>
    </div>


    <div class="card">
      <div class="card-body">
        <div v-if="nutritionStore.paginatedProducts.length === 0" class="text-center py-4">
          <i class="bi bi-basket3 fs-1 text-muted"></i>
          <p class="text-muted mt-2">Aucun produit trouvé</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Produit</th>
                <th>Marque</th>
                <th>Catégorie</th>
                <th>Calories</th>
                <th>Protéines</th>
                <th>Glucides</th>
                <th>Lipides</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in nutritionStore.paginatedProducts" :key="product.Product_ID">
                <td>
                  <strong>{{ product.Product_Name }}</strong>
                  <div class="text-muted small" v-if="product.Product_Diet_Tags">
                    {{ product.Product_Diet_Tags }}
                  </div>
                </td>
                <td>{{ product.Product_brand || '-' }}</td>
                <td>
                  <span class="badge bg-light text-dark">{{ product.Product_category || 'Non catégorisé' }}</span>
                </td>
                <td>
                  <span v-if="product.Product_Calories" class="badge bg-warning text-dark">
                    {{ product.Product_Calories }} kcal
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>{{ product.Product_Protein ? product.Product_Protein + 'g' : '-' }}</td>
                <td>{{ product.Product_Carbs ? product.Product_Carbs + 'g' : '-' }}</td>
                <td>{{ product.Product_Fat ? product.Product_Fat + 'g' : '-' }}</td>
                <td>
                  <div class="dropdown">
                    <button class="btn btn-outline-dark btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                      Actions
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#" @click="editProduct(product)">
                        <i class="bi bi-pencil"></i> Modifier
                      </a></li>
                      <li><a class="dropdown-item" href="#" @click="viewProductDetails(product)">
                        <i class="bi bi-eye"></i> Détails
                      </a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item text-danger" href="#" @click="deleteProductPrompt(product.Product_ID)">
                        <i class="bi bi-trash"></i> Supprimer
                      </a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <nav class="mt-4" v-if="nutritionStore.totalProducts > 0">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted">
                Affichage de {{ (nutritionStore.currentPage - 1) * nutritionStore.itemsPerPage + 1 }} à 
                {{ Math.min(nutritionStore.currentPage * nutritionStore.itemsPerPage, nutritionStore.totalProducts) }} 
                sur {{ nutritionStore.totalProducts }} produits
              </span>
            </div>
            <div class="d-flex align-items-center">
              <label class="me-2">Éléments par page :</label>
              <select 
                :value="nutritionStore.itemsPerPage" 
                @change="nutritionStore.setItemsPerPage(parseInt(($event.target as HTMLSelectElement).value))"
                class="form-select me-3" 
                style="width: auto;"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: nutritionStore.currentPage === 1 }">
                  <a class="page-link" @click="nutritionStore.setPage(nutritionStore.currentPage - 1)">&laquo;</a>
                </li>
                <li v-for="page in visiblePages" :key="page" 
                    class="page-item" :class="{ active: page === nutritionStore.currentPage }">
                  <a class="page-link" @click="nutritionStore.setPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: nutritionStore.currentPage === nutritionStore.totalPages }">
                  <a class="page-link" @click="nutritionStore.setPage(nutritionStore.currentPage + 1)">&raquo;</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- Product Details Modal -->
    <div class="modal fade" id="detailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails du produit</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedProduct">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted">Informations générales</h6>
                <p><strong>Nom :</strong> {{ selectedProduct.Product_Name }}</p>
                <p><strong>Marque :</strong> {{ selectedProduct.Product_brand || 'Non spécifiée' }}</p>
                <p><strong>Catégorie :</strong> {{ selectedProduct.Product_category || 'Non catégorisé' }}</p>
                <p><strong>Tags diététiques :</strong> {{ selectedProduct.Product_Diet_Tags || 'Aucun' }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted">Valeurs nutritionnelles (pour 100g)</h6>
                <p><strong>Calories :</strong> {{ selectedProduct.Product_Calories || '0' }} kcal</p>
                <p><strong>Protéines :</strong> {{ selectedProduct.Product_Protein || '0' }}g</p>
                <p><strong>Glucides :</strong> {{ selectedProduct.Product_Carbs || '0' }}g</p>
                <p><strong>Lipides :</strong> {{ selectedProduct.Product_Fat || '0' }}g</p>
                <p><strong>Fibres :</strong> {{ selectedProduct.Product_Fiber || '0' }}g</p>
                <p><strong>Sodium :</strong> {{ selectedProduct.Product_Sodium || '0' }}mg</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useNutritionStore } from '../stores/nutrition'
import type { Product } from '../services/api'

// Stores
const nutritionStore = useNutritionStore()

// État local
const selectedProduct = ref<Product | null>(null)

// Computed
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, nutritionStore.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(nutritionStore.totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Méthodes
const updateFilter = (key: string, value: string) => {
  nutritionStore.setFilters({ [key]: value })
}

const resetFilters = () => {
  nutritionStore.setFilters({
    search: '',
    category: '',
    brand: ''
  })
}

const refreshData = async () => {
  await nutritionStore.fetchProducts()
}

const openAddProductModal = () => {
  alert('Fonctionnalité d\'ajout de produit à venir')
}

const editProduct = (product: Product) => {
  console.log('Edit product:', product)
  alert('Fonctionnalité de modification à venir')
}

const viewProductDetails = (product: Product) => {
  selectedProduct.value = product
  
  const modal = new (window as any).bootstrap.Modal(document.getElementById('detailsModal'))
  modal.show()
}

const deleteProductPrompt = async (productId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await nutritionStore.deleteProduct(productId)
      alert('Produit supprimé avec succès')
    } catch (error) {
      alert('Erreur lors de la suppression du produit')
    }
  }
}

// Lifecycle
onMounted(async () => {
  await nutritionStore.fetchProducts()
})
</script>

<style scoped>
.table th {
  font-weight: 600;
  color: #495057;
  border-top: none;
}

.badge {
  font-size: 0.75rem;
}

.dropdown-toggle::after {
  font-size: 0.7rem;
}
</style>