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

// Solar Setup API
interface SolarSetupData {
  firm_user_id: string;
  agent_id: string;
  installation_price: number;
  dealer_fee: number;
  broker_fee: number;
  allow_financed: boolean;
  allow_cash: boolean;
  financing_apr: number;
  financing_term: number;
  energy_price: number;
  yearly_electric_cost_increase: number;
  installation_lifespan: number;
  typical_panel_count: number;
  max_roof_segments: number;
  solar_incentive: number;
  setup_status?: string;
}

export const saveSolarSetup = async (data: SolarSetupData): Promise<{ success: boolean; message: string }> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 Debugging solar setup save:', {
      firm_user_id: data.firm_user_id,
      agent_id: data.agent_id,
      installation_price: data.installation_price,
      dealer_fee: data.dealer_fee
    });
    
    // First, let's check if this user exists in profiles table (same logic as other saves)
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
      installation_price: data.installation_price,
      dealer_fee: data.dealer_fee,
      broker_fee: data.broker_fee,
      allow_financed: data.allow_financed,
      allow_cash: data.allow_cash,
      financing_apr: data.financing_apr,
      financing_term: data.financing_term,
      energy_price: data.energy_price,
      yearly_electric_cost_increase: data.yearly_electric_cost_increase,
      installation_lifespan: data.installation_lifespan,
      typical_panel_count: data.typical_panel_count,
      max_roof_segments: data.max_roof_segments,
      solar_incentive: data.solar_incentive,
      setup_status: data.setup_status || 'completed'
    };

    console.log('📝 Final solar setup insert data:', insertData);

    // Use upsert to insert or update if record already exists
    const { data: result, error } = await supabase
      .from('solar_setup')
      .upsert(insertData, {
        onConflict: 'firm_user_id,agent_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase solar setup upsert error:', error);
      throw new Error(`Failed to save solar setup: ${error.message}`);
    }

    console.log('✅ Solar setup saved successfully:', result);

    return {
      success: true,
      message: 'Solar setup saved successfully'
    };
  } catch (error) {
    console.error('Save solar setup error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save solar setup');
  }
};

// Calendar Setup API
interface CalendarSetupData {
  firm_user_id: string;
  agent_id: string;
  calendar_name: string;
  description?: string;
  call_duration: number;
  max_calls_per_day: number;
  notice_hours: number;
  book_ahead_days: number;
  auto_confirm: boolean;
  allow_rescheduling: boolean;
  allow_cancellations: boolean;
  business_hours: Record<string, { enabled: boolean; start: string; end: string }>;
  setup_status?: string;
}

export const saveCalendarSetup = async (data: CalendarSetupData): Promise<{ success: boolean; message: string }> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 Debugging calendar setup save:', {
      firm_user_id: data.firm_user_id,
      agent_id: data.agent_id,
      calendar_name: data.calendar_name,
      call_duration: data.call_duration
    });
    
    // First, let's check if this user exists in profiles table (same logic as other saves)
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
      calendar_name: data.calendar_name,
      description: data.description || null,
      call_duration: data.call_duration,
      max_calls_per_day: data.max_calls_per_day,
      notice_hours: data.notice_hours,
      book_ahead_days: data.book_ahead_days,
      auto_confirm: data.auto_confirm,
      allow_rescheduling: data.allow_rescheduling,
      allow_cancellations: data.allow_cancellations,
      business_hours: data.business_hours,
      setup_status: data.setup_status || 'completed'
    };

    console.log('📝 Final calendar setup insert data:', insertData);

    // Use upsert to insert or update if record already exists
    const { data: result, error } = await supabase
      .from('calendar_setup')
      .upsert(insertData, {
        onConflict: 'firm_user_id,agent_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase calendar setup upsert error:', error);
      throw new Error(`Failed to save calendar setup: ${error.message}`);
    }

    console.log('✅ Calendar setup saved successfully:', result);

    return {
      success: true,
      message: 'Calendar setup saved successfully'
    };
  } catch (error) {
    console.error('Save calendar setup error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save calendar setup');
  }
};

// Notification Preferences API
interface NotificationPreferencesData {
  firm_user_id: string;
  agent_id: string;
  email_enabled: boolean;
  messenger_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  ghl_enabled: boolean;
  notification_email: string;
  appointment_confirmations: boolean;
  appointment_reminders: boolean;
  cancellations_reschedules: boolean;
  setup_status?: string;
}

