import React, { useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import {supabase} from "../../lib/supabaseClient";

const Dashboard = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('orders') // replace 'users' with your table name
        .select('*')
      if (error) {
        console.error('Supabase error:', error)
      } else {
        console.log('Supabase data:', data)
      }
    }
    fetchData()
  }, [])

  const pendingOrders = [
    { id: 'ORD001', customer: 'John Doe', total: '₹150.00' },
    { id: 'ORD002', customer: 'Jane Smith', total: '₹200.50' },
  ]

  const lowStockProducts = [
    { name: 'Sample Product 4', stock: 5 },
    { name: 'Sample Product 5', stock: 2 },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Dashboard</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12} md={6}>
                <CCard className="mb-4">
                  <CCardHeader>Sales Summary</CCardHeader>
                  <CCardBody>
                    <CChart
                      type="bar"
                      data={{
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                        datasets: [
                          {
                            label: 'Sales',
                            backgroundColor: '#f87979',
                            data: [40, 20, 12, 39, 10, 40, 39],
                          },
                        ],
                      }}
                      labels="months"
                    />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs={12} md={6}>
                <CCard className="mb-4">
                  <CCardHeader>Pending Orders</CCardHeader>
                  <CCardBody>
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Order ID</CTableHeaderCell>
                          <CTableHeaderCell>Customer</CTableHeaderCell>
                          <CTableHeaderCell>Total</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {pendingOrders.map((order) => (
                          <CTableRow key={order.id}>
                            <CTableDataCell>{order.id}</CTableDataCell>
                            <CTableDataCell>{order.customer}</CTableDataCell>
                            <CTableDataCell>{order.total}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CCard className="mb-4">
                  <CCardHeader>Low-Stock Alerts</CCardHeader>
                  <CCardBody>
                    <CTable hover>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Product Name</CTableHeaderCell>
                          <CTableHeaderCell>Stock</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {lowStockProducts.map((product, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{product.name}</CTableDataCell>
                            <CTableDataCell>{product.stock}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
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

export default Dashboard
