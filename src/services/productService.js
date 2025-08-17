import { supabase } from '../lib/supabaseClient'

export const productService = {
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  async createProduct(productData) {
    try {
      const insertData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        categories: productData.categories,
        created_at: new Date().toISOString()
      }

      // Add SKU if provided
      if (productData.sku) insertData.sku = productData.sku

      // Add optional ruby-specific fields if they exist
      if (productData.carat) insertData.carat = productData.carat
      if (productData.dimensions) insertData.dimensions = productData.dimensions
      if (productData.shape) insertData.shape = productData.shape
      if (productData.color) insertData.color = productData.color
      if (productData.clarity) insertData.clarity = productData.clarity
      if (productData.origin) insertData.origin = productData.origin
      if (productData.treatment) insertData.treatment = productData.treatment
      
      const { data, error } = await supabase
        .from('products')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  async updateProduct(id, productData) {
    try {
      const updateData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        categories: productData.categories,
      }

      // If photos are provided, update them
      if (productData.photos) {
        updateData.photos = productData.photos
      }

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('product_id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  async uploadImage(file, productId) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${productId}_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const getUrlRes = supabase.storage.from('photos').getPublicUrl(fileName)
      const publicUrl = getUrlRes?.data?.publicUrl || null

      if (!publicUrl) {
        throw new Error('Could not get public URL for uploaded image')
      }

      // Get current product
      const product = await this.getProductById(productId)

      // Update product with new photo URL
      const updatedPhotos = [...(product.photos || []), publicUrl]
      await this.updateProduct(productId, { photos: updatedPhotos })

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  async deleteImage(imageUrl) {
    try {
      const fileName = imageUrl.split('/').pop()
      const { error } = await supabase.storage
        .from('photos')
        .remove([fileName])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }
}