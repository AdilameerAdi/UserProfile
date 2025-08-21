import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1923] text-white px-4 py-8 sm:px-6 lg:px-10 overflow-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center sm:text-left">
        Settings
      </h1>

      {/* Top Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {["account", "appearance", "security", "connections"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer p-4 sm:p-6 rounded-xl shadow-lg text-center border text-sm sm:text-base transition-all duration-300 ${
              activeTab === tab
                ? "bg-blue-600 border-blue-400"
                : "bg-[#111E2A] border-[#1F2A38] hover:border-blue-400"
            }`}
          >
            <h3 className="capitalize">{tab}</h3>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-[#1a2535] p-6 sm:p-8 rounded-xl shadow-lg">
        {activeTab === "account" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Account Settings
            </h2>

            {/* Current Info */}
            <div className="mb-6">
              <p className="text-gray-400 mb-2">Current Email:</p>
              <input
                type="text"
                value="user@example.com"
                disabled
                className="w-full px-4 py-2 bg-[#111E2A] border border-[#1F2A38] rounded-lg text-gray-400 text-sm sm:text-base"
              />

              <p className="text-gray-400 mt-4 mb-2">Current Password:</p>
              <input
                type="password"
                value="********"
                disabled
                className="w-full px-4 py-2 bg-[#111E2A] border border-[#1F2A38] rounded-lg text-gray-400 text-sm sm:text-base"
              />
            </div>

            {/* Change Email */}
            <div className="mb-6">
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="text-blue-400 hover:text-blue-300 text-sm sm:text-base"
              >
                {showEmailForm ? "Cancel Email Change" : "Change Email?"}
              </button>

              {showEmailForm && (
                <div className="mt-4 bg-[#111E2A] p-4 sm:p-6 rounded-lg transition-all duration-300">
                  <label className="block text-gray-300 mb-2">New Email:</label>
                  <input
                    type="email"
                    placeholder="Enter new email"
                    className="w-full px-4 py-2 mb-4 bg-[#0F1923] border border-[#1F2A38] rounded-lg text-white"
                  />
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Update Email
                  </button>
                </div>
              )}
            </div>

            {/* Change Password */}
            <div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-blue-400 hover:text-blue-300 text-sm sm:text-base"
              >
                {showPasswordForm
                  ? "Cancel Password Change"
                  : "Change Password?"}
              </button>

              {showPasswordForm && (
                <div className="mt-4 bg-[#111E2A] p-4 sm:p-6 rounded-lg transition-all duration-300">
                  <label className="block text-gray-300 mb-2">
                    New Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 mb-4 bg-[#0F1923] border border-[#1F2A38] rounded-lg text-white"
                  />
                  <label className="block text-gray-300 mb-2">
                    Confirm New Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 mb-4 bg-[#0F1923] border border-[#1F2A38] rounded-lg text-white"
                  />
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Update Password
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Appearance Settings
            </h2>
            <p className="text-gray-400">Theme options will go here...</p>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Security Settings
            </h2>
            <p className="text-gray-400">Two-factor authentication, etc...</p>
          </div>
        )}

        {activeTab === "connections" && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Connections
            </h2>
            <p className="text-gray-400">Connect Discord, Steam, etc...</p>
          </div>
        )}
      </div>
    </div>
  );
}
