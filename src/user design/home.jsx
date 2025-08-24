import { useState, useEffect } from "react";
import { FaEdit, FaImage } from "react-icons/fa";
import { useAuth } from "../signup/AuthContext";

// Import sample photos
import photo1 from "./profile photo/1.png";
import photo2 from "./profile photo/2.png";
import photo3 from "./profile photo/3.png";
import photo4 from "./profile photo/4.png";
import photo5 from "./profile photo/5.png";
import photo6 from "./profile photo/6.png";
import photo8 from "./profile photo/8.png";
import photo9 from "./profile photo/9.png";
import photo10 from "./profile photo/10.png";
import photo11 from "./profile photo/11.png";
import photo12 from "./profile photo/12.png";
import photo13 from "./profile photo/13.png";
import photo14 from "./profile photo/14.png";
import photo15 from "./profile photo/15.png";
import photo16 from "./profile photo/16.png";

export default function Home() {
  const { currentUser, updateProfileName } = useAuth();
  const [userName, setUserName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [isEditingName, setIsEditingName] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [savingName, setSavingName] = useState(false);
  const [saveError, setSaveError] = useState("");

  const photos = [
    photo1, photo2, photo3, photo4,
    photo5, photo6, photo8,
    photo9, photo10, photo11, photo12,
    photo13, photo14, photo15, photo16
  ];

  // Sync from auth user
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name || "User");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Pick a random avatar initially
  useEffect(() => {
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    setProfilePhoto(randomPhoto);
  }, []);

  const handleSaveName = async () => {
    setSavingName(true);
    setSaveError("");
    const trimmed = (userName || "").trim();
    if (!trimmed) {
      setSaveError("Name cannot be empty");
      setSavingName(false);
      return;
    }
    const res = await updateProfileName(trimmed);
    if (!res.ok) {
      setSaveError(res.error || "Failed to save name");
    }
    setIsEditingName(false);
    setSavingName(false);
  };

  const handleSelectPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleSavePhoto = () => {
    if (selectedPhoto) {
      setProfilePhoto(selectedPhoto);
      setSelectedPhoto(null);
      setIsGalleryOpen(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      {/* Outer Card */}
      <div className="bg-gray-200 shadow-xl rounded-2xl p-10 max-w-3xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h1>

        {/* Inner Card */}
        <div className="bg-gray-400 shadow-md rounded-xl p-6 w-full max-w-sm text-center">
          {/* Profile Photo */}
          <div className="mb-6 flex justify-center">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-400 shadow-md"
            />
          </div>

          {/* User Info */}
          <div className="mb-6">
            {isEditingName ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border text-white p-2 rounded w-2/3 text-center"
                autoFocus
              />
            ) : (
              <h2 className="text-xl text-white font-semibold">{userName}</h2>
            )}
            <p className="text-gray-500">{email}</p>
            {saveError && <p className="text-red-600 text-sm mt-2">{saveError}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {isEditingName ? (
              <button
                onClick={handleSaveName}
                disabled={savingName}
                className="px-5 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 disabled:opacity-60"
              >
                {savingName ? "Saving..." : "Save Name"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaEdit /> Change Name
              </button>
            )}

            <button
              onClick={() => setIsGalleryOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <FaImage /> Change Avatar
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl mb-4 font-semibold text-center">Choose a profile photo</h2>
            <div className="grid grid-cols-4 gap-4 mb-4 max-h-60 overflow-y-auto">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`photo-${index}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedPhoto === photo ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => handleSelectPhoto(photo)}
                />
              ))}
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              {selectedPhoto && (
                <button
                  onClick={handleSavePhoto}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
