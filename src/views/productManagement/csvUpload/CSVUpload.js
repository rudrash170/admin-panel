import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CFormLabel,
  CAlert,
  CProgress,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { csvService } from '../../../services/csvService'
import { useDispatch } from 'react-redux'
import { productActions } from '../../../store'

const CSVUpload = () => {
  const [csvFile, setCsvFile] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  const [validationResults, setValidationResults] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadResults, setUploadResults] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      // Check file extension
      const fileName = file.name.toLowerCase()
      const isCSV = fileName.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel'
      
      if (isCSV) {
        setCsvFile(file)
        setError('')
        setParsedData(null)
        setValidationResults(null)
        setUploadResults(null)
      } else {
        setError(`Please select a valid CSV file. Selected file: ${file.name} (type: ${file.type})`)
        setCsvFile(null)
      }
    } else {
      setError('No file selected')
      setCsvFile(null)
    }
  }

  const handleParseCSV = async () => {
    if (!csvFile) return

    setIsProcessing(true)
    setError('')

    try {
      const parsed = await csvService.parseCSV(csvFile)
      setParsedData(parsed)
      
      const validation = csvService.validateProducts(parsed)
      setValidationResults(validation)
      setShowPreview(true)
    } catch (err) {
      console.error('CSV parsing failed:', err)
      setError(err.message)
    }

    setIsProcessing(false)
  }

  const handleUploadProducts = async () => {
    if (!validationResults?.validProducts.length) return

    setIsProcessing(true)
    setUploadProgress({ current: 0, total: validationResults.validProducts.length, percentage: 0 })

    try {
      const results = await csvService.uploadProducts(
        validationResults.validProducts,
        (progress) => setUploadProgress(progress)
      )
      
      setUploadResults(results)
      
      // Refresh the products list in the store
      dispatch(productActions.fetchProducts())
      
    } catch (err) {
      setError(err.message)
    }

    setIsProcessing(false)
  }

  const downloadSample = () => {
    csvService.downloadSampleCSV()
  }

  const resetForm = () => {
    setCsvFile(null)
    setParsedData(null)
    setValidationResults(null)
    setUploadProgress(null)
    setUploadResults(null)
    setShowPreview(false)
    setError('')
    document.getElementById('csvFileInput').value = ''
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Bulk Product Upload via CSV</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" className="mb-3">
                {error}
              </CAlert>
            )}

            {/* Instructions */}
            <div className="mb-4">
              <h5>Instructions:</h5>
              <ol>
                <li>Download the sample CSV template to see the required format</li>
                <li>Fill in your product data following the template format</li>
                <li>Upload your CSV file and preview the data</li>
                <li>Confirm the upload to add products to your database</li>
              </ol>
              
              <CButton 
                color="info" 
                variant="outline" 
                onClick={downloadSample}
                className="mb-3"
              >
                Download Sample CSV Template
              </CButton>
            </div>

            {/* File Upload */}
            <div className="mb-3">
              <CFormLabel htmlFor="csvFileInput">Select CSV File</CFormLabel>
              <CFormInput
                type="file"
                id="csvFileInput"
                accept=".csv,text/csv,application/vnd.ms-excel"
                onChange={handleFileChange}
              />
              <small className="text-muted">
                Accepts .csv files. Your CSV can include columns like: Title, Description, Price, Tags, Carat, Dimensions, Shape, Color, Clarity, Origin, Treatment
              </small>
            </div>

            {/* Parse Button */}
            {csvFile && !parsedData && (
              <CButton 
                color="primary" 
                onClick={handleParseCSV} 
                disabled={isProcessing}
                className="mb-3"
              >
                {isProcessing ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Parsing CSV...
                  </>
                ) : (
                  'Parse and Preview CSV'
                )}
              </CButton>
            )}

            {/* Validation Results */}
            {validationResults && (
              <div className="mb-4">
                <CAlert color="info">
                  <strong>Validation Results:</strong>
                  <ul className="mb-0 mt-2">
                    <li>{validationResults.validProducts.length} valid products found</li>
                    {validationResults.errors.length > 0 && (
                      <li className="text-danger">{validationResults.errors.length} errors found</li>
                    )}
                  </ul>
                </CAlert>

                {validationResults.errors.length > 0 && (
                  <CAlert color="warning">
                    <strong>Errors:</strong>
                    <ul className="mb-0 mt-2">
                      {validationResults.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </CAlert>
                )}

                {validationResults.validProducts.length > 0 && (
                  <CButton 
                    color="success" 
                    onClick={handleUploadProducts}
                    disabled={isProcessing}
                    className="me-2"
                  >
                    {isProcessing ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Uploading...
                      </>
                    ) : (
                      `Upload ${validationResults.validProducts.length} Products`
                    )}
                  </CButton>
                )}

                <CButton color="secondary" onClick={resetForm}>
                  Start Over
                </CButton>
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress && (
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Uploading products...</span>
                  <span>{uploadProgress.current} / {uploadProgress.total}</span>
                </div>
                <CProgress value={uploadProgress.percentage} className="mb-2" />
              </div>
            )}

            {/* Upload Results */}
            {uploadResults && (
              <CAlert color="success">
                <strong>Upload Complete!</strong>
                <ul className="mb-0 mt-2">
                  <li>{uploadResults.successful.length} products uploaded successfully</li>
                  {uploadResults.failed.length > 0 && (
                    <li className="text-warning">{uploadResults.failed.length} products failed to upload</li>
                  )}
                </ul>
                
                {uploadResults.failed.length > 0 && (
                  <details className="mt-3">
                    <summary>View Failed Uploads</summary>
                    <ul className="mt-2">
                      {uploadResults.failed.map((failure, index) => (
                        <li key={index}>
                          <strong>{failure.product.name}:</strong> {failure.error}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                <div className="mt-3">
                  <CButton as={Link} to="/product-management/list" color="primary" className="me-2">
                    View Products
                  </CButton>
                  <CButton color="secondary" onClick={resetForm}>
                    Upload More
                  </CButton>
                </div>
              </CAlert>
            )}

            {/* Back Button */}
            <div className="mt-4">
              <CButton as={Link} to="/product-management" color="secondary">
                Back to Product Management
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Preview Modal */}
      <CModal size="xl" visible={showPreview} onClose={() => setShowPreview(false)}>
        <CModalHeader onClose={() => setShowPreview(false)}>
          <CModalTitle>CSV Data Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationResults?.validProducts.length > 0 && (
            <div>
              <h6>Valid Products ({validationResults.validProducts.length})</h6>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <CTable striped hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Price</CTableHeaderCell>
                      <CTableHeaderCell>Categories</CTableHeaderCell>
                      <CTableHeaderCell>Carat</CTableHeaderCell>
                      <CTableHeaderCell>Shape</CTableHeaderCell>
                      <CTableHeaderCell>Color</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {validationResults.validProducts.slice(0, 10).map((product, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{product.name}</CTableDataCell>
                        <CTableDataCell>
                          {product.description ? 
                            (product.description.length > 50 ? 
                              `${product.description.substring(0, 50)}...` : 
                              product.description
                            ) : 
                            '-'
                          }
                        </CTableDataCell>
                        <CTableDataCell>₹{product.price}</CTableDataCell>
                        <CTableDataCell>
                          {product.categories.map((cat, i) => (
                            <CBadge key={i} color="secondary" className="me-1">
                              {cat}
                            </CBadge>
                          ))}
                        </CTableDataCell>
                        <CTableDataCell>{product.carat || '-'}</CTableDataCell>
                        <CTableDataCell>{product.shape || '-'}</CTableDataCell>
                        <CTableDataCell>{product.color || '-'}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                {validationResults.validProducts.length > 10 && (
                  <p className="text-muted">Showing first 10 products. {validationResults.validProducts.length - 10} more will be uploaded.</p>
                )}
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowPreview(false)}>
            Close Preview
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default CSVUpload
