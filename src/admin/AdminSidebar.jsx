import { useState, useContext, useEffect } from "react";
import { FaUserPlus, FaCoins, FaShoppingCart, FaGift, FaCreditCard, FaCog } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { theme } = useContext(ThemeContext);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Load current admin credentials
  useEffect(() => {
    const savedCredentials = localStorage.getItem('adminCredentials');
    if (savedCredentials) {
      const { username: savedUsername } = JSON.parse(savedCredentials);
      setUsername(savedUsername);
    } else {
      // Default credentials
      setUsername("Adil");
    }
  }, []);

  const handleSaveSettings = async () => {
    // Validate inputs
    if (!username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    if (!currentPassword.trim()) {
      alert("Please enter your current password");
      return;
    }

    if (password !== confirmPassword) {
      alert("New password and confirm password don't match");
      return;
    }

    if (password && password.length < 3) {
      alert("Password must be at least 3 characters long");
      return;
    }

    // Verify current password
    const savedCredentials = localStorage.getItem('adminCredentials');
    const currentCreds = savedCredentials 
      ? JSON.parse(savedCredentials) 
      : { username: "Adil", password: "Adil" };

    if (currentPassword !== currentCreds.password) {
      alert("Current password is incorrect");
      return;
    }

    setSaving(true);

    try {
      // Save new credentials
      const newCredentials = {
        username: username.trim(),
        password: password || currentCreds.password // Keep old password if new one not provided
      };

      localStorage.setItem('adminCredentials', JSON.stringify(newCredentials));

      alert("Settings saved successfully! Please log in again with your new credentials.");
      
      // Reset form
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setShowSettings(false);

      // Optionally log out the user to force re-login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (error) {
      alert("Failed to save settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

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
              if(button.id === "settings") {
                // Reset form when opening settings
                setCurrentPassword("");
                setPassword("");
                setConfirmPassword("");
                setShowSettings(true);
              } else {
                setActiveTab(button.id);
              }
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
              if(button.id === "settings") {
                // Reset form when opening settings
                setCurrentPassword("");
                setPassword("");
                setConfirmPassword("");
                setShowSettings(true);
              } else {
                setActiveTab(button.id);
              }
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
          <div className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Admin Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input 
                  type="text" 
                  placeholder="Enter new username" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  placeholder="Enter current password" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password <span className="text-gray-500">(leave empty to keep current)</span>
                </label>
                <input 
                  type="password" 
                  placeholder="Enter new password" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className={`px-6 py-2 rounded-lg font-medium text-white ${
                  saving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
