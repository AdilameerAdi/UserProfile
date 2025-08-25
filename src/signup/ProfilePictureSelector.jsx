import { useState } from "react";
import { DEFAULT_AVATARS, PROFILE_PHOTOS } from "../constants/profilePhotos";

export default function ProfilePictureSelector({ 
  selectedPicture, 
  onPictureSelect, 
  onCustomUpload 
}) {
  const [uploadPreview, setUploadPreview] = useState("");

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setUploadPreview(dataUrl);
        onCustomUpload(file, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatarUrl) => {
    setUploadPreview("");
    onPictureSelect(avatarUrl);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-white mb-2">Choose Your Profile Picture</h3>
        <p className="text-sm text-gray-400 mb-4">Select an avatar or upload your own picture</p>
      </div>

      {/* Selected/Preview Picture */}
      <div className="flex justify-center mb-4">
        {(selectedPicture || uploadPreview) && (
          <div className="relative">
            <img
              src={uploadPreview || selectedPicture}
              alt="Selected profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        )}
      </div>

      {/* Default Avatar Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Choose from default avatars:</h4>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {DEFAULT_AVATARS.map((avatarUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAvatarSelect(avatarUrl)}
              className={`w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                selectedPicture === avatarUrl && !uploadPreview
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-600 hover:border-gray-400"
              }`}
            >
              <img
                src={avatarUrl}
                alt={`Avatar ${index + 1}`}
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Profile Photos Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Or choose from profile photos:</h4>
        <div className="grid grid-cols-4 gap-3 mb-4 max-h-48 overflow-y-auto">
          {PROFILE_PHOTOS.map((photoUrl, index) => (
            <button
              key={`photo-${index}`}
              type="button"
              onClick={() => handleAvatarSelect(photoUrl)}
              className={`w-16 h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                selectedPicture === photoUrl && !uploadPreview
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-600 hover:border-gray-400"
              }`}
            >
              <img
                src={photoUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Custom Upload Option */}
      <div className="border-t border-gray-600 pt-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Or upload your own:</h4>
        <div className="flex items-center justify-center">
          <label className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          JPG, PNG or GIF (max 5MB)
        </p>
      </div>
    </div>
  );
}