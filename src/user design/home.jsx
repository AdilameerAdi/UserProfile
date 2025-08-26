import { useState, useEffect, useMemo } from "react";
import { FaEdit, FaImage } from "react-icons/fa";
import { useAuth } from "../signup/AuthContext";
import backcard from "../img/homeback.png";
import { loadProfilePhotos, DEFAULT_AVATARS } from "../constants/profilePhotos";

export default function Home() {
  const { currentUser, updateProfileName, updateProfilePicture } = useAuth();
  const [userName, setUserName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [isEditingName, setIsEditingName] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [savingName, setSavingName] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [profilePhotos, setProfilePhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  // Combine both avatar types for selection
  const allPhotos = useMemo(() => [...DEFAULT_AVATARS, ...profilePhotos], [profilePhotos]);

  // Load profile photos only when gallery is opened
  useEffect(() => {
    if (isGalleryOpen && profilePhotos.length === 0 && !photosLoading) {
      setPhotosLoading(true);
      loadProfilePhotos().then(photos => {
        setProfilePhotos(photos);
        setPhotosLoading(false);
      });
    }
  }, [isGalleryOpen, profilePhotos.length, photosLoading]);

  // Sync from auth user
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name || "User");
      setEmail(currentUser.email || "");
      // Use user's actual profile picture or fallback to first photo
      setProfilePhoto(currentUser.profilePicture || allPhotos[0]);
    }
  }, [currentUser, allPhotos]);

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

  const handleSavePhoto = async () => {
    if (selectedPhoto) {
      // Update in database
      const result = await updateProfilePicture(selectedPhoto);
      if (result.ok) {
        setProfilePhoto(selectedPhoto);
        setSelectedPhoto(null);
        setIsGalleryOpen(false);
      } else {
        setSaveError(result.error || "Failed to update profile picture");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${backcard})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Inner Card */}
      <div className="bg-gray-400 shadow-md rounded-xl p-6 w-full max-w-sm text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-600">User Profile</h1>
        {/* Profile Photo */}
        <div className="mb-6 flex justify-center">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-400 shadow-md"
            loading="lazy"
            onError={(e) => {
              e.target.src = DEFAULT_AVATARS[0];
            }}
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

      {/* Avatar Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl mb-4 font-semibold text-center">Choose a profile photo</h2>
            <div className="grid grid-cols-4 gap-4 mb-4 max-h-60 overflow-y-auto">
              {allPhotos.map((photo, index) => (
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
