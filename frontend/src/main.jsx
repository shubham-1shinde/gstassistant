import './index.css'
import React from 'react'
import { Provider } from 'react-redux'
import store, { persistor } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import  AuthLayout from './components/AuthLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import SalesInvoices from './pages/SalesInvoices.jsx';
import PurchaseBills from './pages/PurchaseBills.jsx';
import ITCtracker from './pages/ITCtracker.jsx';
import GSTSummary from './pages/GSTSummary.jsx';
import ComplienceCalender from './pages/ComplienceCalender.jsx';
import SelectBusiness from './pages/SelectBusiness.jsx';
import TaxBot from './pages/TaxBot.jsx';
import ContactAccountant from './pages/ContactAccountant.jsx';
import RegisterAccountant from './pages/RegisterAccountant.jsx';
import ListAccountant from './pages/ListAccountant.jsx';
import ThankYouRegister from './pages/ThankYouRegister.jsx';

const router = createBrowserRouter([

  {
    path: "/sign-in",
    element: (
      <AuthLayout authentication={false}>
        <SignIn />
      </AuthLayout>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <AuthLayout authentication={false}>
        <SignUp />
      </AuthLayout>
    ),
  },
  {
    path: "/register-accountant",
    element: (
      <AuthLayout authentication={false}>
        <RegisterAccountant />
      </AuthLayout>
    ),
  },
  {
    path: "/thank-you",
    element: (
      <AuthLayout authentication={false}>
        <ThankYouRegister />
      </AuthLayout>
    ),
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: "/invoices",
        element: (
          <AuthLayout authentication={true}>
            <SalesInvoices />
          </AuthLayout>
        ),
      },
      {
        path: "/purchases",
        element: (
          <AuthLayout authentication={true}>
            <PurchaseBills />
          </AuthLayout>
        ),
      },
      {
        path: "/itc-tracker",
        element: (
          <AuthLayout authentication={true}>
            <ITCtracker />
          </AuthLayout>
        ),
      },
      {
        path: "/gst-summary",
        element: (
          <AuthLayout authentication={true}>
            <GSTSummary />
          </AuthLayout>   
        ),
      },
      {
        path: "/compliance",
        element: (
          <AuthLayout authentication={true}>
            <ComplienceCalender />
          </AuthLayout> 
        ),
      },
      {
        path: "/select-business",
        element: (
          <AuthLayout authentication={true}>
            <SelectBusiness />
          </AuthLayout>
        ),
      },
      {
        path: "/contact-accountant",
        element: (
          <AuthLayout authentication={true}>
            <ContactAccountant />
          </AuthLayout>
        ),
      },
      {
        path: "/taxbot",
        element: (
          <AuthLayout authentication={true}>
            <TaxBot />
          </AuthLayout>
        ),
      },
      {
        path: "/list-accountants",
        element: (
          <AuthLayout authentication={true}>
            <ListAccountant />
          </AuthLayout>
        ),
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
