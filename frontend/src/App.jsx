import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {login, logout} from "./store/authSlice"
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import axios from "axios";
import Loading from './components/Loading.jsx'
import { useSwipeable } from "react-swipeable";

function App() {

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setSidebarOpen(false),  // swipe left closes
    trackTouch: true,
  });

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
  <div className="w-full min-h-screen flex overflow-hidden">

    {/* Sidebar */}
    <div
      className={`
        fixed md:static z-50 h-screen bg-gray-200 w-64
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      {...swipeHandlers}   // 👈 swipe enabled
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>

    {/* Overlay */}
    {sidebarOpen && (
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
      />
    )}

    {/* Main */}
    <div className="flex-1 min-w-0 h-screen flex flex-col">

      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 min-w-0 overflow-auto ">
        <Outlet />
      </div>

    </div>

  </div>
</>
  ) : (<Loading/>)
}

export default App
