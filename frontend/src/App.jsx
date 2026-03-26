import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'


function App() {

  return (
   <>
     <div className='w-full flex h-screen overflow-hidden'>
        <div className='w-64 h-full bg-gray-200 flex-shrink-0'>
          <Sidebar />
        </div>
        <div className='flex-1 h-full overflow-y-auto flex flex-col'>
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default App
