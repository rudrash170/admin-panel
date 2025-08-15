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
        .eq('id', id)
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
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.price,
          categories: productData.categories,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
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
        .eq('id', id)
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
      // First, get the product to get its photos
      const product = await this.getProductById(id)

      // Delete photos from storage if they exist
      if (product?.photos?.length > 0) {
        await Promise.all(product.photos.map((photoUrl) => this.deleteImage(photoUrl)))
      }

      // Then delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
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