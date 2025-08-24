import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
  const { theme, switchTheme, currentThemeName } = useContext(ThemeContext);

  const [activeTab, setActiveTab] = useState("account");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);

  const [connections, setConnections] = useState({
    discord: false,
    steam: false,
    google: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("appThemeName_v1");
      if (saved) switchTheme(saved);
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("appThemeName_v1", currentThemeName);
    } catch (_) {}
  }, [currentThemeName]);

  const toggleConnection = (platform) => {
    setConnections((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const getBg = (color) => theme[color] || color;

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-10 overflow-auto transition-colors duration-300"
      style={{ backgroundColor: getBg("background"), color: getBg("text") }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center sm:text-left">
        Settings
      </h1>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {["account", "appearance", "security", "connections"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="cursor-pointer p-4 sm:p-6 rounded-xl shadow-lg text-center border text-sm sm:text-base transition-all duration-300"
            style={{
              backgroundColor:
                activeTab === tab
                  ? getBg("activeTabBg")
                  : getBg("inactiveTabBg"),
              borderColor:
                activeTab === tab
                  ? getBg("activeTabBorder")
                  : getBg("inactiveTabBorder"),
            }}
          >
            <h3 className="capitalize">{tab}</h3>
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        className="p-6 sm:p-8 rounded-xl shadow-lg transition-colors duration-300"
        style={{ backgroundColor: getBg("cardBg") }}
      >
        {/* Account Tab */}
        {activeTab === "account" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Account Settings
            </h2>
            {/* Current Info */}
            <div className="mb-6">
              <p className="mb-2" style={{ color: getBg("subText") }}>
                Current Email:
              </p>
              <input
                type="text"
                value="user@example.com"
                disabled
                className="w-full px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-300 border"
                style={{
                  backgroundColor: getBg("inputBg"),
                  borderColor: getBg("inputBorder"),
                  color: getBg("inputText"),
                }}
              />
              <p className="mt-4 mb-2" style={{ color: getBg("subText") }}>
                Current Password:
              </p>
              <input
                type="password"
                value="********"
                disabled
                className="w-full px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-300 border"
                style={{
                  backgroundColor: getBg("inputBg"),
                  borderColor: getBg("inputBorder"),
                  color: getBg("inputText"),
                }}
              />
            </div>

            {/* Change Email */}
            <div className="mb-6">
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                style={{ color: getBg("primary") }}
              >
                {showEmailForm ? "Cancel Email Change" : "Change Email?"}
              </button>
              {showEmailForm && (
                <div
                  className="mt-4 p-4 sm:p-6 rounded-lg transition-all duration-300 border"
                  style={{ backgroundColor: getBg("inputBg"), borderColor: getBg("inputBorder") }}
                >
                  <label className="block mb-2" style={{ color: getBg("subText") }}>
                    New Email:
                  </label>
                  <input
                    type="email"
                    placeholder="Enter new email"
                    className="w-full px-4 py-2 mb-4 rounded-lg transition-colors duration-300 border"
                    style={{
                      backgroundColor: getBg("background"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("text"),
                    }}
                  />
                  <button
                    className="w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: getBg("primary"),
                      color: getBg("buttonText"),
                    }}
                  >
                    Update Email
                  </button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                style={{ color: getBg("primary") }}
              >
                {showPasswordForm
                  ? "Cancel Password Change"
                  : "Change Password?"}
              </button>
              {showPasswordForm && (
                <div
                  className="mt-4 p-4 sm:p-6 rounded-lg transition-all duration-300 border"
                  style={{ backgroundColor: getBg("inputBg"), borderColor: getBg("inputBorder") }}
                >
                  <label className="block mb-2" style={{ color: getBg("subText") }}>
                    New Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 mb-4 rounded-lg transition-colors duration-300 border"
                    style={{
                      backgroundColor: getBg("background"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("text"),
                    }}
                  />
                  <label className="block mb-2" style={{ color: getBg("subText") }}>
                    Confirm New Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 mb-4 rounded-lg transition-colors duration-300 border"
                    style={{
                      backgroundColor: getBg("background"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("text"),
                    }}
                  />
                  <button
                    className="w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: getBg("primary"),
                      color: getBg("buttonText"),
                    }}
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Appearance Settings</h2>
            <p style={{ color: getBg("subText") }} className="mb-4">
              Choose a theme for the whole application:
            </p>

            <div className="flex gap-4 flex-wrap">
              {["light", "dark", "purple"].map((t) => (
                <button
                  key={t}
                  onClick={() => switchTheme(t)}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.buttonText,
                    border:
                      currentThemeName === t ? `3px solid ${theme.activeTabBg}` : `1px solid ${theme.borderColor}`,
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Security Settings</h2>
            <p style={{ color: getBg("subText") }}>
              Other security options (2FA, login alerts, etc.) can go here...
            </p>
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === "connections" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Connections</h2>
            {["discord", "steam", "google"].map((platform) => (
              <div key={platform} className="mb-4 flex items-center justify-between">
                <span style={{ color: getBg("subText") }} className="capitalize">
                  {platform}
                </span>
                <button
                  onClick={() => toggleConnection(platform)}
                  className="px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: connections[platform]
                      ? getBg("disconnectButton")
                      : getBg("connectButton"),
                    color: getBg("buttonText"),
                  }}
                >
                  {connections[platform] ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
