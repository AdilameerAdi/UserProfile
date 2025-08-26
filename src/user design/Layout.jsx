import Sidebar from "./userMain";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../signup/AuthContext";
import RecoveryEmailReminder from "./RecoveryEmailReminder";

export default function Layout({ children }) {
  const { theme } = useContext(ThemeContext);
  const { currentUser, isAuthenticated } = useAuth();
  const [showRecoveryReminder, setShowRecoveryReminder] = useState(false);
  
  // Check if user needs recovery email reminder
  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.role === "user") {
      // Check if user has permanently completed recovery email setup
      const completedKey = `recovery_email_completed_${currentUser.id}`;
      const hasCompletedRecoverySetup = localStorage.getItem(completedKey) === 'true';
      
      // Show reminder only if:
      // 1. User doesn't have recovery email in their profile, AND
      // 2. User hasn't permanently completed recovery email setup, AND  
      // 3. User hasn't dismissed it recently (24-hour cooldown)
      if (!currentUser.hasRecoveryEmail && !hasCompletedRecoverySetup) {
        const dismissedKey = `recovery_reminder_dismissed_${currentUser.id}`;
        const lastDismissed = localStorage.getItem(dismissedKey);
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
        
        if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
          setShowRecoveryReminder(true);
        }
      } else {
        setShowRecoveryReminder(false);
      }
    }
  }, [isAuthenticated, currentUser]);
  
  const handleDismissReminder = () => {
    setShowRecoveryReminder(false);
    // Remember dismissal for 24 hours
    const dismissedKey = `recovery_reminder_dismissed_${currentUser.id}`;
    localStorage.setItem(dismissedKey, Date.now().toString());
  };

  // Handle visibility changes to prevent white screen issues
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Force a re-render when tab becomes visible
        // This helps prevent white screen issues
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 50);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 overflow-auto transition-colors duration-300"
        style={{
          background: theme.backgroundGradient,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        {/* Mobile Navbar (inside Sidebar component itself) */}
        <div className="md:hidden sticky top-0 z-50">
          <Sidebar mobileOnly />
        </div>

        {/* Actual page content */}
        <div className="p-6">
          {/* Recovery Email Reminder */}
          {showRecoveryReminder && (
            <RecoveryEmailReminder onDismiss={handleDismissReminder} />
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}
