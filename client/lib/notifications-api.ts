/**
 * Notifications API Service
 * Handles all notification-related API calls and WebSocket connections
 */

import { supabase } from './supabase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Notification types
export interface Notification {
  id: string;
  ghl_location_id: string;
  ghl_contact_id: string;
  message_content: string;
  message_type: 'SMS' | 'Facebook' | 'Instagram' | 'WhatsApp' | string;
  sender_name?: string;
  sender_phone?: string;
  sender_email?: string;
  conversation_id?: string;
  read_status: boolean;
  responded_status: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
}

class NotificationsService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Set<(notification: Notification) => void> = new Set();

  /**
   * Fetch notifications for a user
   */
  async getNotifications(
    userId: string, 
    options: {
      limit?: number;
      offset?: number;
      unread_only?: boolean;
    } = {}
  ): Promise<NotificationsResponse> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.unread_only) params.append('unread_only', 'true');

    const response = await fetch(
      `${BACKEND_URL}/api/notifications/${userId}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(
      `${BACKEND_URL}/api/notifications/${notificationId}/read`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    const response = await fetch(
      `${BACKEND_URL}/api/notifications/user/${userId}/read-all`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
    }
  }

  /**
   * Connect to WebSocket for real-time notifications
   */
  connectWebSocket(userId: string, sessionId: string = 'default'): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = BACKEND_URL.replace(/^http/, 'ws');
    const connectionId = `${userId}_${sessionId}`;
    
    console.log('Connecting to WebSocket for notifications:', connectionId);
    
    this.ws = new WebSocket(`${wsUrl}/ws/${connectionId}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected for notifications');
      this.reconnectAttempts = 0;
      
      // Send initial connection message
      this.ws?.send(JSON.stringify({
        type: 'connection',
        userId,
        sessionId,
      }));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle notification messages
        if (data.type === 'notification') {
          console.log('Received real-time notification:', data);
          
          // Convert WebSocket message to Notification format
          const notification: Notification = {
            id: data.notification_id,
            ghl_location_id: data.ghl_location_id || '',
            ghl_contact_id: data.ghl_contact_id,
            message_content: data.message,
            message_type: data.message_type || 'SMS',
            sender_name: data.sender_name,
            sender_phone: data.sender_phone,
            sender_email: data.sender_email,
            conversation_id: data.conversation_id,
            read_status: false,
            responded_status: false,
            metadata: data.metadata,
            created_at: data.timestamp,
            updated_at: data.timestamp,
          };
          
          // Notify all listeners
          this.listeners.forEach(listener => listener(notification));
          
          // Show browser notification if permitted
          this.showBrowserNotification(notification);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.ws = null;
      
      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);
        
        this.reconnectTimeout = setTimeout(() => {
          this.connectWebSocket(userId, sessionId);
        }, delay);
      }
    };
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.reconnectAttempts = 0;
  }

  /**
   * Add a listener for real-time notifications
   */
  onNotification(callback: (notification: Notification) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Request browser notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: Notification): void {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      const title = notification.sender_name || 'New Message';
      const options: NotificationOptions = {
        body: notification.message_content,
        icon: '/squidgy-icon.png', // Add your icon
        badge: '/squidgy-badge.png', // Add your badge
        tag: notification.id,
        requireInteraction: false,
        silent: false,
        data: notification,
      };

      const browserNotification = new Notification(title, options);

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        // You can add navigation logic here if needed
      };

      // Auto-close after 5 seconds
      setTimeout(() => browserNotification.close(), 5000);
    }
  }

  /**
   * Play notification sound
   */
  playNotificationSound(): void {
    try {
      const audio = new Audio('/notification-sound.mp3'); // Add your sound file
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Could not play notification sound:', e));
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  }
}

// Export singleton instance
export const notificationsService = new NotificationsService();