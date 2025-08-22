import Sidebar from "./userMain";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Layout({ children }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 overflow-auto transition-colors duration-300"
        style={{
          background: theme.backgroundGradient,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        {/* Mobile Navbar (inside Sidebar component itself) */}
        <div className="md:hidden sticky top-0 z-50">
          <Sidebar mobileOnly />
        </div>

        {/* Actual page content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
