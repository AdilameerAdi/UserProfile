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
              style={({ isActive }) => ({
                backgroundColor: isActive ? theme.activeBg : "transparent",
                color: isActive ? theme.activeText : theme.textColor,
              })}
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
                    style={({ isActive }) => ({
                      color: isActive ? theme.activeText : theme.textColor,
                      backgroundColor: isActive ? theme.activeBg : "transparent",
                      borderColor: isActive ? theme.activeBorder : "transparent",
                    })}
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
                    style={({ isActive }) => ({
                      color: isActive ? theme.activeText : theme.textColor,
                      backgroundColor: isActive ? theme.activeBg : "transparent",
                      borderColor: isActive ? theme.activeBorder : "transparent",
                    })}
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
      <div
        className="hidden md:flex md:flex-col md:w-64 h-screen sticky top-0 border-r shadow-sm"
        style={{ backgroundColor: theme.bgColor, borderColor: theme.borderColor, color: theme.textColor }}
      >
        <div
          className="px-4 py-5 text-transparent uppercase text-2xl font-extrabold tracking-wide drop-shadow-md"
          style={{ background: theme.gradientText, fontFamily: theme.fontFamily }}
        >
          Dionisy
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg border-l-4 transition-all duration-300 ${
                  isActive ? "shadow-sm" : "hover:opacity-90"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? theme.activeText : theme.textColor,
                backgroundColor: isActive ? theme.activeBg : "transparent",
                borderColor: isActive ? theme.activeBorder : "transparent",
              })}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm font-medium">{link.name}</span>
            </NavLink>
          ))}

          {/* Profile Section */}
          <div className="mt-2">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsStoreOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:opacity-90 transition duration-300"
              style={{ color: theme.textColor }}
            >
              <span className="text-sm font-medium flex items-center gap-3">
                <FaUser />
                Profile
              </span>
              <span className="text-xs">{isProfileOpen ? "−" : "+"}</span>
            </button>
            {isProfileOpen && (
              <div className="mt-1 ml-2 flex flex-col gap-1">
                {profileLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md border-l-4 text-sm transition-all duration-300`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? theme.activeText : theme.textColor,
                      backgroundColor: isActive ? theme.activeBg : "transparent",
                      borderColor: isActive ? theme.activeBorder : "transparent",
                    })}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Store Section */}
          <div className="mt-1">
            <button
              onClick={() => {
                setIsStoreOpen(!isStoreOpen);
                setIsProfileOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:opacity-90 transition duration-300"
              style={{ color: theme.textColor }}
            >
              <span className="text-sm font-medium flex items-center gap-3">
                <FaStore />
                Store
              </span>
              <span className="text-xs">{isStoreOpen ? "−" : "+"}</span>
            </button>
            {isStoreOpen && (
              <div className="mt-1 ml-2 flex flex-col gap-1">
                {storeLinks.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md border-l-4 text-sm transition-all duration-300`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? theme.activeText : theme.textColor,
                      backgroundColor: isActive ? theme.activeBg : "transparent",
                      borderColor: isActive ? theme.activeBorder : "transparent",
                    })}
                    onClick={() => setIsStoreOpen(false)}
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer / Extra Links */}
        <div className="px-2 py-3 border-t" style={{ borderColor: theme.borderColor }}>
          <div className="flex items-center gap-2">
            {extraLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:opacity-90 transition duration-300"
                style={{ color: theme.textColor }}
              >
                <span className="text-lg">{link.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
