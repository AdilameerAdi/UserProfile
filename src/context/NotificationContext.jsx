import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../signup/AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAdmin, currentUser } = useAuth();

  // Load notifications for admin users
  useEffect(() => {
    if (isAdmin && currentUser?.id) {
      loadNotifications();
      // Set up real-time subscription
      const subscription = supabase
        .channel('user_registrations')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_registrations' }, 
          () => {
            loadNotifications(); // Reload on any change
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isAdmin, currentUser?.id]);

  const loadNotifications = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      
      // Get all notifications, ordered by most recent
      const { data: notificationsData, error: notificationsError } = await supabase
        .from("user_registrations")
        .select("*")
        .order("registered_at", { ascending: false });

      if (notificationsError) throw notificationsError;

      setNotifications(notificationsData || []);

      // Get unread count
      const { data: countData, error: countError } = await supabase
        .rpc('get_unread_notification_count');

      if (!countError && typeof countData === 'number') {
        setUnreadCount(countData);
      }
    } catch {
      // Error loading notifications
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    if (!isAdmin || !notificationIds?.length) return;

    try {
      const { error } = await supabase
        .rpc('mark_notifications_read', { notification_ids: notificationIds });

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id)
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));

    } catch {
      // Error marking notifications as read
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => !n.is_read)
      .map(n => n.id);
    
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}