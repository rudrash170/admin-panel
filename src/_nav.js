import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPuzzle, cilList, cilChartPie, cilCloudUpload, cilPlus } from '@coreui/icons'
import { CNavItem, CNavGroup } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Product Management',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Product List',
        to: '/product-management/list',
      },
      {
        component: CNavItem,
        name: 'Add Product',
        to: '/product-management/add',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'CSV Bulk Upload',
        to: '/product-management/csv-upload',
        icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Order Management',
    to: '/order-management',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Payment Statistics',
    to: '/payment-statistics',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
]

export default _nav
