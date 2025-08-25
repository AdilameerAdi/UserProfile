import { useState, useContext } from "react";
import { FaBell, FaUser, FaTimes } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../signup/AuthContext";

export default function AdminNavbar() {
  const { theme } = useContext(ThemeContext);
  const { logout, currentUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead([notificationId]);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div
      className="w-full h-16 flex items-center justify-between px-4 sm:px-6 shadow-md transition-colors duration-300 border-b"
      style={{
        backgroundColor: theme.bgColor,
        borderColor: theme.borderColor,
        color: theme.textColor,
      }}
    >
      {/* Admin Panel Title */}
      <div className="flex items-center gap-3">
        <div
          className="text-transparent text-xl font-extrabold tracking-wide drop-shadow-md"
          style={{ 
            background: theme.gradientText, 
            fontFamily: theme.fontFamily,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text'
          }}
        >
          Admin Panel
        </div>
      </div>

      {/* Right Side - Notifications & User */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="relative p-2 rounded-lg hover:opacity-80 transition-opacity duration-300"
            style={{ color: theme.textColor }}
          >
            <FaBell className="text-lg" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold rounded-full border-2"
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderColor: theme.bgColor
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute right-0 top-12 w-80 max-h-96 rounded-lg shadow-xl border z-50 overflow-hidden"
              style={{
                backgroundColor: theme.cardBg || theme.bgColor,
                borderColor: theme.borderColor,
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-3 border-b"
                style={{ borderColor: theme.borderColor }}
              >
                <h3 className="font-semibold">New User Registrations</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: theme.primary,
                        color: theme.buttonText || 'white'
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:opacity-70"
                    style={{ color: theme.textColor }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm" style={{ color: theme.subTextColor }}>
                    No new user registrations
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-opacity-50 cursor-pointer transition-colors duration-200 ${
                        !notification.is_read ? 'border-l-4' : ''
                      }`}
                      style={{
                        borderBottomColor: theme.borderColor,
                        borderLeftColor: !notification.is_read ? '#ef4444' : 'transparent',
                        backgroundColor: !notification.is_read ? `${theme.activeBg}20` : 'transparent'
                      }}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <FaUser className="text-xs" style={{ color: theme.buttonText || 'white' }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: theme.textColor }}>
                              New user registered
                            </p>
                            <p className="text-xs" style={{ color: theme.subTextColor }}>
                              {notification.user_name || notification.user_email}
                            </p>
                            <p className="text-xs" style={{ color: theme.subTextColor }}>
                              {notification.user_email}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs" style={{ color: theme.subTextColor }}>
                          {formatTime(notification.registered_at)}
                        </div>
                      </div>
                      {!notification.is_read && (
                        <div
                          className="w-2 h-2 rounded-full absolute right-2 top-1/2 transform -translate-y-1/2"
                          style={{ backgroundColor: '#ef4444' }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:block">
            {currentUser?.name || currentUser?.email || 'Admin'}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 text-sm rounded-lg hover:opacity-80 transition-opacity duration-300"
            style={{
              backgroundColor: theme.disconnectButton || '#ef4444',
              color: theme.buttonText || 'white'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}