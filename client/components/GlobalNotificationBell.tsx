import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { notificationsService } from '../lib/notifications-api';

/**
 * Global NotificationBell component that works on all pages
 * Only handles WebSocket connection and background notifications
 * No UI - just the connection logic
 */
export default function GlobalNotificationBell() {
  const { userId, isAuthenticated } = useUser();

  useEffect(() => {
    if (!userId || !isAuthenticated) {
      console.log('⚠️ GlobalNotificationBell: No authenticated user');
      return;
    }

    console.log('🌍 GLOBAL NOTIFICATION BELL SETUP:');
    console.log('   User ID:', userId);
    console.log('   Authenticated:', isAuthenticated);

    // Connect to WebSocket for real-time notifications
    console.log('🔌 GLOBAL: Connecting WebSocket for user:', userId);
    notificationsService.connectWebSocket(userId);

    // Listen for new notifications (global handler)
    const unsubscribe = notificationsService.onNotification((notification) => {
      console.log('🎉 GLOBAL NOTIFICATION: New notification received!');
      console.log('   From:', notification.sender_name);
      console.log('   Message:', notification.message_content);
      console.log('   Location:', notification.ghl_location_id);
      console.log('   Contact:', notification.ghl_contact_id);
      
      // Just log for now - UI components can handle their own display
      console.log('🔔 Global notification processed');
    });

    // Request notification permission
    notificationsService.requestNotificationPermission();

    return () => {
      console.log('🌍 GlobalNotificationBell: Cleaning up...');
      unsubscribe();
      notificationsService.disconnectWebSocket();
    };
  }, [userId, isAuthenticated]);

  // This component has no visual output
  return null;
}