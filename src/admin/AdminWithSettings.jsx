import { useState } from "react";
import Admin from "./Admin"; // <-- this is your existing Admin component
import { FiSettings } from "react-icons/fi";

export default function AdminWithSettings() {
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative min-h-screen">
      {/* Render your existing Admin panel */}
      <Admin />

      {/* Floating settings button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiSettings size={24} />
      </button>

      {/* Settings panel */}
      {showSettings && (
        <div className="fixed bottom-16 right-4 w-72 bg-white border rounded-lg shadow-lg p-4 space-y-3 z-50">
          <h3 className="text-lg font-semibold">Settings</h3>
          <input
            type="text"
            placeholder="New Username"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={() => {
                alert(`Username: ${username}, Password: ${password}`);
                setShowSettings(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
