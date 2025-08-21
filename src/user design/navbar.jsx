import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png"; // 🔹 Import your logo image
function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-16 bg-gradient-to-r from-gray-900 to-blue-900 text-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={logo}// 🔹 Replace with your imported logo
          alt="Logo"
          className="h-15 w-auto"
        />
      </div>

      {/* Right Section (Coins + Sign Out) */}
      <div className="flex items-center gap-4">
        {/* Coins + Add */}
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-inner">
          <span className="font-semibold text-blue-300 text-sm sm:text-base">
            1200
          </span>
          <button
            onClick={() => navigate("/store/purchase-oc")}
            className="bg-blue-500 hover:bg-blue-600 text-white w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-sm font-bold"
          >
            +
          </button>
        </div>

        {/* Sign Out */}
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md transition duration-300 text-sm sm:text-base">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Navbar;
