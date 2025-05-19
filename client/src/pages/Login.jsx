import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login } from "../authSlice";

export default function Login() {

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const dispatch = useDispatch()
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  
  useEffect(() => {
    console.log(formData)
  }, [formData]);
  
  const handleSubmit = (e) => {
    e.preventDefault()

    fetch(import.meta.env.VITE_API + 'api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.message)
        })
      }
      return res.json()
    })
    .then((data) => {
      console.log('login successful: ', data)
      dispatch(login(data))
      toast.success("Login successful! 🎉")
      localStorage.setItem('auth', JSON.stringify({
          identifier: data.identifier,
          token: data.token,
          role: data.role,
          isAuthenticated: true
      }))
    })
    .catch((err) => {
      console.log(err)
      toast.error(`${err}`)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-50 shadow-2xl rounded-2xl max-w-md w-full p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500">Login to your account</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
              placeholder="username or email"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#e93c3d] hover:bg-[#d13435] cursor-pointer text-white font-semibold rounded-lg transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to='/signup' className="text-[#e93c3d] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
