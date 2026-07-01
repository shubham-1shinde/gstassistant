import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {

        if(authentication && authStatus !== authentication){
            navigate("/sign-in")
        } else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ?  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="flex flex-col items-center gap-5">

            {/* Spinner */}
            <div className="relative w-16 h-16">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent animate-spin"></div>
            {/* Inner glow dot */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
            </div>
            </div>

            {/* Brand */}
            <div className="text-center">
            <p className="text-base font-bold text-blue-900">GST Assistant</p>
            <p className="text-xs text-gray-400 mt-0.5">Loading, please wait...</p>
            </div>

        </div>
        </div> : <>{children}</>
}
 