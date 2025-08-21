import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaDownload, FaHeadset, FaUser, FaStore, FaDiscord, FaBook } from "react-icons/fa";

export default function Sidebar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const mainLinks = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Download", path: "/download", icon: <FaDownload /> },
    { name: "Support", path: "/support", icon: <FaHeadset /> },
  ];

  const profileLinks = [
    { name: "Characters", path: "/profile/characters" },
    { name: "Coupons", path: "/profile/coupons" },
    { name: "Logs", path: "/profile/logs" },
    { name: "Settings", path: "/profile/settings" },
  ];

  const storeLinks = [
    { name: "Purchase OC", path: "/store/purchase-oc" },
    { name: "Shop", path: "/store/shop" },
    { name: "Fortune Wheel", path: "/store/fortune-wheel" },
  ];

  const extraLinks = [
    { name: "Discord", url: "https://discord.com/invite/yourlink", icon: <FaDiscord /> },
    { name: "Wiki", url: "https://yourwiki.com", icon: <FaBook /> },
  ];

  return (
    <>
      {/* ✅ Mobile Horizontal Navbar */}
      <div className="md:hidden w-full bg-[#0f172a]/95 backdrop-blur-md flex items-center gap-4 px-4 py-3 overflow-x-auto shadow-lg relative z-[999] border-b border-gray-700/40">
        <div className="text-transparent uppercase bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-xl font-extrabold tracking-wide drop-shadow-md">
          Dionisy
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Main Links */}
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800"
                }`
              }
            >
              {link.icon} {link.name}
            </NavLink>
          ))}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsStoreOpen(false);
              }}
              className="flex items-center gap-1 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 text-sm whitespace-nowrap transition duration-300"
            >
              <FaUser /> Profile
              <span
                className={`transition-transform duration-300 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {isProfileOpen && (
              <div className="absolute top-full mt-2 left-0 bg-[#1f2937]/95 backdrop-blur-md rounded-lg shadow-lg z-[999] w-48 border border-gray-700/40">
                {profileLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm border-l-4 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold border-blue-400"
                          : "hover:bg-gray-700 border-transparent"
                      }`
                    }
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Store Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                setIsProfileOpen(false);
              }}
              className="flex items-center gap-1 text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-700 text-sm whitespace-nowrap transition duration-300"
            >
              <FaStore /> Store
              <span
                className={`transition-transform duration-300 ${
                  isStoreOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {isStoreOpen && (
              <div className="absolute top-full mt-2 left-0 bg-[#1f2937]/95 backdrop-blur-md rounded-lg shadow-lg z-[999] w-48 border border-gray-700/40">
                {storeLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm border-l-4 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold border-blue-400"
                          : "hover:bg-gray-700 border-transparent"
                      }`
                    }
                    onClick={() => setIsStoreOpen(false)}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Extra Links */}
          {extraLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-3 py-1.5 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 flex items-center gap-2 text-sm transition duration-300"
            >
              {link.icon} {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 bg-[#0f172a]/95 backdrop-blur-md text-gray-300 flex-col shadow-2xl border-r border-gray-700/40">
        {/* Logo */}
        <div className="text-transparent uppercase bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-2xl font-extrabold p-4 border-b border-gray-700/40 tracking-wide drop-shadow-md">
          Dionisy
        </div>

        <nav className="flex flex-col p-4 gap-2">
          {/* Main Links */}
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-md"
                    : "hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800"
                }`
              }
            >
              {link.icon} {link.name}
            </NavLink>
          ))}

          {/* Profile Dropdown */}
          <div className="mt-4">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsStoreOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              <span className="flex items-center gap-2">
                <FaUser /> Profile
              </span>
              <span
                className={`transition-transform duration-300 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {isProfileOpen && (
              <div className="pl-6 mt-1 flex flex-col gap-1">
                {profileLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-4 py-1 rounded text-sm border-l-4 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold border-blue-400 shadow-md"
                          : "hover:bg-gray-700 border-transparent"
                      }`
                    }
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Store Dropdown */}
          <div className="mt-4">
            <button
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                setIsProfileOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              <span className="flex items-center gap-2">
                <FaStore /> Store
              </span>
              <span
                className={`transition-transform duration-300 ${
                  isStoreOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {isStoreOpen && (
              <div className="pl-6 mt-1 flex flex-col gap-1">
                {storeLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-4 py-1 rounded text-sm border-l-4 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold border-blue-400 shadow-md"
                          : "hover:bg-gray-700 border-transparent"
                      }`
                    }
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Extra Links */}
          <div className="mt-4 border-t border-gray-700/40 pt-4">
            {extraLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition duration-300 flex items-center gap-2"
              >
                {link.icon} {link.name}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
