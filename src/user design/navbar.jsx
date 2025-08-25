import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../signup/AuthContext";
import logo from "../img/logo.png"; // 🔹 Import your logo image

function Navbar() {
  const { theme } = useContext(ThemeContext);
  const { logout } = useAuth();

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

      {/* Right Section (Coins + Admin + Sign Out) */}
      <div className="flex items-center gap-4">
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
