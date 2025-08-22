import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import logo from "../img/logo.png"; // 🔹 Import your logo image

function Navbar() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

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

      {/* Right Section (Coins + Sign Out) */}
      <div className="flex items-center gap-4">
        {/* Coins + Add */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-inner"
          style={{ background: theme.navbarCoinBackground || "#1F2937" }}
        >
          <span
            className="font-semibold text-sm sm:text-base"
            style={{ color: theme.navbarCoinText || "#60A5FA" }}
          >
            00
          </span>
          <button
            onClick={() => navigate("/store/purchase-oc")}
            className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: theme.navbarCoinButtonBackground || "#3B82F6",
              color: theme.navbarCoinButtonText || "#FFFFFF",
            }}
          >
            +
          </button>
        </div>

        {/* Sign Out */}
        <button
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
