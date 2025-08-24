import { useState } from "react";
import loginback from "../img/loginback.png";
import logo from "../img/logo.png";

export default function AuthCard({
  onSubmit,
  onSignup,
  email,
  password,
  setEmail,
  setPassword,
  error,
  isAdmin,
  setIsAdmin,
  signupName,
  setSignupName,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  confirmPassword,
  setConfirmPassword,
  signupError,
}) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${loginback})`,
      }}
    >
      <div className="bg-[#1E2939] bg-opacity-80 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
      <div className="w-[150px] h-[100px] mb-6 flex items-center justify-center bg-gray-800 shadow-lg overflow-hidden">
  <img
    src={logo}
    alt="Logo"
    className="w-full h-full object-cover "
  />
</div>

        {isLogin ? (
          <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder={isAdmin ? "Admin name" : "Email or Username"}
              className="p-3 rounded-lg bg-[#364153] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Hide Forgot Password, Signup Links, and Google login when Admin mode is enabled */}
            {!isAdmin && (
              <>
                {/* Forgot password */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-blue-400 text-sm hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              {isAdmin ? "Admin Sign In" : "Sign In"}
            </button>

            {!isAdmin && (
              <>
                {/* Switch to signup */}
                <p className="text-gray-400 text-sm text-center mt-2">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-blue-400 hover:underline"
                  >
                    Create one
                  </button>
                </p>

                {/* Google login */}
                <button
                  type="button"
                  className="mt-4 flex items-center justify-center gap-2 bg-white text-gray-800 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Continue with Google
                </button>
              </>
            )}

            {/* Admin toggle button */}
            <button
              type="button"
              onClick={() => setIsAdmin?.(!isAdmin)}
              className={`mt-4 w-full py-2 rounded-lg font-semibold text-lg transition duration-300 shadow-md ${
                isAdmin
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {isAdmin ? "Admin Mode Enabled" : "Login as Admin"}
            </button>
          </form>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={onSignup}>
            <input
              type="text"
              placeholder="Full Name"
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              value={signupName}
              onChange={(e) => setSignupName?.(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              value={signupEmail}
              onChange={(e) => setSignupEmail?.(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              value={signupPassword}
              onChange={(e) => setSignupPassword?.(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword?.(e.target.value)}
              required
            />
            {signupError && (
              <p className="text-red-500 text-sm">{signupError}</p>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md"
            >
              Sign Up
            </button>

            <p className="text-gray-400 text-sm text-center mt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-green-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
