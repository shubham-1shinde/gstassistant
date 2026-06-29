import React from 'react'
import {useDispatch} from 'react-redux'
import {logout} from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux' 
import axios from '../../utils/axios.js';
import { logoutCurrentBusiness } from '../../store/businessSlice.js'

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
    const logoutHandler = async () => {
        await axios.post('/users/logout');
        dispatch(logout());
        dispatch(logoutCurrentBusiness());
        localStorage.removeItem('status');
        localStorage.removeItem('accessToken');
        console.log("logout successfully");
        navigate("/sign-in");
    }
  return (
    <button
    className=''
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default Logout
