import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../signup/AuthContext";
import { supabase } from "../supabaseClient";
import ProfilePictureSelector from "../signup/ProfilePictureSelector";
import dark from "../img/dark.png"
import light from "../img/light.png"
import purple from "../img/purple.png"
export default function Settings() {
  const { theme, switchTheme, currentThemeName } = useContext(ThemeContext);
  const { currentUser: authUser, updateEmail, updatePassword, updateProfileName, updateProfilePicture } = useAuth();
  const [currentUser, setCurrentUser] = useState(authUser || null);

  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [savedRecoveryEmail, setSavedRecoveryEmail] = useState("");
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

  // Profile picture states
  const [selectedProfilePicture, setSelectedProfilePicture] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [showProfilePictureForm, setShowProfilePictureForm] = useState(false);
  const [profilePictureMsg, setProfilePictureMsg] = useState("");
  const [profilePictureErr, setProfilePictureErr] = useState("");

  // Username states  
  const [newUsername, setNewUsername] = useState("");
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [usernameErr, setUsernameErr] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("appThemeName_v1");
      if (saved) switchTheme(saved);
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("appThemeName_v1", currentThemeName);
    } catch {
      // Silent fail
    }
  }, [currentThemeName]);

  // Fetch recovery email when component mounts or user changes
  useEffect(() => {
    if (authUser?.id) {
      setCurrentUser(authUser);
      setSelectedProfilePicture(authUser.profilePicture || "");
      fetchRecoveryEmail();
    }
  }, [authUser]);

  const fetchRecoveryEmail = async () => {
    if (!authUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("recovery_email")
        .eq("id", authUser.id)
        .single();
      
      if (!error && data?.recovery_email) {
        setSavedRecoveryEmail(data.recovery_email);
        setRecoveryEmail(data.recovery_email);
      }
    } catch {
      // Silent fail - recovery email is optional
    }
  };

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

  const handleProfilePictureSelect = (pictureUrl) => {
    setSelectedProfilePicture(pictureUrl);
    setProfilePictureFile(null); // Clear file if URL is selected
  };

  const handleCustomProfilePictureUpload = (file, dataUrl) => {
    setSelectedProfilePicture(dataUrl);
    setProfilePictureFile(file);
  };

  const submitProfilePictureChange = async () => {
    setProfilePictureMsg("");
    setProfilePictureErr("");
    
    if (!selectedProfilePicture) {
      setProfilePictureErr("Please select a profile picture");
      return;
    }

    try {
      const res = await updateProfilePicture(selectedProfilePicture, profilePictureFile);
      if (!res.ok) {
        setProfilePictureErr(res.error || "Failed to update profile picture");
        return;
      }
      setProfilePictureMsg("Profile picture updated successfully");
      setShowProfilePictureForm(false);
    } catch {
      setProfilePictureErr("Failed to update profile picture");
    }
  };

  const submitUsernameChange = async () => {
    setUsernameMsg("");
    setUsernameErr("");
    
    if (!newUsername || newUsername.trim().length < 2) {
      setUsernameErr("Username must be at least 2 characters");
      return;
    }

    const res = await updateProfileName(newUsername.trim());
    if (!res.ok) {
      setUsernameErr(res.error || "Failed to update username");
      return;
    }
    setUsernameMsg("Username updated successfully");
    setShowUsernameForm(false);
    setNewUsername("");
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

            {/* Profile Picture Section */}
            <div className="mb-6">
              <p className="mb-2" style={{ color: getBg("subText") }}>
                Current Profile Picture:
              </p>
              <div className="flex items-center gap-4 mb-4">
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="Current profile"
                    className="w-16 h-16 rounded-full object-cover border-2"
                    style={{ borderColor: getBg("inputBorder") }}
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: getBg("inputBorder"), backgroundColor: getBg("inputBg") }}
                  >
                    <span className="text-2xl">👤</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowProfilePictureForm(true);
                    setProfilePictureMsg("");
                    setProfilePictureErr("");
                  }}
                  className="px-4 py-2 rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: getBg("primary"),
                    color: getBg("buttonText"),
                  }}
                >
                  Change Picture
                </button>
              </div>

              {showProfilePictureForm && (
                <div className="p-4 rounded-lg border mb-4" style={{ backgroundColor: getBg("inputBg"), borderColor: getBg("inputBorder") }}>
                  <ProfilePictureSelector
                    selectedPicture={selectedProfilePicture}
                    onPictureSelect={handleProfilePictureSelect}
                    onCustomUpload={handleCustomProfilePictureUpload}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={submitProfilePictureChange}
                      className="px-4 py-2 rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: getBg("primary"),
                        color: getBg("buttonText"),
                      }}
                    >
                      Update Picture
                    </button>
                    <button
                      onClick={() => {
                        setShowProfilePictureForm(false);
                        setSelectedProfilePicture(currentUser?.profilePicture || "");
                        setProfilePictureFile(null);
                      }}
                      className="px-4 py-2 rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: getBg("secondary"),
                        color: getBg("textColor"),
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {profilePictureMsg && (
                <p className="text-green-500 text-sm mb-2">{profilePictureMsg}</p>
              )}
              {profilePictureErr && (
                <p className="text-red-500 text-sm mb-2">{profilePictureErr}</p>
              )}
            </div>

            {/* Username Section */}
            <div className="mb-6">
              <p className="mb-2" style={{ color: getBg("subText") }}>
                Current Username:
              </p>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={currentUser?.name || ""}
                  disabled
                  className="flex-1 px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-300 border"
                  style={{
                    backgroundColor: getBg("inputBg"),
                    borderColor: getBg("inputBorder"),
                    color: getBg("inputText"),
                  }}
                />
                <button
                  onClick={() => {
                    setShowUsernameForm(true);
                    setNewUsername(currentUser?.name || "");
                    setUsernameMsg("");
                    setUsernameErr("");
                  }}
                  className="px-4 py-2 rounded-lg transition-colors duration-300"
                  style={{
                    backgroundColor: getBg("primary"),
                    color: getBg("buttonText"),
                  }}
                >
                  Change Username
                </button>
              </div>

              {showUsernameForm && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter new username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-300 border mb-2"
                    style={{
                      backgroundColor: getBg("inputBg"),
                      borderColor: getBg("inputBorder"),
                      color: getBg("inputText"),
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitUsernameChange}
                      className="px-4 py-2 rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: getBg("primary"),
                        color: getBg("buttonText"),
                      }}
                    >
                      Update Username
                    </button>
                    <button
                      onClick={() => {
                        setShowUsernameForm(false);
                        setNewUsername("");
                      }}
                      className="px-4 py-2 rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: getBg("secondary"),
                        color: getBg("textColor"),
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {usernameMsg && (
                <p className="text-green-500 text-sm mb-2">{usernameMsg}</p>
              )}
              {usernameErr && (
                <p className="text-red-500 text-sm mb-2">{usernameErr}</p>
              )}
            </div>

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
  <div
    className="p-6 rounded-xl shadow-lg transition-colors duration-300"
    style={{
      backgroundImage:
        currentThemeName === "dark"
          ? `url(${dark})`
          : currentThemeName === "light"
          ? `url(${light})`
          : currentThemeName === "purple"
          ? `url(${purple})`
          : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "500px", // ⬅️ makes it 3x taller (adjust as needed)
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start", // keeps text/buttons at top
    }}
  >
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
              Add a recovery email to login with either your primary or recovery email address:
            </p>

            <div
              className="p-4 sm:p-6 rounded-lg transition-all duration-300 border max-w-md"
              style={{
                backgroundColor: getBg("inputBg"),
                borderColor: getBg("inputBorder"),
              }}
            >
              {savedRecoveryEmail && (
                <div className="mb-4">
                  <p className="text-green-600 font-semibold mb-2">
                    Recovery email saved
                  </p>
                  <p className="text-sm" style={{ color: getBg("subText") }}>
                    You can now login with either your primary email or recovery email.
                  </p>
                </div>
              )}

              <label className="block mb-2" style={{ color: getBg("subText") }}>
                {savedRecoveryEmail && !showRecoveryForm
                  ? "Current Recovery Email:"
                  : "Recovery Email:"}
              </label>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="email"
                  placeholder="Enter recovery email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  disabled={savedRecoveryEmail && !showRecoveryForm}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors duration-300 border"
                  style={{
                    backgroundColor: getBg("background"),
                    borderColor: getBg("inputBorder"),
                    color: getBg("text"),
                  }}
                />
                {savedRecoveryEmail && !showRecoveryForm && (
                  <button
                    onClick={() => {
                      setShowRecoveryForm(true);
                      setRecovErr("");
                      setRecovMsg("");
                    }}
                    className="px-4 py-2 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: getBg("primary"),
                      color: getBg("buttonText"),
                    }}
                  >
                    Change
                  </button>
                )}
              </div>

              {recovErr && (
                <p className="text-red-500 text-sm mb-2">{recovErr}</p>
              )}
              {recovMsg && (
                <p className="text-green-500 text-sm mb-2">{recovMsg}</p>
              )}

              {(!savedRecoveryEmail || showRecoveryForm) && (
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      setRecovErr("");
                      setRecovMsg("");
                      
                      if (!recoveryEmail) {
                        setRecovErr("Please enter a recovery email");
                        return;
                      }
                      
                      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
                        setRecovErr("Please enter a valid email address");
                        return;
                      }
                      
                      // Check if recovery email is same as primary email
                      if (recoveryEmail === authUser?.email) {
                        setRecovErr("Recovery email must be different from your primary email");
                        return;
                      }

                      try {
                        const { data, error } = await supabase
                          .from("profiles")
                          .update({ recovery_email: recoveryEmail })
                          .eq("id", authUser.id)
                          .select("recovery_email")
                          .single();

                        if (error) {
                          if (error.code === '23505') {
                            setRecovErr("This email is already used as a recovery email");
                          } else {
                            setRecovErr("Failed to save recovery email. Please try again.");
                          }
                        } else {
                          setRecovMsg("Recovery email saved successfully!");
                          setSavedRecoveryEmail(data.recovery_email);
                          setShowRecoveryForm(false);
                        }
                      } catch {
                        setRecovErr("An error occurred. Please try again.");
                      }
                    }}
                    className="px-4 py-2 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: getBg("primary"),
                      color: getBg("buttonText"),
                    }}
                  >
                    {savedRecoveryEmail ? "Update" : "Save"} Recovery Email
                  </button>
                  {showRecoveryForm && (
                    <button
                      onClick={() => {
                        setShowRecoveryForm(false);
                        setRecoveryEmail(savedRecoveryEmail);
                        setRecovErr("");
                        setRecovMsg("");
                      }}
                      className="px-4 py-2 rounded-lg transition-colors duration-300 border"
                      style={{
                        borderColor: getBg("inputBorder"),
                        color: getBg("text"),
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
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