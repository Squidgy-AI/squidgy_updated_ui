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

// N8N Webhook API
interface N8NWebhookRequest {
  user_id: string;
  user_mssg: string;
  session_id: string;
  agent_name: string;
  timestamp_of_call_made: string;
  request_id: string;
}

interface N8NWebhookResponse {
  user_id: string;
  session_id: string;
  agent_name: string;
  timestamp_of_call_made: string;
  request_id: string;
  agent_response: string;
}

export const callN8NWebhook = async (data: N8NWebhookRequest): Promise<N8NWebhookResponse> => {
  try {
    // Use the N8N webhook URL from environment variables
    const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.theaiteam.uk/webhook/c2fcbad6-abc0-43af-8aa8-d1661ff4461d';
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('N8N webhook error:', error);
    throw new Error(error instanceof Error ? error.message : 'N8N webhook failed');
  }
};

// Website Analysis API
interface WebsiteAnalysisData {
  firm_user_id: string;
  agent_id: string;
  website_url: string;
  company_description?: string;
  value_proposition?: string;
  business_niche?: string;
  tags?: string[];
  screenshot_url?: string;
  favicon_url?: string;
  analysis_status?: string;
}

export const saveWebsiteAnalysis = async (data: WebsiteAnalysisData): Promise<{ success: boolean; message: string }> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 Debugging website analysis save:', {
      firm_user_id: data.firm_user_id,
      firm_user_id_type: typeof data.firm_user_id,
      agent_id: data.agent_id
    });
    
    // First, let's check if this user exists in profiles table
    const { data: profileCheck, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, email')
      .eq('user_id', data.firm_user_id)
      .single();
    
    if (profileError || !profileCheck) {
      console.error('Profile not found for user_id:', data.firm_user_id, profileError);
      
      // Try checking by id instead
      const { data: profileById, error: profileByIdError } = await supabase
        .from('profiles')
        .select('id, user_id, email')
        .eq('id', data.firm_user_id)
        .single();
        
      if (profileByIdError || !profileById) {
        console.error('Profile not found by id either:', data.firm_user_id, profileByIdError);
        throw new Error('User profile not found. Please ensure you are logged in properly.');
      } else {
        console.log('✅ Found profile by id:', profileById);
        // Use the user_id from the found profile
        data.firm_user_id = profileById.user_id;
      }
    } else {
      console.log('✅ Found profile by user_id:', profileCheck);
    }
    
    // Prepare data for database insert
    const insertData = {
      firm_user_id: data.firm_user_id,
      agent_id: data.agent_id || 'SOL',
      website_url: data.website_url,
      company_description: data.company_description || null,
      value_proposition: data.value_proposition || null,
      business_niche: data.business_niche || null,
      tags: data.tags || null,
      screenshot_url: data.screenshot_url || null,
      favicon_url: data.favicon_url || null,
      analysis_status: data.analysis_status || 'completed'
    };

    console.log('📝 Final insert data:', insertData);

    // Use upsert to insert or update if record already exists
    const { data: result, error } = await supabase
      .from('website_analysis')
      .upsert(insertData, {
        onConflict: 'firm_user_id,agent_id,website_url',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      throw new Error(`Failed to save website analysis: ${error.message}`);
    }

    console.log('✅ Website analysis saved successfully:', result);

    return {
      success: true,
      message: 'Website analysis saved successfully'
    };
  } catch (error) {
    console.error('Save website analysis error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save website analysis');
  }
};
