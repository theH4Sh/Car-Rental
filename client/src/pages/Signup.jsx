import { useState} from 'react';
import { Link } from "react-router-dom";

export default function Signup() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(import.meta.env.VITE_API + 'api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then((res) => {
      console.log('signup successful: ', res);
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-slate-50 shadow-2xl rounded-2xl max-w-md w-full p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500">Join us and get started!</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
              placeholder="User_123"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
              placeholder="you@example.com"
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
            className="w-full py-2 px-4 text-white font-semibold 
            rounded-lg transition duration-200 bg-[#e93c3d] hover:bg-[#d13435]"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#e93c3d] hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