export const saveNotificationPreferences = async (data: NotificationPreferencesData): Promise<{ success: boolean; message: string }> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 Debugging notification preferences save:', {
      firm_user_id: data.firm_user_id,
      agent_id: data.agent_id,
      notification_email: data.notification_email,
      email_enabled: data.email_enabled
    });
    
    // First, let's check if this user exists in profiles table (same logic as other saves)
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
      email_enabled: data.email_enabled,
      messenger_enabled: data.messenger_enabled,
      sms_enabled: data.sms_enabled,
      whatsapp_enabled: data.whatsapp_enabled,
      ghl_enabled: data.ghl_enabled,
      notification_email: data.notification_email,
      appointment_confirmations: data.appointment_confirmations,
      appointment_reminders: data.appointment_reminders,
      cancellations_reschedules: data.cancellations_reschedules,
      setup_status: data.setup_status || 'completed'
    };

    console.log('📝 Final notification preferences insert data:', insertData);

    // Use upsert to insert or update if record already exists
    const { data: result, error } = await supabase
      .from('notification_preferences')
      .upsert(insertData, {
        onConflict: 'firm_user_id,agent_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase notification preferences upsert error:', error);
      throw new Error(`Failed to save notification preferences: ${error.message}`);
    }

    console.log('✅ Notification preferences saved successfully:', result);

    return {
      success: true,
      message: 'Notification preferences saved successfully'
    };
  } catch (error) {
    console.error('Save notification preferences error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save notification preferences');
  }
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

// Get existing website analysis data
export const getWebsiteAnalysis = async (userId: string, agentId: string = 'SOL'): Promise<any> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 getWebsiteAnalysis: API called with userId:', userId);
    console.log('🔍 getWebsiteAnalysis: About to query firm_user_id=', userId, 'agent_id=', agentId);
    
    // Use firm_user_id field for website_analysis table  
    let { data, error } = await supabase
      .from('website_analysis')
      .select('*')
      .eq('firm_user_id', userId)
      .eq('agent_id', agentId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching website analysis:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Get website analysis error:', error);
    return null;
  }
};

// Get existing business details data
export const getBusinessDetails = async (userId: string, agentId: string = 'SOL'): Promise<any> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 getBusinessDetails: Using userId directly as firm_user_id:', userId);
    
    let { data, error } = await supabase
      .from('business_details')
      .select('*')
      .eq('firm_user_id', userId)
      .eq('agent_id', agentId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching business details:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Get business details error:', error);
    return null;
  }
};

// Get existing solar setup data
export const getSolarSetup = async (userId: string, agentId: string = 'SOL'): Promise<any> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 getSolarSetup: Using userId directly as firm_user_id:', userId);
    
    let { data, error } = await supabase
      .from('solar_setup')
      .select('*')
      .eq('firm_user_id', userId)
      .eq('agent_id', agentId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching solar setup:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Get solar setup error:', error);
    return null;
  }
};

// Get existing calendar setup data
export const getCalendarSetup = async (userId: string, agentId: string = 'SOL'): Promise<any> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 getCalendarSetup: Using userId directly as firm_user_id:', userId);
    
    let { data, error } = await supabase
      .from('calendar_setup')
      .select('*')
      .eq('firm_user_id', userId)
      .eq('agent_id', agentId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching calendar setup:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Get calendar setup error:', error);
    return null;
  }
};

// Get existing notification preferences data
export const getNotificationPreferences = async (userId: string, agentId: string = 'SOL'): Promise<any> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 getNotificationPreferences: Using userId directly as firm_user_id:', userId);
    
    let { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('firm_user_id', userId)
      .eq('agent_id', agentId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Get notification preferences error:', error);
    return null;
  }
};

// Helper function to get the correct user_id from profiles table
// Get the correct user_id from profiles table using email
export const getProfileUserId = async (email: string): Promise<string | null> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 getProfileUserId: Looking up user_id for email:', email);
    
    // Get the profile user_id from the email
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('❌ getProfileUserId: Error:', error);
      return null;
    }
    
    if (profile?.user_id) {
      console.log('✅ getProfileUserId: Found user_id:', profile.user_id, 'for email:', email);
      return profile.user_id;
    }
    
    console.log('⚠️ getProfileUserId: No profile found for email:', email);
    return null;
  } catch (error) {
    console.error('Error getting profile user_id:', error);
    return null;
  }
};

