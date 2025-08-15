import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Product Management
const ProductList = React.lazy(() => import('./views/productManagement/productList/ProductList'))
const ProductAdd = React.lazy(() => import('./views/productManagement/addProduct/AddProduct'))
const ProductEdit = React.lazy(() => import('./views/productManagement/ProductEdit'))

// Order Management
const OrderList = React.lazy(() => import('./views/orderManagement/OrderList'))

// Payment Statistics
const PaymentStatistics = React.lazy(() => import('./views/paymentStatistics/PaymentStatistics'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  {
    path: '/product-management',
    name: 'Product Management',
    element: ProductList,
    exact: true,
  },
  { path: '/product-management/list', name: 'Product List', element: ProductList },
  { path: '/product-management/add', name: 'Add Product', element: ProductAdd },
  { path: '/product-management/edit/:id', name: 'Edit Product', element: ProductEdit },
  {
    path: '/order-management',
    name: 'Order Management',
    element: OrderList,
  },
  {
    path: '/payment-statistics',
    name: 'Payment Statistics',
    element: PaymentStatistics,
  },
]

export default routes
