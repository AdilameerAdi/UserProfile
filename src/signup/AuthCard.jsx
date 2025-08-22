import { useState } from "react";
export default function AuthCard({ onSubmit }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 w-full max-w-4xl rounded-xl shadow-lg overflow-hidden flex transition-all duration-500">
        {/* Left side text */}
        <div className={`w-1/2 p-8 flex flex-col justify-center items-start transition-all duration-500 ${isLogin ? "order-1" : "order-2"}`}>
          <h2 className="text-3xl font-bold text-white mb-4">
            {isLogin ? "Welcome Back to the Game of Dionisy!" : "Welcome to the Most Apprecious Game!"}
          </h2>
          <p className="text-gray-300 mb-6">
            {isLogin ? "Enter your credentials to continue your adventure." : "Sign up to join the ultimate gaming experience."}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline font-semibold"
          >
            {isLogin ? "New here? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        {/* Right side form */}
        <div className={`w-1/2 p-8 flex flex-col justify-center transition-all duration-500 ${isLogin ? "order-2" : "order-1"}`}>
          {isLogin ? (
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              <input type="text" name="username" placeholder="Username" className="p-3 rounded bg-gray-700 text-white focus:outline-none" />
              <input type="password" name="password" placeholder="Password" className="p-3 rounded bg-gray-700 text-white focus:outline-none" />
              <button type="submit" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition">Sign In</button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              <input type="text" placeholder="Full Name" className="p-3 rounded bg-gray-700 text-white focus:outline-none" />
              <input type="email" placeholder="Email" className="p-3 rounded bg-gray-700 text-white focus:outline-none" />
              <input type="password" placeholder="Password" className="p-3 rounded bg-gray-700 text-white focus:outline-none" />
              <input type="password" placeholder="Confirm Password" className="p-3 rounded bg-gray-700 text-white focus:outline-none" />
              <button type="submit" className="bg-green-500 text-white p-3 rounded hover:bg-green-600 transition">Sign Up</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
