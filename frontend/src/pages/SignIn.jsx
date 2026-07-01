import { Mail, Lock } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { login } from '../store/authSlice';

export default function SignIn() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (authStatus) {
    navigate('/select-business');
    return null;
  }
  const [loginDone, setLoginDone] = useState(false);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/users/login`, data);
      setLoginDone(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loginDone) return;

    const controller = new AbortController();

    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/users/current-user`, {
          signal: controller.signal,
        });

        const userData = data?.data;
        if (userData) {
          const accessToken = localStorage.getItem('accessToken') || userData.accessToken;
          dispatch(login({ userData, accessToken }));
          localStorage.setItem('status', 'true');
          localStorage.setItem('accessToken', accessToken);
          navigate('/select-business');
        } else {
          dispatch(logout());
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
      }
    };

    fetchCurrentUser();
    return () => controller.abort();
  }, [loginDone, dispatch, navigate]);

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex items-center justify-center bg-white">

        <div className="w-full max-w-md p-8">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              📊
            </div>
            <div>
              <h2 className="font-semibold text-lg">GST Assistant</h2>
              <p className="text-gray-500 text-sm">Compliance Made Easy</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <Mail className="w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full p-2 outline-none"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <Lock className="w-4 text-gray-400" />
                <input
                  type="password"
                  className="w-full p-2 outline-none"
                  {...register('password', { required: '{Password} is required' })}
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Sign in →
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <span className="text-blue-600 cursor-pointer">
              <Link
                to="/sign-up"
                className="text-pink-300 hover:text-white font-medium transition"
              >
                Sign Up
              </Link>
            </span>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex items-center justify-center p-10">

        <div className="max-w-md">

          <h2 className="text-4xl font-bold mb-4">
            Simplify Your GST Compliance
          </h2>

          <p className="text-blue-100 mb-8">
            Track invoices, manage ITC, and stay compliant with India's GST regulations – all in one place.
          </p>

          <div className="flex gap-4">

            <div className="bg-white/20 backdrop-blur p-4 rounded-lg">
              <h3 className="text-xl font-bold">100%</h3>
              <p className="text-sm">Compliant</p>
            </div>

            <div className="bg-white/20 backdrop-blur p-4 rounded-lg">
              <h3 className="text-xl font-bold">24/7</h3>
              <p className="text-sm">Support</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}