import { useState } from "react";
import logo from "../img/logo.png"; // Your logo image

export default function AuthCard({ onSubmit, email, password, setEmail, setPassword, error, isAdmin, setIsAdmin }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="bg-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 border border-gray-700">
        
        {/* Left Section (Logo + Intro) */}
        <div
          className={`w-full md:w-1/2 flex flex-col justify-center items-center text-center p-10 transition-all duration-500 ${
            isLogin ? "order-1" : "order-2"
          }`}
        >
          {/* Game Logo */}
          <div className="w-32 h-32 mb-6 flex items-center justify-center bg-gray-800 rounded-full shadow-lg overflow-hidden">
            <img
              src={logo}
              alt="Game Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            {isLogin ? "Welcome Back to Dionisy!" : "Join the Game of Dionisy!"}
          </h2>
          <p className="text-gray-400 mb-6 text-lg max-w-md">
            {isLogin
              ? "Sign in and continue your epic journey in the world of Dionisy."
              : "Create your account and become a legend in the ultimate gaming experience."}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline font-semibold text-lg"
          >
            {isLogin
              ? "New player? Create an Account"
              : "Already have an account? Sign In"}
          </button>
        </div>

        {/* Right Section (Form) */}
        <div
          className={`w-full md:w-1/2 bg-gray-800 p-10 flex flex-col justify-center transition-all duration-500 ${
            isLogin ? "order-2" : "order-1"
          }`}
        >
          {isLogin ? (
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
              <div className="flex items-center gap-2">
                <input
                  id="adminToggle"
                  type="checkbox"
                  checked={!!isAdmin}
                  onChange={(e) => setIsAdmin?.(e.target.checked)}
                />
                <label htmlFor="adminToggle" className="text-gray-300 text-sm">Login as admin</label>
              </div>
              <input
                type="text"
                placeholder={isAdmin ? "Admin name" : "Email Address"}
                className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
