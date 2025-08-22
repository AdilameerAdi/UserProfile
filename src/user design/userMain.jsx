import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { FaHome, FaDownload, FaHeadset, FaUser, FaStore, FaDiscord, FaBook } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext"; // your theme context

export default function Sidebar() {
  const { theme } = useContext(ThemeContext); // get colors/fonts
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
      {/* Mobile Navbar */}
      <div
        className="md:hidden w-full backdrop-blur-md flex items-center gap-2 px-2 py-3 overflow-x-auto shadow-lg relative z-[999] border-b"
        style={{ backgroundColor: theme.bgColor, borderColor: theme.borderColor }}
      >
        <div
          className="text-transparent uppercase text-xl font-extrabold tracking-wide drop-shadow-md"
          style={{ background: theme.gradientText, fontFamily: theme.fontFamily }}
        >
          Dionisy
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "shadow-md"
                    : "hover:opacity-80"
                } group`
              }
              style={{
                backgroundColor: isActive ? theme.activeBg : "transparent",
                color: isActive ? theme.activeText : theme.textColor,
              }}
            >
              {link.icon}
              <span
                className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: theme.tooltipBg, color: theme.tooltipText }}
              >
                {link.name}
              </span>
            </NavLink>
          ))}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsStoreOpen(false);
              }}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:opacity-80 transition duration-300 group"
              style={{ color: theme.textColor }}
            >
              <FaUser />
              <span
                className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: theme.tooltipBg, color: theme.tooltipText }}
              >
                Profile
              </span>
            </button>
            {isProfileOpen && (
              <div
                className="absolute top-full mt-2 left-0 rounded-lg shadow-lg w-48 border flex flex-col gap-1 p-2"
                style={{ backgroundColor: theme.dropdownBg, borderColor: theme.borderColor }}
              >
                {profileLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm border-l-4 transition-all duration-300`
                    }
                    style={{
                      color: isActive ? theme.activeText : theme.textColor,
                      backgroundColor: isActive ? theme.activeBg : "transparent",
                      borderColor: isActive ? theme.activeBorder : "transparent",
                    }}
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
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:opacity-80 transition duration-300 group"
              style={{ color: theme.textColor }}
            >
              <FaStore />
              <span
                className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: theme.tooltipBg, color: theme.tooltipText }}
              >
                Store
              </span>
            </button>
            {isStoreOpen && (
              <div
                className="absolute top-full mt-2 left-0 rounded-lg shadow-lg w-48 border flex flex-col gap-1 p-2"
                style={{ backgroundColor: theme.dropdownBg, borderColor: theme.borderColor }}
              >
                {storeLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) => `block px-4 py-2 text-sm border-l-4 transition-all duration-300`}
                    style={{
                      color: isActive ? theme.activeText : theme.textColor,
                      backgroundColor: isActive ? theme.activeBg : "transparent",
                      borderColor: isActive ? theme.activeBorder : "transparent",
                    }}
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
              className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:opacity-80 transition duration-300 group"
              style={{ color: theme.textColor }}
            >
              {link.icon}
              <span
                className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: theme.tooltipBg, color: theme.tooltipText }}
              >
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      {/* ... repeat same logic as mobile but vertical orientation ... */}
    </>
  );
}
