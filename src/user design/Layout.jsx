import Sidebar from "./userMain";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#374151] text-gray-100 overflow-auto">
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
