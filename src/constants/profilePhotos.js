// Import all profile photos statically to avoid dynamic import issues
import photo1 from "../user design/profile photo/1.png";
import photo2 from "../user design/profile photo/2.png";
import photo3 from "../user design/profile photo/3.png";
import photo4 from "../user design/profile photo/4.png";
import photo5 from "../user design/profile photo/5.png";
import photo6 from "../user design/profile photo/6.png";
import photo8 from "../user design/profile photo/8.png";
import photo9 from "../user design/profile photo/9.png";
import photo10 from "../user design/profile photo/10.png";
import photo11 from "../user design/profile photo/11.png";
import photo12 from "../user design/profile photo/12.png";
import photo13 from "../user design/profile photo/13.png";
import photo14 from "../user design/profile photo/14.png";
import photo15 from "../user design/profile photo/15.png";
import photo16 from "../user design/profile photo/16.png";

// Convert relative paths to absolute URLs
const convertToAbsoluteURL = (relativePath) => {
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  return new URL(relativePath, window.location.origin).href;
};

// Profile photos array
const profilePhotosArray = [
  photo1, photo2, photo3, photo4,
  photo5, photo6, photo8,
  photo9, photo10, photo11, photo12,
  photo13, photo14, photo15, photo16
].map(convertToAbsoluteURL);

// Export for immediate use
export const PROFILE_PHOTOS = profilePhotosArray;

// Async loader for backwards compatibility with lazy loading components
export const loadProfilePhotos = async () => {
  // Return immediately since photos are already loaded
  return Promise.resolve(profilePhotosArray);
};


// Default Dicebear avatars (existing)
export const DEFAULT_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=1&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=2&backgroundColor=c4e7ff",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=3&backgroundColor=d8d5ff",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=4&backgroundColor=ffd6cc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=5&backgroundColor=e0f7e0",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=6&backgroundColor=fff4d6",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=7&backgroundColor=ffe0e6",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=8&backgroundColor=e6f3ff",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=9&backgroundColor=f0e6ff",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=10&backgroundColor=e6ffe6"
];