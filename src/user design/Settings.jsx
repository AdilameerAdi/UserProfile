import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../signup/AuthContext";
import { supabase } from "../supabaseClient"; // make sure the path is correct

export default function Settings() {
  const { theme, switchTheme, currentThemeName } = useContext(ThemeContext);
  const { currentUser: authUser, updateEmail, updatePassword } = useAuth();
  const [currentUser, setCurrentUser] = useState(authUser || null);

  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recovErr, setRecovErr] = useState("");
  const [recovMsg, setRecovMsg] = useState("");

  const [activeTab, setActiveTab] = useState("account");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);

  const [connections, setConnections] = useState({
    discord: false,
    steam: false,
    google: false,
  });

  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

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

  const submitEmailChange = async () => {
    setEmailMsg("");
    setEmailErr("");
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailErr("Please enter a valid email address");
      return;
    }
    const res = await updateEmail(newEmail.trim());
    if (!res.ok) {
      setEmailErr(res.error || "Failed to update email");
      return;
    }
    setEmailMsg("Email updated. Check your inbox if confirmation is required.");
    setShowEmailForm(false);
    setNewEmail("");
  };

  const submitPasswordChange = async () => {
    setPassMsg("");
    setPassErr("");
    if (!newPass || newPass.length < 6) {
      setPassErr("Password must be at least 6 characters");
      return;
    }
    if (newPass !== confirmPass) {
      setPassErr("Passwords do not match");
      return;
    }
    const res = await updatePassword(newPass);
    if (!res.ok) {
      setPassErr(res.error || "Failed to update password");
      return;
    }
    setPassMsg("Password updated successfully");
    setShowPasswordForm(false);
    setNewPass("");
    setConfirmPass("");
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
                value={currentUser?.email || ""}
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
                onClick={() => {
                  setShowEmailForm(!showEmailForm);
                  setEmailErr("");
                  setEmailMsg("");
                }}
                style={{ color: getBg("primary") }}
              >
                {showEmailForm ? "Cancel Email Change" : "Change Email?"}
              </button>
              {showEmailForm && (
                <div
                  className="mt-4 p-4 sm:p-6 rounded-lg transition-all duration-300 border"
                  style={{
                    backgroundColor: getBg("inputBg"),
                    borderColor: getBg("inputBorder"),
                  }}
                >
                  <label className="block mb-2" style={{ color: getBg("subText") }}>
                    New Email:
                  </label>
                  <input
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-2 rounded-lg transition-colors duration-300 border"
                    style={{
                      backgroundColor: getBg("background"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("text"),
                    }}
                  />
                  {emailErr && (
                    <p className="text-red-500 text-sm mb-2">{emailErr}</p>
                  )}
                  {emailMsg && (
                    <p className="text-green-500 text-sm mb-2">{emailMsg}</p>
                  )}
                  <button
                    onClick={submitEmailChange}
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
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setPassErr("");
                  setPassMsg("");
                }}
                style={{ color: getBg("primary") }}
              >
                {showPasswordForm
                  ? "Cancel Password Change"
                  : "Change Password?"}
              </button>
              {showPasswordForm && (
                <div
                  className="mt-4 p-4 sm:p-6 rounded-lg transition-all duration-300 border"
                  style={{
                    backgroundColor: getBg("inputBg"),
                    borderColor: getBg("inputBorder"),
                  }}
                >
                  <label className="block mb-2" style={{ color: getBg("subText") }}>
                    New Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
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
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-lg transition-colors duration-300 border"
                    style={{
                      backgroundColor: getBg("background"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("text"),
                    }}
                  />
                  {passErr && (
                    <p className="text-red-500 text-sm mb-2">{passErr}</p>
                  )}
                  {passMsg && (
                    <p className="text-green-500 text-sm mb-2">{passMsg}</p>
                  )}
                  <button
                    onClick={submitPasswordChange}
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Appearance Settings
            </h2>
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
                      currentThemeName === t
                        ? `3px solid ${theme.activeTabBg}`
                        : `1px solid ${theme.borderColor}`,
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Security Settings
            </h2>
            <p style={{ color: getBg("subText") }} className="mb-4">
              For security purposes, you can add a recovery email:
            </p>

            <div
              className="p-4 sm:p-6 rounded-lg transition-all duration-300 border max-w-md"
              style={{
                backgroundColor: getBg("inputBg"),
                borderColor: getBg("inputBorder"),
              }}
            >
              {currentUser?.recovery_email && (
                <p className="mb-4 text-green-600 font-semibold">
                  You have set your recovery email.
                </p>
              )}

              <label className="block mb-2" style={{ color: getBg("subText") }}>
                {currentUser?.recovery_email
                  ? "Recovery Email:"
                  : "Add Recovery Email:"}
              </label>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="email"
                  placeholder="Enter recovery email"
                  value={recoveryEmail || currentUser?.recovery_email || ""}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  disabled={currentUser?.recovery_email && !showRecoveryForm}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors duration-300 border"
                  style={{
                    backgroundColor: getBg("background"),
                    borderColor: getBg("inputBorder"),
                    color: getBg("text"),
                  }}
                />
                {currentUser?.recovery_email && !showRecoveryForm && (
                  <button
                    onClick={() => {
                      setShowRecoveryForm(true);
                      setRecovErr("");
                      setRecovMsg("");
                      setRecoveryEmail(currentUser.recovery_email);
                    }}
                    className="px-4 py-2 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: getBg("primary"),
                      color: getBg("buttonText"),
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {recovErr && (
                <p className="text-red-500 text-sm mb-2">{recovErr}</p>
              )}
              {recovMsg && (
                <p className="text-green-500 text-sm mb-2">{recovMsg}</p>
              )}

              {(!currentUser?.recovery_email || showRecoveryForm) && (
                <button
                  onClick={async () => {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
                      setRecovErr("Please enter a valid email");
                      return;
                    }
                    setRecovErr("");

                    const { data, error } = await supabase
                      .from("profiles")
                      .update({ recovery_email: recoveryEmail })
                      .eq("id", currentUser.id)
                      .select("recovery_email")
                      .single();

                    if (error) {
                      setRecovErr("Failed to save. Try again.");
                    } else {
                      setRecovMsg("Recovery email saved successfully!");
                      setCurrentUser({
                        ...currentUser,
                        recovery_email: data.recovery_email,
                      });
                      setShowRecoveryForm(false);
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: getBg("primary"),
                    color: getBg("buttonText"),
                  }}
                >
                  Save Recovery Email
                </button>
              )}
            </div>
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === "connections" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Connections</h2>
            {["discord", "steam", "google"].map((platform) => (
              <div
                key={platform}
                className="mb-4 flex items-center justify-between"
              >
                <span
                  style={{ color: getBg("subText") }}
                  className="capitalize"
                >
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
