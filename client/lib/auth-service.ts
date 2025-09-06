// src/lib/auth-service.ts
import { supabase } from './supabase';
import { Profile } from './supabase';
import { v4 as uuidv4 } from 'uuid';

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

export class AuthService {
  
  // Email validation helper
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation helper
  private isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Sign up user
  async signUp(userData: SignUpData): Promise<{ user: any; profile?: Profile; needsEmailConfirmation?: boolean; message?: string }> {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') {
        throw new Error('Supabase is not configured. Please add your Supabase credentials to the .env file.');
      }

      // Validate input
      if (!this.isValidEmail(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!this.isValidPassword(userData.password)) {
        throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
      }

      if (!userData.fullName || userData.fullName.trim().length < 2) {
        throw new Error('Full name must be at least 2 characters');
      }

      // Check if email already exists in profiles table
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userData.email.toLowerCase());

      if (checkError) {
        console.error('Error checking existing email:', checkError);
        throw new Error('Unable to verify email availability. Please try again.');
      } 
      
      if (existingProfiles && existingProfiles.length > 0) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      }

      // Create auth user with email confirmation
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/confirm-signup`
        : `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/auth/confirm-signup`;
        
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.toLowerCase(),
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName.trim(),
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) {
        console.error('Supabase Auth Error:', authError);
        if (authError.message.includes('rate limit') || 
            authError.message.includes('too many requests') ||
            authError.message.includes('429')) {
          throw new Error('Too many attempts. Please wait 5-10 minutes and try again.');
        }
        if (authError.message.includes('already registered') || 
            authError.message.includes('already been registered') ||
            authError.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        }
        if (authError.message.includes('invalid email')) {
          throw new Error('Please enter a valid email address.');
        }
        throw new Error(`Signup failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create profile immediately after user creation
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            user_id: uuidv4(),
            email: authData.user.email,
            full_name: userData.fullName.trim(),
            role: 'member',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      } catch (profileCreationError) {
        console.error('Error creating profile:', profileCreationError);
      }
      
      return {
        user: authData.user,
        needsEmailConfirmation: !authData.session,
        message: !authData.session 
          ? 'Account created successfully! Please check your email and click the confirmation link to verify your account.'
          : 'Account created and verified successfully!'
      };

    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  }

  // Sign in user
  async signIn(credentials: SignInData): Promise<{ user: any; profile?: Profile; needsEmailConfirmation?: boolean }> {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') {
        throw new Error('Supabase is not configured. Please add your Supabase credentials to the .env file.');
      }

      // Validate input
      if (!this.isValidEmail(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!credentials.password) {
        throw new Error('Password is required');
      }

      // Attempt sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email.toLowerCase(),
        password: credentials.password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        if (authError.message.includes('rate limit') || 
            authError.message.includes('too many requests') ||
            authError.message.includes('429')) {
          throw new Error('Too many login attempts. Please wait 5-10 minutes and try again.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to sign in');
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.warn('Failed to load user profile:', profileError);
      }

      return {
        user: authData.user,
        profile: profile || undefined
      };

    } catch (error: any) {
      console.error('Signin error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      // Validate email
      if (!this.isValidEmail(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Use Supabase Auth's built-in password reset
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/reset-password`
        : `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/reset-password`;
        
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email.toLowerCase(),
        {
          redirectTo: redirectUrl,
        }
      );

      if (resetError) {
        console.error('Reset password error:', resetError);
        throw new Error(resetError.message || 'Failed to send password reset email');
      }

      return { message: 'If an account exists with this email, a password reset link has been sent.' };

    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      // Validate new password
      if (!this.isValidPassword(data.newPassword)) {
        throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
      }

      // When using Supabase's built-in password reset flow,
      // the user should already be authenticated via the magic link
      // Just update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (updateError) {
        throw updateError;
      }

      return { message: 'Password reset successfully' };

    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Signout error:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Get current user session
  async getCurrentUser(): Promise<{ user: any; profile: Profile | null }> {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('getCurrentUser timeout')), 3000);
      });

      const authPromise = supabase.auth.getUser();
      
      const { data: { user }, error: userError } = await Promise.race([authPromise, timeoutPromise]) as any;
      
      if (userError) {
        throw userError;
      }

      if (!user) {
        return { user: null, profile: null };
      }

      // Try to get profile but don't fail if it doesn't exist
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.warn('Profile not found, continuing with user only:', profileError);
          return { user, profile: null };
        }

        return { user, profile };
      } catch (profileError) {
        console.warn('Profile fetch failed, continuing with user only:', profileError);
        return { user, profile: null };
      }

    } catch (error: any) {
      console.error('Get current user error:', error);
      return { user: null, profile: null };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
