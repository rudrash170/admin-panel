import React from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
} from '@coreui/react'

const ProductManagementDashboard = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Product Management</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={4} className="mb-3">
                <CCard className="h-100">
                  <CCardBody className="text-center">
                    <h5>View All Products</h5>
                    <p>Browse and manage your entire product inventory</p>
                    <CButton as={Link} to="/product-management/list" color="primary">
                      View Products
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
              
              <CCol md={4} className="mb-3">
                <CCard className="h-100">
                  <CCardBody className="text-center">
                    <h5>Add Single Product</h5>
                    <p>Add a new product manually with all details</p>
                    <CButton as={Link} to="/product-management/add" color="success">
                      Add Product
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
              
              <CCol md={4} className="mb-3">
                <CCard className="h-100">
                  <CCardBody className="text-center">
                    <h5>Bulk CSV Upload</h5>
                    <p>Upload multiple products at once using a CSV file</p>
                    <CButton as={Link} to="/product-management/csv-upload" color="info">
                      Upload CSV
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductManagementDashboard
