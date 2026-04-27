import './index.css'
import React from 'react'
import { Provider } from 'react-redux'
import store, { persistor } from './store/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

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

const router = createBrowserRouter([

  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Dashboard />
        ),
      },
      {
        path: "/invoices",
        element: (
          <SalesInvoices />
        ),
      },
      {
        path: "/purchases",
        element: (
          <PurchaseBills />
        ),
      },
      {
        path: "/itc-tracker",
        element: (
          <ITCtracker />
        ),
      },
      {
        path: "/gst-summary",
        element: (
          <GSTSummary />
        ),
      },
      {
        path: "/compliance",
        element: (
          <ComplienceCalender />
        ),
      },
      {
        path: "/select-business",
        element: (
          <SelectBusiness />
        ),
      },
      {
        path: "/contact-accountant",
        element: (
          <ContactAccountant />
        ),
      },
      {
        path: "/taxbot",
        element: (
          <TaxBot />
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
