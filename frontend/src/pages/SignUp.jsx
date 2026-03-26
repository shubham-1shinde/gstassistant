import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User } from "lucide-react";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    //console.log("hi",data);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/users/register`, data);
      if (response) {
        console.log(response.data);
        navigate('/sign-in');
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex items-center justify-center bg-white">

        <div className="w-full max-w-md p-8">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 text-white p-2 rounded-lg">📊</div>
            <div>
              <h2 className="font-semibold text-lg">GST Assistant</h2>
              <p className="text-gray-500 text-sm">Compliance Made Easy</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-500 mb-6">
            Get started with GST compliance today
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <User className="w-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full p-2 outline-none"
                  {...register('fullName', { required: 'Name is required' })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <Mail className="w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
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
                  name="password"
                  className="w-full p-2 outline-none"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
            </div>

            

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create account →
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-blue-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex items-center justify-center p-10">

        <div className="max-w-md">

          <h2 className="text-4xl font-bold mb-4">
            Join Thousands of Businesses
          </h2>

          <p className="text-blue-100">
            Streamline your GST compliance workflow and focus on growing your business.
          </p>

        </div>

      </div>

    </div>
  );
}