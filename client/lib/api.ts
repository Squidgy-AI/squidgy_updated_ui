import { toast } from "sonner";

// API client for Squidgy backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Authentication interfaces
interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

interface AuthResponse {
  user: any;
  profile?: any;
  needsEmailConfirmation?: boolean;
  message?: string;
  detail?: string;
}

// Website Analysis Response Types
interface WebsiteAnalysisResponse {
  company_description?: string;
  value_proposition?: string;
  business_niche?: string;
  tags?: string[];
  screenshot_url?: string;
  favicon_url?: string;
}

// Error handling utility
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    const errorMessage = error.detail || error.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Generic API client
export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      toast.error(`GET ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      toast.error(`POST ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      toast.error(`PUT ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleApiResponse<T>(response);
    } catch (error) {
      toast.error(`DELETE ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },
};

// Website Analysis APIs
export const websiteApi = {
  analyzeWebsite: async (data: { url: string; user_id: string; session_id: string }): Promise<WebsiteAnalysisResponse> => {
    try {
      const result = await apiClient.post<WebsiteAnalysisResponse>('/api/website/full-analysis', data);
      return result;
    } catch (error: any) {
      // Log the actual error for debugging
      console.error('Website analysis API error:', error);
      
      // Check if it's a network/server error
      if (error.response) {
        throw new Error(`Analysis failed: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network error: Could not connect to analysis service');
      } else {
        throw new Error(`Analysis error: ${error.message}`);
      }
    }
  },
  
  captureScreenshot: async (data: { url: string; user_id: string }) => {
    return apiClient.post('/api/website/screenshot', data);
  },
  
  getFavicon: async (data: { url: string }) => {
    return apiClient.post('/api/website/favicon', data);
  },
};

// Agent Setup APIs
export const agentApi = {
  createSetup: async (data: {
    user_id: string;
    agent_id: string;
    agent_name?: string;
    setup_data: any;
    setup_type: 'BusinessSetup' | 'SolarSetup' | 'CalendarSetup' | 'NotificationSetup';
  }) => {
    return apiClient.post('/api/agents/setup', data);
  },
  
  getUserSetups: async (userId: string) => {
    return apiClient.get(`/api/agents/setup/${userId}`);
  },
  
  getSpecificSetup: async (userId: string, agentId: string) => {
    return apiClient.get(`/api/agents/setup/${userId}/${agentId}`);
  },
  
  getSetupProgress: async (userId: string, agentId: string) => {
    return apiClient.get(`/api/agents/setup/${userId}/${agentId}/progress`);
  },
  
  updateSetup: async (userId: string, agentId: string, data: any) => {
    return apiClient.put(`/api/agents/setup/${userId}/${agentId}`, data);
  },
  
  deleteSetup: async (userId: string, agentId: string) => {
    return apiClient.delete(`/api/agents/setup/${userId}/${agentId}`);
  },
};

// Business Details APIs
export const businessApi = {
  saveBusinessDetails: async (data: {
    user_id: string;
    agent_id: string;
    business_data: any;
  }) => {
    return apiClient.post('/api/business/details', data);
  },
  
  getBusinessDetails: async (userId: string, agentId: string) => {
    return apiClient.get(`/api/business/details/${userId}/${agentId}`);
  },
};

// Solar Setup APIs
export const solarApi = {
  saveSolarSetup: async (data: {
    user_id: string;
    agent_id: string;
    solar_data: any;
  }) => {
    return apiClient.post('/api/solar/setup', data);
  },
  
  getSolarSetup: async (userId: string, agentId: string) => {
    return apiClient.get(`/api/solar/setup/${userId}/${agentId}`);
  },
};

// Calendar APIs
export const calendarApi = {
  saveCalendarSetup: async (data: {
    user_id: string;
    agent_id: string;
    calendar_data: any;
  }) => {
    return apiClient.post('/api/calendar/setup', data);
  },
  
  getCalendarSetup: async (userId: string, agentId: string) => {
    return apiClient.get(`/api/calendar/setup/${userId}/${agentId}`);
  },
};

// Notification APIs
export const notificationApi = {
  saveNotificationPreferences: async (data: {
    user_id: string;
    agent_id: string;
    notification_data: any;
  }) => {
    return apiClient.post('/api/notifications/preferences', data);
  },
  
  getNotificationPreferences: async (userId: string, agentId: string) => {
    return apiClient.get(`/api/notifications/preferences/${userId}/${agentId}`);
  },
};

// Facebook Integration APIs
export const facebookApi = {
  connectFacebook: async (data: {
    user_id: string;
    agent_id: string;
    facebook_data: any;
  }) => {
    return apiClient.post('/api/facebook/connect', data);
  },
  
  getFacebookConnection: async (userId: string, agentId: string) => {
    return apiClient.get(`/api/facebook/connection/${userId}/${agentId}`);
  },
};

// Authentication API endpoints - now using Supabase client-side authentication
import { authService } from './auth-service';

export const signUp = async (userData: SignUpData): Promise<AuthResponse> => {
  return authService.signUp(userData);
};

export const signIn = async (credentials: SignInData): Promise<AuthResponse> => {
  return authService.signIn(credentials);
};

export const sendPasswordResetEmail = async (data: ForgotPasswordData): Promise<{ message: string }> => {
  return authService.sendPasswordResetEmail(data);
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ message: string }> => {
  return authService.resetPassword(data);
};

export const signOut = async (): Promise<void> => {
  return authService.signOut();
};

export const getCurrentUser = async (): Promise<{ user: any; profile: any | null }> => {
  return authService.getCurrentUser();
};
