import Papa from 'papaparse'
import { productService } from './productService'

export const csvService = {
  /**
   * Parse CSV file and return an array of product objects
   * @param {File} file - CSV file
   * @returns {Promise<Array>} - Array of parsed products
   */
  async parseCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true, // Use first row as headers
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Transform headers to match our product schema
          const headerMap = {
            'sku': 'sku',
            'sku id': 'sku',
            'product name': 'name',
            'name': 'name',
            'title': 'name',
            'description': 'description',
            'price': 'price',
            'categories': 'categories',
            'category': 'categories',
            'tags': 'categories',
            'carat': 'carat',
            'dimensions': 'dimensions',
            'shape': 'shape',
            'color': 'color',
            'clarity': 'clarity',
            'origin': 'origin',
            'treatment': 'treatment'
          }
          return headerMap[header.toLowerCase()] || header.toLowerCase()
        },
        transform: (value, field) => {
          // Transform specific fields
          if (field === 'price') {
            // Remove currency symbols and convert to number
            // Handle empty price values
            if (!value || value.trim() === '') {
              return 0
            }
            const cleanPrice = value.replace(/[₹$€£,]/g, '').trim()
            return parseFloat(cleanPrice) || 0
          }
          if (field === 'categories' || field === 'tags') {
            // Split categories/tags by comma and clean them
            if (!value || value.trim() === '') {
              return []
            }
            return value.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0)
          }
          return value
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error('CSV parsing errors:', results.errors)
            reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`))
          } else {
            resolve(results.data)
          }
        },
        error: (error) => {
          console.error('CSV parsing failed:', error)
          reject(new Error(`CSV parsing failed: ${error.message}`))
        }
      })
    })
  },

  /**
   * Validate parsed CSV data
   * @param {Array} products - Array of product objects
   * @returns {Object} - Validation result with valid products and errors
   */
  validateProducts(products) {
    const validProducts = []
    const errors = []

    products.forEach((product, index) => {
      const rowNumber = index + 2 // +2 because index starts at 0 and we skip header row

      // Check for SKU
      if (!product.sku || !product.sku.trim()) {
        errors.push(`Row ${rowNumber}: SKU is required`)
        return
      }

      // Check for product name - prefer 'title' over 'name' if both exist
      let productName = ''
      if (product.title && product.title.trim()) {
        productName = product.title.trim()
      } else if (product.name && product.name.trim()) {
        productName = product.name.trim()
      }

      if (!productName) {
        errors.push(`Row ${rowNumber}: Product name is required`)
        return
      }

      // For ruby data, price might be empty - generate a default price or skip validation
      let price = 0
      if (product.price && !isNaN(product.price) && product.price > 0) {
        price = parseFloat(product.price)
      } else {
        // If no price, we could either skip this product or set a default
        // For now, let's set a default price of 1000 for demonstration
        price = 1000
      }

      // Prepare valid product with additional ruby-specific fields
      const validProduct = {
        sku: product.sku.trim(),
        name: productName,
        description: product.description ? product.description.trim() : '',
        price: price,
        categories: Array.isArray(product.categories) ? product.categories : 
                   (product.categories ? product.categories.split(',').map(cat => cat.trim()) : []),
        created_at: new Date().toISOString()
      }

      // Add ruby-specific fields if they exist
      if (product.carat) validProduct.carat = product.carat
      if (product.dimensions) validProduct.dimensions = product.dimensions
      if (product.shape) validProduct.shape = product.shape
      if (product.color) validProduct.color = product.color
      if (product.clarity) validProduct.clarity = product.clarity
      if (product.origin) validProduct.origin = product.origin
      if (product.treatment) validProduct.treatment = product.treatment

      validProducts.push(validProduct)
    })

    return { validProducts, errors }
  },

  /**
   * Upload multiple products to Supabase
   * @param {Array} products - Array of valid product objects
   * @param {Function} onProgress - Progress callback function
   * @returns {Promise<Object>} - Upload result
   */
  async uploadProducts(products, onProgress = null) {
    const results = {
      successful: [],
      failed: [],
      total: products.length
    }

    for (let i = 0; i < products.length; i++) {
      try {
        const product = products[i]
        const createdProduct = await productService.createProduct(product)
        results.successful.push({ index: i, product: createdProduct })
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: products.length,
            percentage: Math.round(((i + 1) / products.length) * 100)
          })
        }
      } catch (error) {
        results.failed.push({ 
          index: i, 
          product: products[i], 
          error: error.message 
        })
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: products.length,
            percentage: Math.round(((i + 1) / products.length) * 100)
          })
        }
      }
    }

    return results
  },

  /**
   * Generate a sample CSV template
   * @returns {string} - CSV content as string
   */
  generateSampleCSV() {
    const sampleData = [
      {
        'Product Name': 'Diamond Ring',
        'Description': 'Beautiful diamond engagement ring with platinum setting',
        'Price': '₹50000',
        'Categories': 'Rings, Diamond, Engagement'
      },
      {
        'Product Name': 'Gold Necklace',
        'Description': 'Traditional gold necklace with intricate design',
        'Price': '₹25000',
        'Categories': 'Necklaces, Gold, Traditional'
      },
      {
        'Product Name': 'Pearl Earrings',
        'Description': 'Elegant pearl drop earrings',
        'Price': '₹8000',
        'Categories': 'Earrings, Pearl, Elegant'
      }
    ]

    return Papa.unparse(sampleData)
  },

  /**
   * Download sample CSV file
   */
  downloadSampleCSV() {
    const csvContent = this.generateSampleCSV()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'sample_products.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
