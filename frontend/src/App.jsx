import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {login, logout} from "./store/authSlice"
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import axios from "axios";
import Loading from './components/Loading.jsx'


function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  console.log("hi");

  useEffect( () => {
    let isMounted = true;   
    const fun = async () => {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/users/current-user`)
      .then((response) => {
        const userData = response.data.data
        if (userData) {
            dispatch(login({userData}));
        } else {
            dispatch(logout());
        }
      })
      .finally(() => setLoading(false))}

    fun();

    return () => {
      isMounted = false;                     
    };
    
  }, [])
  

  return !loading ? (
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
  ) : (<Loading/>)
}

export default App
