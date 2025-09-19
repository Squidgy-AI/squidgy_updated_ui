// test-email-check.ts - Isolated email existence check test
import { supabase } from './supabase';
import { profilesApi } from './supabase-api';

interface EmailCheckResult {
  exists: boolean;
  error: string | null;
  timing: number;
  data: any;
}

export const testEmailExistence = async (email: string): Promise<EmailCheckResult> => {
  console.log('🧪 EMAIL_TEST: ===== TESTING EMAIL EXISTENCE CHECK =====');
  console.log(`📧 EMAIL_TEST: Testing email: ${email}`);
  console.log(`🕒 EMAIL_TEST: Test started at: ${new Date().toISOString()}`);
  
  try {
    console.log('🔍 EMAIL_TEST: Checking if email already exists in profiles table...');
    const startEmailCheck = Date.now();
    
    // Test the exact same query from auth-service
    const { data: existingProfiles, error: checkError } = await profilesApi.getByEmail(email.toLowerCase());
    
    const endEmailCheck = Date.now();
    const timingMs = endEmailCheck - startEmailCheck;
    
    console.log(`⏱️ EMAIL_TEST: Email check completed in ${timingMs}ms`);
    console.log('📊 EMAIL_TEST: Query result:', {
      data: existingProfiles,
      error: checkError,
      dataCount: existingProfiles ? existingProfiles.length : 0
    });
    
    if (checkError) {
      console.error('❌ EMAIL_TEST: Error checking existing email:', checkError);
      console.error('❌ EMAIL_TEST: Error details:', {
        message: checkError.message,
        code: checkError.code,
        details: checkError.details,
        hint: checkError.hint
      });
      
      return {
        exists: false,
        error: checkError.message || 'Unknown error',
        timing: timingMs,
        data: null
      };
    }
    
    const emailExists = existingProfiles && existingProfiles.id;
    
    if (emailExists) {
      console.log('✅ EMAIL_TEST: Email already exists in profiles table');
      console.log('📋 EMAIL_TEST: Existing profiles:', existingProfiles);
    } else {
      console.log('✅ EMAIL_TEST: Email is available for registration');
    }
    
    console.log('🎯 EMAIL_TEST: ===== EMAIL EXISTENCE CHECK COMPLETED =====');
    
    return {
      exists: emailExists,
      error: null,
      timing: timingMs,
      data: existingProfiles
    };
    
  } catch (error: any) {
    const endTime = Date.now();
    const timingMs = endTime - Date.now(); // This will be negative, but shows we caught an exception
    
    console.error('❌ EMAIL_TEST: CRITICAL ERROR during email check:', error);
    console.error('❌ EMAIL_TEST: Error type:', typeof error);
    console.error('❌ EMAIL_TEST: Error message:', error.message);
    console.error('❌ EMAIL_TEST: Error stack:', error.stack);
    console.error('❌ EMAIL_TEST: Error occurred at:', new Date().toISOString());
    
    return {
      exists: false,
      error: error.message || 'Unknown exception',
      timing: timingMs,
      data: null
    };
  }
};

// Test function specifically for dmacproject123@gmail.com
export const testDmacEmail = async (): Promise<EmailCheckResult> => {
  console.log('🎯 EMAIL_TEST: Testing specific email: dmacproject123@gmail.com');
  return await testEmailExistence('dmacproject123@gmail.com');
};

// Test with timeout to detect hanging
export const testEmailWithTimeout = async (email: string, timeoutMs: number = 10000): Promise<EmailCheckResult> => {
  console.log(`⏰ EMAIL_TEST: Testing email with ${timeoutMs}ms timeout`);
  
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.error(`❌ EMAIL_TEST: TIMEOUT after ${timeoutMs}ms - email check is hanging!`);
      resolve({
        exists: false,
        error: `Timeout after ${timeoutMs}ms - query is hanging`,
        timing: timeoutMs,
        data: null
      });
    }, timeoutMs);
    
    testEmailExistence(email).then((result) => {
      clearTimeout(timeoutId);
      resolve(result);
    }).catch((error) => {
      clearTimeout(timeoutId);
      resolve({
        exists: false,
        error: error.message || 'Promise rejection',
        timing: timeoutMs,
        data: null
      });
    });
  });
};

// Debug function to test Supabase connection
export const testSupabaseConnection = async (): Promise<void> => {
  console.log('🔧 EMAIL_TEST: Testing basic Supabase connection...');
  
  try {
    // Test basic connection with a simple query
    const { data, error } = await profilesApi.getById('test_connection_check');
    
    if (error) {
      console.error('❌ EMAIL_TEST: Supabase connection error:', error);
    } else {
      console.log('✅ EMAIL_TEST: Supabase connection successful');
      console.log('📊 EMAIL_TEST: Basic query result:', data);
    }
  } catch (error) {
    console.error('❌ EMAIL_TEST: Exception during connection test:', error);
  }
};

// Test direct HTTP API call bypassing Supabase client
export const testDirectApiCall = async (email: string): Promise<EmailCheckResult> => {
  console.log('🌐 EMAIL_TEST: Testing direct HTTP API call...');
  console.log(`📧 EMAIL_TEST: Testing email via direct API: ${email}`);
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('🔧 EMAIL_TEST: Supabase URL:', supabaseUrl);
    console.log('🔧 EMAIL_TEST: Supabase Key:', supabaseKey ? 'Set' : 'Missing');
    
    const url = `${supabaseUrl}/rest/v1/profiles?email=eq.${email.toLowerCase()}&select=id`;
    
    console.log('🌐 EMAIL_TEST: Direct API URL:', url);
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    });
    
    const endTime = Date.now();
    const timingMs = endTime - startTime;
    
    console.log(`⏱️ EMAIL_TEST: Direct API call completed in ${timingMs}ms`);
    console.log('📊 EMAIL_TEST: Response status:', response.status);
    console.log('📊 EMAIL_TEST: Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ EMAIL_TEST: API call failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return {
        exists: false,
        error: `HTTP ${response.status}: ${errorText}`,
        timing: timingMs,
        data: null
      };
    }
    
    const data = await response.json();
    console.log('📋 EMAIL_TEST: API Response data:', data);
    
    const emailExists = data && data.length > 0;
    
    console.log(`✅ EMAIL_TEST: Direct API call successful - Email exists: ${emailExists}`);
    
    return {
      exists: emailExists,
      error: null,
      timing: timingMs,
      data: data
    };
    
  } catch (error: any) {
    console.error('❌ EMAIL_TEST: Direct API call exception:', error);
    
    return {
      exists: false,
      error: `Direct API exception: ${error.message}`,
      timing: 0,
      data: null
    };
  }
};