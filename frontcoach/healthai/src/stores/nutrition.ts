import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type Product } from '../services/api'

export const useNutritionStore = defineStore('nutrition', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentProduct = ref<Product | null>(null)

  // Filters
  const filters = ref({
    search: '',
    category: '',
    brand: ''
  })

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Getters
  const nutritionStats = computed(() => {
    const total = products.value.length
    const categories = new Set(products.value.map(p => p.Product_category || 'Non catégorisé')).size
    const brands = new Set(products.value.map(p => p.Product_brand || 'Sans marque')).size

    return {
      total,
      categories,
      brands,
      averageCalories: products.value.length > 0 
        ? Math.round(products.value.reduce((sum, p) => sum + (p.Product_Calories || 0), 0) / total)
        : 0
    }
  })

  const filteredProducts = computed(() => {
    let filtered = products.value

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(product => 
        product.Product_Name.toLowerCase().includes(search) ||
        (product.Product_brand && product.Product_brand.toLowerCase().includes(search)) ||
        (product.Product_category && product.Product_category.toLowerCase().includes(search))
      )
    }

    if (filters.value.category) {
      filtered = filtered.filter(product => 
        (product.Product_category || 'Non catégorisé') === filters.value.category
      )
    }

    if (filters.value.brand) {
      filtered = filtered.filter(product => 
        (product.Product_brand || 'Sans marque') === filters.value.brand
      )
    }

    return filtered
  })

  const totalProducts = computed(() => filteredProducts.value.length)
  const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value))
  
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProducts.value.slice(start, end)
  })

  const categories = computed(() => {
    const cats = [...new Set(products.value.map(p => p.Product_category || 'Non catégorisé'))]
    return cats.sort()
  })

  const brands = computed(() => {
    const brandList = [...new Set(products.value.map(p => p.Product_brand || 'Sans marque'))]
    return brandList.sort()
  })

  // Actions
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      products.value = await apiService.getAllProducts()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des produits'
      console.error('Erreur fetch products:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      currentProduct.value = await apiService.getProduct(id)
      return currentProduct.value
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement du produit'
      console.error('Erreur fetch product:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData: Omit<Product, 'Product_ID'>) => {
    loading.value = true
    error.value = null
    
    try {
      const newProduct = await apiService.createProduct(productData)
      products.value.push(newProduct)
      return newProduct
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors de la création du produit'
      console.error('Erreur create product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedProduct = await apiService.updateProduct(id, productData)
      
      // Mettre à jour dans la liste
      const index = products.value.findIndex(p => p.Product_ID === id)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      
      // Mettre à jour le produit courant si c'est le même
      if (currentProduct.value && currentProduct.value.Product_ID === id) {
        currentProduct.value = updatedProduct
      }
      
      return updatedProduct
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors de la mise à jour'
      console.error('Erreur update product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deleteProduct(id)
      
      // Supprimer de la liste locale
      products.value = products.value.filter(p => p.Product_ID !== id)
      
      // Réinitialiser le produit courant si c'était lui
      if (currentProduct.value && currentProduct.value.Product_ID === id) {
        currentProduct.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors de la suppression'
      console.error('Erreur delete product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters: Partial<typeof filters.value>) => {
    Object.assign(filters.value, newFilters)
    currentPage.value = 1 // Reset pagination
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1 // Reset pagination
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentProduct = () => {
    currentProduct.value = null
  }

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    // Getters
    nutritionStats,
    filteredProducts,
    totalProducts,
    totalPages,
    paginatedProducts,
    categories,
    brands,
    // Actions
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    setPage,
    setItemsPerPage,
    clearError,
    clearCurrentProduct
  }
})