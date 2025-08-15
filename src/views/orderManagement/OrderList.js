import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTabContent,
  CTabPane,
  CNav,
  CNavItem,
  CNavLink,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const OrderList = () => {
  const [activeKey, setActiveKey] = useState(1)

  const [pendingOrders, setPendingOrders] = useState([
    { id: 'ORD001', customer: 'John Doe', date: '2024-07-28', total: '$150.00', status: 'Pending' },
    { id: 'ORD002', customer: 'Jane Smith', date: '2024-07-28', total: '$200.50', status: 'Pending' },
  ])

  const [inProgressOrders, setInProgressOrders] = useState([
    { id: 'ORD003', customer: 'Peter Jones', date: '2024-07-27', total: '$75.25', status: 'In-Progress' },
  ])

  const [completedOrders, setCompletedOrders] = useState([
    { id: 'ORD004', customer: 'Mary Johnson', date: '2024-07-26', total: '$300.00', status: 'Completed' },
    { id: 'ORD005', customer: 'David Williams', date: '2024-07-25', total: '$50.75', status: 'Completed' },
  ])

  const moveToInProgress = (order) => {
    setPendingOrders(pendingOrders.filter((o) => o.id !== order.id))
    setInProgressOrders([...inProgressOrders, { ...order, status: 'In-Progress' }])
  }

  const moveToCompletedFromPending = (order) => {
    setPendingOrders(pendingOrders.filter((o) => o.id !== order.id))
    setCompletedOrders([...completedOrders, { ...order, status: 'Completed' }])
  }

  const moveToCompletedFromInProgress = (order) => {
    setInProgressOrders(inProgressOrders.filter((o) => o.id !== order.id))
    setCompletedOrders([...completedOrders, { ...order, status: 'Completed' }])
  }

  const renderOrderTable = (orders, status) => (
    <CTable hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Order ID</CTableHeaderCell>
          <CTableHeaderCell>Customer</CTableHeaderCell>
          <CTableHeaderCell>Date</CTableHeaderCell>
          <CTableHeaderCell>Total</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          {(status === 'Pending' || status === 'In-Progress') && <CTableHeaderCell>Actions</CTableHeaderCell>}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {orders.map((order) => (
          <CTableRow key={order.id}>
            <CTableDataCell>{order.id}</CTableDataCell>
            <CTableDataCell>{order.customer}</CTableDataCell>
            <CTableDataCell>{order.date}</CTableDataCell>
            <CTableDataCell>{order.total}</CTableDataCell>
            <CTableDataCell>{order.status}</CTableDataCell>
            {status === 'Pending' && (
              <CTableDataCell>
                <button onClick={() => moveToInProgress(order)} style={{ marginRight: 8 }}>In-Progress</button>
                <button onClick={() => moveToCompletedFromPending(order)}>Completed</button>
              </CTableDataCell>
            )}
            {status === 'In-Progress' && (
              <CTableDataCell>
                <button onClick={() => moveToCompletedFromInProgress(order)}>Completed</button>
              </CTableDataCell>
            )}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Order Management</strong>
          </CCardHeader>
          <CCardBody>
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
                  Pending
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
                  In-Progress
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeKey === 3} onClick={() => setActiveKey(3)}>
                  Completed
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane role="tabpanel" aria-labelledby="pending-tab" visible={activeKey === 1}>
                {renderOrderTable(pendingOrders, 'Pending')}
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="inprogress-tab" visible={activeKey === 2}>
                {renderOrderTable(inProgressOrders, 'In-Progress')}
              </CTabPane>
              <CTabPane role="tabpanel" aria-labelledby="completed-tab" visible={activeKey === 3}>
                {renderOrderTable(completedOrders, 'Completed')}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default OrderList 