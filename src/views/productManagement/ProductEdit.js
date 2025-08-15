import React, { useState, useEffect } from 'react'
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
  CAvatar,
  CInputGroup,
  CInputGroupText,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { productActions } from '../../store'

const ProductEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { products, loading, error } = useSelector((state) => state)
  // Ensure id comparison works for string or numeric ids
  const productToEdit = products.find((p) => String(p.id) === String(id))

  const [product, setProduct] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit)
      setImagePreviews(productToEdit.photos || [])
    }
  }, [productToEdit])

  const handleChange = (e) => {
    const { id: field, value } = e.target
    // Keep price as a number in state
    if (field === 'price') {
      setProduct({ ...product, price: value === '' ? '' : Number(value) })
    } else {
      setProduct({ ...product, [field]: value })
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...previews])
  }

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch (e) {}
      })
    }
  }, [imagePreviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Upload new images if any (dispatch expects { file, productId })
      if (imageFiles.length > 0) {
        const uploadedUrls = []
        for (const file of imageFiles) {
          // dispatch the thunk and unwrap to get the returned payload (publicUrl)
          const action = await dispatch(productActions.uploadImage({ file, productId: product.id }))
          // action may be a fulfilled action; payload contains the result
          const url = action.payload || action
          uploadedUrls.push(url)
        }

        // Combine existing and new images
        const allImages = [...(product.photos || []), ...uploadedUrls]
        setProduct({ ...product, photos: allImages })

        // Update product with new images (unwrap payload if needed)
        await dispatch(productActions.updateProduct({ id: product.id, productData: { photos: allImages } }))
      } else {
        // Update product without new images
        await dispatch(productActions.updateProduct({ id: product.id, productData: product }))
      }
      
      alert('Product saved successfully!')
      navigate('/product-management/list')
    } catch (error) {
      console.error('Error updating product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <CSpinner />
        <p className="mt-2">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <CAlert color="danger">
        Product not found!
      </CAlert>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Product #{id}</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-3">
                Error: {error}
              </CAlert>
            )}
            
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="name">Product Name</CFormLabel>
                <CFormInput type="text" id="name" value={product.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="category">Category</CFormLabel>
                <CFormInput
                  type="text"
                  id="category"
                  value={product.category}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="price">Price</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>₹</CInputGroupText>
                    <CFormInput
                      type="number"
                      id="price"
                      placeholder="Enter price"
                      onChange={handleChange}
                      value={product.price === undefined || product.price === null ? '' : product.price}
                      min="0"
                      step="0.01"
                      required
                    />
                </CInputGroup>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="sku">SKU</CFormLabel>
                <CFormInput
                  type="text"
                  id="sku"
                  value={product.sku}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel>Current Photos</CFormLabel>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Product ${product.name} ${idx + 1}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          border: '1px solid #ccc',
                        }}
                      />
                    ))
                  ) : (
                    <span>No Images</span>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="productImage">Change Photos</CFormLabel>
                <CFormInput type="file" id="productImage" multiple onChange={handleImageChange} />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="seo">SEO Tags</CFormLabel>
                <CFormTextarea
                  id="seo"
                  rows="3"
                  value={product.seo}
                  onChange={handleChange}
                ></CFormTextarea>
              </div>
              <CButton type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </CButton>
              <CButton as={Link} to="/product-management/list" color="secondary" className="ms-2" disabled={isSubmitting}>
                Cancel
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductEdit 