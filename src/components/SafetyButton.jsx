import { useState, useEffect } from "react";

export default function SafetyButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Only show if there's genuinely no content after a very long delay
    const timer = setTimeout(() => {
      // More restrictive check - only if page is completely empty
      const hasAnyContent = document.body.textContent.trim().length > 50;
      const hasElements = document.querySelectorAll('div, nav, main, header, button').length > 5;
      
      if (!hasAnyContent && !hasElements) {
        console.warn('Genuine white screen detected by SafetyButton');
        setShowButton(true);
      }
    }, 20000); // Wait 20 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleRecover = () => {
    // Clear any potentially corrupted state
    try {
      // Keep authentication but clear other storage
      const authKeys = ['adminCredentials', 'supabase.auth.token'];
      const preserved = {};
      
      authKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) preserved[key] = value;
      });
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Restore important auth data
      Object.entries(preserved).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      
      // Force a clean reload
      window.location.reload(true);
    } catch {
      // Fallback - just reload
      window.location.reload();
    }
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={handleRecover}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm transition-colors"
        title="Click if the page appears blank or broken"
      >
        🔄 Fix Page
      </button>
    </div>
  );
}