import { useState, useContext } from "react";
import { FaUserPlus, FaCoins, FaShoppingCart, FaGift, FaCreditCard, FaCog } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { theme } = useContext(ThemeContext);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const adminButtons = [
    { id: "characters", name: "Add Character", icon: <FaUserPlus />, shortName: "Character" },
    { id: "ocPackages", name: "Add OC Package", icon: <FaCoins />, shortName: "OC Package" },
    { id: "shopItems", name: "Add Shop Item", icon: <FaShoppingCart />, shortName: "Shop Item" },
    { id: "wheelRewards", name: "Add Wheel Reward", icon: <FaGift />, shortName: "Wheel Reward" },
    { id: "paymentVerification", name: "Add Payment Method", icon: <FaCreditCard />, shortName: "Payment" },
    { id: "settings", name: "Settings", icon: <FaCog />, shortName: "Settings" }, // <-- New settings button
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden w-full backdrop-blur-md flex items-center gap-2 px-2 py-3 overflow-x-auto shadow-lg relative z-[999] border-b"
           style={{ backgroundColor: theme.bgColor, borderColor: theme.borderColor }}>
        <div className="bg-clip-text text-transparent uppercase text-xl font-extrabold tracking-wide drop-shadow-md mr-4"
             style={{ background: theme.gradientText, fontFamily: theme.fontFamily }}>
          Admin Panel
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {adminButtons.map((button) => (
            <button key={button.id} onClick={() => {
              if(button.id === "settings") setShowSettings(true);
              else setActiveTab(button.id);
            }}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                      activeTab === button.id ? "shadow-md" : "hover:opacity-80"} group`}
                    style={{
                      backgroundColor: activeTab === button.id ? theme.activeBg : "transparent",
                      color: activeTab === button.id ? theme.activeText : theme.textColor,
                    }}>
              {button.icon}
              <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: theme.tooltipBg, color: theme.tooltipText }}>
                {button.shortName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-16 h-screen sticky top-0 border-r shadow-sm"
           style={{ backgroundColor: theme.bgColor, borderColor: theme.borderColor, color: theme.textColor }}>
        <div className="h-14 flex items-center justify-center">
          <div className="text-transparent text-xl font-extrabold tracking-wide drop-shadow-md"
               style={{ background: theme.gradientText, fontFamily: theme.fontFamily }}>
            A
          </div>
        </div>

        <nav className="flex-1 overflow-visible py-2 flex flex-col items-center gap-2">
          {adminButtons.map((button) => (
            <button key={button.id} onClick={() => {
              if(button.id === "settings") setShowSettings(true);
              else setActiveTab(button.id);
            }}
                    className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      activeTab === button.id ? "shadow-sm" : "hover:opacity-90"}`}
                    style={{
                      backgroundColor: activeTab === button.id ? theme.activeBg : "transparent",
                      color: activeTab === button.id ? theme.activeText : theme.textColor,
                      borderLeft: activeTab === button.id ? `4px solid ${theme.activeBorder}` : undefined,
                    }}>
              <span className="text-lg">{button.icon}</span>
              <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow"
                    style={{ backgroundColor: theme.tooltipBg, color: theme.tooltipText }}>
                {button.name}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Popup */}
      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Settings</h3>
            <input type="text" placeholder="New Username" className="w-full p-2 border rounded"
                   value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="New Password" className="w-full p-2 border rounded"
                   value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button onClick={() => { alert(`Username: ${username}, Password: ${password}`); setShowSettings(false); }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Save
              </button>
              <button onClick={() => setShowSettings(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
