import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../signup/AuthContext";
import logo from "../img/logo.png"; // 🔹 Import your logo image

function Navbar() {
  const { theme } = useContext(ThemeContext);
  const { logout, currentUser } = useAuth();

  return (
    <div
      className="w-full h-16 flex items-center justify-between px-4 sm:px-6 shadow-md transition-colors duration-300"
      style={{
        background: theme.navbarBackground || "linear-gradient(to right, #111827, #1E3A8A)",
        color: theme.navbarTextColor || "#E5E7EB",
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={logo} // 🔹 Replace with your imported logo
          alt="Logo"
          className="h-15 w-auto"
        />
      </div>

      {/* Right Section (Profile + Coins + Sign Out) */}
      <div className="flex items-center gap-4">
        {/* User Profile Picture */}
        {currentUser?.profilePicture && (
          <div className="flex items-center gap-2">
            <img
              src={currentUser.profilePicture}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2"
              style={{
                borderColor: theme.navbarCoinsBorder || "rgba(59, 130, 246, 0.5)",
              }}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="hidden sm:block font-medium text-sm">
              {currentUser.name}
            </span>
          </div>
        )}

        {/* Coins Display */}
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-md"
          style={{
            background: theme.navbarCoinsBackground || "rgba(59, 130, 246, 0.2)",
            color: theme.navbarTextColor || "#E5E7EB",
            border: `1px solid ${theme.navbarCoinsBorder || "rgba(59, 130, 246, 0.5)"}`,
          }}
        >
          <span className="text-yellow-400 text-lg">🪙</span>
          <span className="font-semibold text-sm sm:text-base">
            {currentUser?.coins !== undefined ? Number(currentUser.coins).toLocaleString() : '0'}
          </span>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => logout()}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md text-sm sm:text-base transition duration-300"
          style={{
            background: theme.navbarSignOutBackground || "#EF4444",
            color: theme.navbarSignOutText || "#FFFFFF",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Navbar;
