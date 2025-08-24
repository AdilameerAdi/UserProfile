import { useState, useContext } from "react";
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
              color:
                activeTab === tab
                  ? getBg("buttonText")
                  : getBg("text"),
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
                className="w-full px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-300"
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
                className="w-full px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-300"
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
                  className="mt-4 p-4 sm:p-6 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: getBg("inputBg") }}
                >
                  <label className="block mb-2" style={{ color: getBg("subText") }}>
                    New Email:
                  </label>
                  <input
                    type="email"
                    placeholder="Enter new email"
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: getBg("inputBg"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("inputText"),
                    }}
                  />
                  <button
                    className="mt-4 px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: getBg("primary"),
                      color: getBg("buttonText"),
                    }}
                  >
                    Save Email
                  </button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="mb-6">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                style={{ color: getBg("primary") }}
              >
                {showPasswordForm ? "Cancel Password Change" : "Change Password?"}
              </button>
              {showPasswordForm && (
                <div
                  className="mt-4 p-4 sm:p-6 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: getBg("inputBg") }}
                >
                  <label className="block mb-2" style={{ color: getBg("subText") }}>
                    New Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: getBg("inputBg"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("inputText"),
                    }}
                  />
                  <button
                    className="mt-4 px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: getBg("primary"),
                      color: getBg("buttonText"),
                    }}
                  >
                    Save Password
                  </button>
                </div>
              )}
            </div>

            {/* Recovery Options */}
            <div className="mb-6">
              <button
                onClick={() => setShowRecoveryForm(!showRecoveryForm)}
                style={{ color: getBg("primary") }}
              >
                {showRecoveryForm ? "Hide Recovery Options" : "Recovery Options"}
              </button>
              {showRecoveryForm && (
                <div
                  className="mt-4 p-4 sm:p-6 rounded-lg transition-all duration-300"
                  style={{ backgroundColor: getBg("inputBg") }}
                >
                  <p style={{ color: getBg("subText") }}>
                    Add recovery methods to secure your account.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Appearance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["light", "dark", "purple"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => switchTheme(mode)}
                  className="p-4 rounded-lg border transition-all duration-300"
                  style={{
                    backgroundColor:
                      currentThemeName === mode
                        ? getBg("activeTabBg")
                        : getBg("inactiveTabBg"),
                    borderColor:
                      currentThemeName === mode
                        ? getBg("activeTabBorder")
                        : getBg("inactiveTabBorder"),
                    color:
                      currentThemeName === mode
                        ? getBg("buttonText")
                        : getBg("text"),
                  }}
                >
                  <span className="capitalize">{mode}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Security & Connections placeholders remain unchanged for brevity */}
        {activeTab === "security" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Security</h2>
            <p style={{ color: getBg("subText") }}>Password, 2FA, and more.</p>
          </div>
        )}

        {activeTab === "connections" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Connections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["discord", "steam", "google"].map((conn) => (
                <button
                  key={conn}
                  onClick={() => toggleConnection(conn)}
                  className="p-4 rounded-lg border transition-all duration-300"
                  style={{
                    backgroundColor: connections[conn]
                      ? getBg("connectButton")
                      : getBg("inactiveTabBg"),
                    borderColor: getBg("inactiveTabBorder"),
                    color: connections[conn] ? getBg("buttonText") : getBg("text"),
                  }}
                >
                  <span className="capitalize">{conn}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
