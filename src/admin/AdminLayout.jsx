import AdminSidebar from "./AdminSidebar";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AdminLayout({ children, activeTab, setActiveTab }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Admin Sidebar for desktop */}
      <div className="hidden md:block">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
        {/* Mobile Navbar (inside AdminSidebar component itself) */}
        <div className="md:hidden sticky top-0 z-50">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Actual page content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}