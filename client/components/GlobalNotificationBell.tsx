import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { notificationsService } from '../lib/notifications-api';
import { toast } from 'sonner';

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
      
      // Play notification sound globally
      console.log('🔊 GLOBAL: Playing notification sound...');
      notificationsService.playNotificationSound();
      
      // Show toast notification globally
      console.log('🍞 GLOBAL: Showing toast notification...');
      toast.success(`New message from ${notification.sender_name || 'Unknown'}`, {
        description: notification.message_content.slice(0, 100) + (notification.message_content.length > 100 ? '...' : ''),
        duration: 5000,
      });
      
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