// Check setup completion status for all steps
export const checkSetupStatus = async (userId: string, agentId: string = 'SOL'): Promise<{
  websiteDetails: boolean;
  businessDetails: boolean;
  solarSetup: boolean;
  calendarSetup: boolean;
  notificationPreferences: boolean;
  facebookConnect: boolean;
}> => {
  try {
    console.log('🔍 checkSetupStatus: Checking status for userId:', userId, 'agentId:', agentId);
    
    // Use userId directly as firm_user_id in all 5 tables
    const [website, business, solar, calendar, notifications] = await Promise.all([
      getWebsiteAnalysis(userId, agentId),
      getBusinessDetails(userId, agentId),
      getSolarSetup(userId, agentId),
      getCalendarSetup(userId, agentId),
      getNotificationPreferences(userId, agentId)
    ]);
    
    console.log('🔍 checkSetupStatus: Raw data:', {
      website: !!website,
      business: !!business,
      solar: !!solar,
      calendar: !!calendar,
      notifications: !!notifications
    });
    
    return {
      websiteDetails: !!website,
      businessDetails: !!business,
      solarSetup: !!solar,
      calendarSetup: !!calendar,
      notificationPreferences: !!notifications,
      facebookConnect: false // This step doesn't exist yet
    };
  } catch (error) {
    console.error('Check setup status error:', error);
    return {
      websiteDetails: false,
      businessDetails: false,
      solarSetup: false,
      calendarSetup: false,
      notificationPreferences: false,
      facebookConnect: false
    };
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

export const saveWebsiteAnalysis = async (data: WebsiteAnalysisData & { isAnalyzeButton?: boolean }): Promise<{ success: boolean; message: string }> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 Debugging website analysis save:', {
      firm_user_id: data.firm_user_id,
      firm_user_id_type: typeof data.firm_user_id,
      agent_id: data.agent_id,
      isAnalyzeButton: data.isAnalyzeButton
    });
    
    // Get firm_id from profiles table - REQUIRED field
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, email, company_id')
      .eq('user_id', data.firm_user_id)
      .single();
    
    if (profileError || !profileData) {
      console.error('Profile not found for user_id:', data.firm_user_id, profileError);
      
      // Try checking by id instead
      const { data: profileById, error: profileByIdError } = await supabase
        .from('profiles')
        .select('id, user_id, email, company_id')
        .eq('id', data.firm_user_id)
        .single();
        
      if (profileByIdError || !profileById) {
        console.error('Profile not found by id either:', data.firm_user_id, profileByIdError);
        throw new Error('User profile not found. Please ensure you are logged in properly.');
      } else {
        console.log('✅ Found profile by id:', profileById);
        data.firm_user_id = profileById.user_id;
        var firm_id = profileById.company_id;
      }
    } else {
      console.log('✅ Found profile by user_id:', profileData);
      var firm_id = profileData.company_id;
    }
    
    // Validate firm_id - cannot be null
    if (!firm_id) {
      throw new Error('Company ID not found in user profile. Please contact support.');
    }
    
    // Check if record exists for UPSERT logic
    const existingRecord = await supabase
      .from('website_analysis')
      .select('id, created_at')
      .eq('firm_user_id', data.firm_user_id)
      .eq('agent_id', data.agent_id || 'SOL')
      .eq('website_url', data.website_url)
      .eq('firm_id', firm_id)
      .single();
    
    // Generate UUID for new records
    const recordId = existingRecord.data?.id || crypto.randomUUID();
    const preserveCreatedAt = existingRecord.data?.created_at || new Date().toISOString();
    
    // Prepare base data for database upsert
    const upsertData: any = {
      id: recordId,
      firm_user_id: data.firm_user_id,
      agent_id: data.agent_id || 'SOL',
      firm_id: firm_id,
      website_url: data.website_url,
      company_description: data.company_description || null,
      value_proposition: data.value_proposition || null,
      business_niche: data.business_niche || null,
      tags: data.tags || null,
      analysis_status: data.analysis_status || 'completed',
      created_at: preserveCreatedAt,
      last_updated_timestamp: new Date().toISOString()
    };
    
    // Only include screenshot/favicon URLs when "Analyze" button is clicked
    if (data.isAnalyzeButton === true) {
      upsertData.screenshot_url = data.screenshot_url || null;
      upsertData.favicon_url = data.favicon_url || null;
      console.log('📸 Including screenshot/favicon URLs (Analyze button clicked)');
    } else {
      console.log('📝 Skipping screenshot/favicon URLs (non-Analyze operation)');
    }

    console.log('📝 Final upsert data:', upsertData);

    // Use upsert with the correct conflict resolution
    const { data: result, error } = await supabase
      .from('website_analysis')
      .upsert(upsertData, {
        onConflict: 'firm_user_id,agent_id,website_url,firm_id',
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

// Business Details API
interface BusinessDetailsData {
  firm_user_id: string;
  agent_id: string;
  business_name: string;
  business_email: string;
  phone_number: string;
  emergency_numbers?: string[];
  country?: string;
  address_method?: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  setup_status?: string;
}

export const saveBusinessDetails = async (data: BusinessDetailsData): Promise<{ success: boolean; message: string }> => {
  try {
    const { supabase } = await import('./supabase');
    
    console.log('🔍 Debugging business details save:', {
      firm_user_id: data.firm_user_id,
      agent_id: data.agent_id,
      business_name: data.business_name,
      business_email: data.business_email
    });
    
    // First, let's check if this user exists in profiles table (same logic as website analysis)
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
      business_name: data.business_name,
      business_email: data.business_email,
      phone_number: data.phone_number,
      emergency_numbers: data.emergency_numbers && data.emergency_numbers.length > 0 ? data.emergency_numbers : null,
      country: data.country || 'US',
      address_method: data.address_method || 'manual',
      address_line: data.address_line,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      setup_status: data.setup_status || 'completed'
    };

    console.log('📝 Final business details insert data:', insertData);

    // Use upsert to insert or update if record already exists
    const { data: result, error } = await supabase
      .from('business_details')
      .upsert(insertData, {
        onConflict: 'firm_user_id,agent_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase business details upsert error:', error);
      throw new Error(`Failed to save business details: ${error.message}`);
    }

    console.log('✅ Business details saved successfully:', result);

    return {
      success: true,
      message: 'Business details saved successfully'
    };
  } catch (error) {
    console.error('Save business details error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save business details');
  }
};
