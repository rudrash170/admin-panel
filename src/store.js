import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from './services/productService'

// Create async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await productService.getAllProducts()
    return response
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData) => {
    const response = await productService.createProduct(productData)
    return response
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }) => {
    const response = await productService.updateProduct(id, productData)
    return response
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id) => {
    await productService.deleteProduct(id)
    return id
  }
)

export const uploadImage = createAsyncThunk(
  'products/uploadImage',
  async ({ file, productId }) => {
    const response = await productService.uploadImage(file, productId)
    return response
  }
)

const initialState = {
  sidebarShow: true,
  theme: 'light',
  products: [],
  loading: false,
  error: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSidebarShow: (state, { payload }) => {
      state.sidebarShow = payload
    },
    setTheme: (state, { payload }) => {
      state.theme = payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.unshift(action.payload)
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter(p => p.id !== action.payload)
        state.error = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { setSidebarShow, setTheme } = appSlice.actions

export const store = configureStore({
  reducer: appSlice.reducer,
})

export const productActions = {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}

export default store