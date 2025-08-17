import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormSelect,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'
import { productActions } from '../../../store'

const ProductList = () => {
  const { products: allProducts, loading, error } = useSelector((state) => state)
  const dispatch = useDispatch()
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    dispatch(productActions.fetchProducts())
  }, [dispatch])

  // Get unique categories from all products' category arrays
  const categories = useMemo(() => ['All', ...new Set(allProducts.flatMap((p) => p.categories || []))], [allProducts])

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((product) => product.categories?.includes(selectedCategory))
  }, [allProducts, selectedCategory])

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(productActions.deleteProduct(productId))
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Jewelry & Gems Inventory</strong>
            <div className="d-flex align-items-center">
              <CFormSelect
                className="me-2"
                style={{ width: '200px' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </CFormSelect>
              <CButton 
                as={Link} 
                to="/product-management/csv-upload" 
                color="info"
                variant="outline"
                size="sm" 
                className="me-2"
              >
                Bulk Upload CSV
              </CButton>
              <CButton as={Link} to="/product-management/add" size="sm">
                Add New Item
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-3">
                Error: {error}
              </CAlert>
            )}
            
            {loading ? (
              <div className="text-center py-4">
                <CSpinner />
                <p className="mt-2">Loading inventory...</p>
              </div>
            ) : (
              <>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Carat</th>
                      <th>Shape</th>
                      <th>Color</th>
                      <th>Categories</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.product_id} style={{ height: '140px' }}>
                        <td style={{ verticalAlign: 'middle', fontWeight: 'bold', fontSize: '0.9em' }}>
                          {product.sku || 'N/A'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {product.photos && product.photos.length > 0 ? (
                              product.photos.map((photo, idx) => (
                  <img
                                  key={idx}
                                  src={photo}
                                  alt={`${product.name} ${idx + 1}`}
                    loading="lazy"
                                  style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  }}
                                />
                              ))
                            ) : (
                              <div 
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: '#f8f9fa',
                                  borderRadius: '8px',
                                  border: '1px dashed #dee2e6'
                                }}
                              >
                                No Image
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>{product.name}</td>
                        <td style={{ verticalAlign: 'middle' }}>{product.carat || '-'}</td>
                        <td style={{ verticalAlign: 'middle' }}>{product.shape || '-'}</td>
                        <td style={{ verticalAlign: 'middle' }}>{product.color || '-'}</td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {product.categories?.map((cat, idx) => (
                            <span 
                              key={idx}
                              className="badge bg-light text-dark me-1"
                              style={{ fontSize: '0.9rem' }}
                            >
                              {cat}
                            </span>
                          ))}
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>{formatPrice(product.price)}</td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <CButton
                            as={Link}
                            to={`/product-management/edit/${product.product_id}`}
                            size="sm"
                            color="primary"
                            className="me-2"
                          >
                            Edit
                          </CButton>
                          <CButton 
                            size="sm" 
                            color="danger"
                            onClick={() => handleDelete(product.product_id)}
                          >
                            Delete
                          </CButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No products found in this category.</p>
                  </div>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductList