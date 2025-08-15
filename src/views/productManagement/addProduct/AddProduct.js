import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { productActions } from '../../../store'
import { selectProductError, selectProductLoading } from '../../../store/selectors'
import { useEffect } from 'react'

const ProductAdd = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    photos: []
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const error = useSelector(selectProductError)
  const loading = useSelector(selectProductLoading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setProduct(prevProduct => ({
      ...prevProduct,
      [id]: id === 'price' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      alert('You can only upload up to 5 images')
      return
    }
    setImageFiles(files)
    // Cleanup old previews
    imagePreviews.forEach(url => URL.revokeObjectURL(url))
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        categories: product.categories.filter(cat => cat.trim() !== '')
      }

      const action = await dispatch(productActions.createProduct(productData))
      const newProduct = action.payload

      if (imageFiles.length > 0 && newProduct?.id) {
        const uploadPromises = imageFiles.map((file) =>
          dispatch(productActions.uploadImage({ file, productId: newProduct.id }))
        )
        // Wait for all uploads and extract payloads when available
        const results = await Promise.all(uploadPromises)
        // results are actions; try to read payloads
        const uploadedUrls = results.map((r) => r.payload || r)
        // Optionally update the product with returned urls (server side already updates in service)
      }

      // Cleanup
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      navigate('/product-management/list')
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New Gem/Jewelry</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-3">
                {error}
              </CAlert>
            )}
            
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Product Name*</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  placeholder="Enter gem/jewelry name"
                  onChange={handleChange}
                  value={product.name}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  placeholder="Enter detailed description"
                  onChange={handleChange}
                  value={product.description}
                  rows="3"
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="categories">Categories</CFormLabel>
                <CFormInput
                  type="text"
                  id="categories"
                  placeholder="E.g., Rings, Necklaces, Precious Stones (comma separated)"
                  onChange={(e) => setProduct({
                    ...product,
                    categories: e.target.value.split(',').map(cat => cat.trim())
                  })}
                  value={product.categories.join(', ')}
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="price">Price*</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>₹</CInputGroupText>
                  <CFormInput
                    type="number"
                    id="price"
                    placeholder="Enter price"
                    onChange={handleChange}
                    value={product.price}
                    min="0"
                    step="0.01"
                    required
                  />
                </CInputGroup>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="productImage">
                  Product Photos (Max 5 images)
                </CFormLabel>
                <CFormInput 
                  type="file" 
                  id="productImage" 
                  multiple 
                  onChange={handleImageChange}
                  accept="image/*"
                  max="5"
                />
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {imagePreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="d-flex gap-2">
                <CButton 
                  type="submit" 
                  color="primary" 
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </CButton>
                <CButton 
                  as={Link} 
                  to="/product-management/list" 
                  color="secondary" 
                  disabled={isSubmitting}
                >
                  Cancel
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductAdd