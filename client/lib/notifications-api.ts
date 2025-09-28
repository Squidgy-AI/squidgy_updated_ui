/**
 * Notifications API Service
 * Handles all notification-related API calls and WebSocket connections
 */

import { supabase } from './supabase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Notification types - Updated to match new database schema and webhook payload
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
  contact_type?: string;        // New: Lead, Customer, Prospect, etc.
  message_attachment?: string;  // New: URLs to attachments
  tag?: string;                // New: Tags from GHL
  agent_message?: string;      // New: Agent responses
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
      console.log('✅ WebSocket already connected');
      return;
    }

    const wsUrl = BACKEND_URL.replace(/^http/, 'ws');
    const connectionId = `${userId}_${sessionId}`;
    const fullWsUrl = `${wsUrl}/ws/${userId}/${sessionId}`;
    
    console.log('🔌 WEBSOCKET CONNECTION ATTEMPT:');
    console.log('   Backend URL:', BACKEND_URL);
    console.log('   WebSocket URL:', fullWsUrl);
    console.log('   User ID:', userId);
    console.log('   Session ID:', sessionId);
    console.log('   Connection ID:', connectionId);
    
    this.ws = new WebSocket(fullWsUrl);

    this.ws.onopen = () => {
      console.log('✅ WEBSOCKET CONNECTED SUCCESSFULLY!');
      console.log('   Connection state:', this.ws?.readyState);
      console.log('   Expected connection ID on backend:', connectionId);
      this.reconnectAttempts = 0;
      
      // Send initial connection message
      const connectionMessage = {
        type: 'connection',
        userId,
        sessionId,
      };
      console.log('📤 Sending connection message:', connectionMessage);
      this.ws?.send(JSON.stringify(connectionMessage));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WEBSOCKET MESSAGE RECEIVED:', data);
        
        // Handle notification messages
        if (data.type === 'notification') {
          console.log('🎉 NOTIFICATION MESSAGE DETECTED!');
          console.log('   Sender:', data.sender_name);
          console.log('   Message:', data.message);
          console.log('   Type:', data.message_type);
          console.log('   Location ID:', data.ghl_location_id);
          console.log('   Contact ID:', data.ghl_contact_id);
          console.log('   Notification ID:', data.notification_id);
          
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
            contact_type: data.metadata?.contact_type,
            message_attachment: data.metadata?.user_message_attachment,
            tag: data.metadata?.tag,
            agent_message: data.metadata?.agent_message,
            read_status: false,
            responded_status: false,
            metadata: data.metadata,
            created_at: data.timestamp,
            updated_at: data.timestamp,
          };
          
          // Notify all listeners
          console.log('🔔 Notifying', this.listeners.size, 'listeners');
          this.listeners.forEach(listener => listener(notification));
          
          // Show browser notification if permitted
          console.log('🌐 Triggering browser notification');
          this.showBrowserNotification(notification);
        } else if (data.type === 'ping') {
          console.log('💓 Received ping from server');
        } else {
          console.log('ℹ️ Other message type:', data.type);
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
        console.error('   Raw message:', event.data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WEBSOCKET ERROR:', error);
      console.error('   URL:', fullWsUrl);
      console.error('   Ready state:', this.ws?.readyState);
    };

    this.ws.onclose = (event) => {
      console.log('🔌 WEBSOCKET DISCONNECTED');
      console.log('   Code:', event.code);
      console.log('   Reason:', event.reason);
      console.log('   Clean close:', event.wasClean);
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
      // Create a simple beep sound using Web Audio API as fallback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800 Hz tone
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      console.log('✅ Notification sound played successfully');
    } catch (error) {
      console.log('❌ Error playing notification sound:', error);
      // Fallback: try to play a system beep
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBjiS2+/XdSUE');
        audio.play();
      } catch (fallbackError) {
        console.log('❌ Fallback sound also failed:', fallbackError);
      }
    }
  }
}

// Export singleton instance
export const notificationsService = new NotificationsService();