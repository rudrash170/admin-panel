import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'

const PaymentStatistics = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Payment Statistics</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} sm={6} md={4}>
                <CCard textColor="white" className="mb-3 bg-primary">
                  <CCardHeader>Total Revenue</CCardHeader>
                  <CCardBody>
                    <h5 className="card-title">$15,230.00</h5>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} md={4}>
                <CCard textColor="white" className="mb-3 bg-success">
                  <CCardHeader>Transaction Volume</CCardHeader>
                  <CCardBody>
                    <h5 className="card-title">1,204</h5>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} sm={6} md={4}>
                <CCard textColor="white" className="mb-3 bg-info">
                  <CCardHeader>Average Order Value</CCardHeader>
                  <CCardBody>
                    <h5 className="card-title">$126.50</h5>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CCard className="mt-4">
              <CCardHeader>Revenue Over Time</CCardHeader>
              <CCardBody>
                <CChart
                  type="line"
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: 'Revenue',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        data: [1200, 1500, 1800, 1600, 2100, 2400, 2200],
                      },
                    ],
                  }}
                />
              </CCardBody>
            </CCard>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PaymentStatistics 