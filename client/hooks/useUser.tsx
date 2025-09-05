import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../lib/auth-service';
import { supabase } from '../lib/supabase';

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate a UUID v4 compatible user ID
const generateUserId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// User context interface
interface UserContextType {
  userId: string;
  sessionId: string;
  agentId: string;
  setUserId: (userId: string) => void;
  clearUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isReady: boolean;
  isAuthenticated: boolean;
  user: any;
  profile: any;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserIdState] = useState<string>('');
  const [sessionId, setSessionIdState] = useState<string>('');
  const [agentId, setAgentIdState] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Initialize user data on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log('UserProvider: Starting user initialization...');
        
        // Check if we're in development mode
        const isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || 
                             !import.meta.env.VITE_SUPABASE_URL || 
                             import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';
        
        if (isDevelopment) {
          // Development mode - create or use existing dev user
          let devUserId = localStorage.getItem('dev_user_id');
          let devUserEmail = localStorage.getItem('dev_user_email') || 'dmacproject123@gmail.com';
          
          if (!devUserId) {
            devUserId = generateUserId();
            localStorage.setItem('dev_user_id', devUserId);
          }
          
          // Try to fetch profile from Supabase first
          let profileData = null;
          try {
            const { supabase } = await import('../lib/supabase');
            
            // First try by user ID
            let { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', devUserId)
              .single();
              
            if (!data) {
              // If not found by ID, try by email
              const result = await supabase
                .from('profiles')
                .select('*')
                .eq('email', devUserEmail)
                .single();
              data = result.data;
            }
            
            profileData = data;
            console.log('UserProvider: Loaded profile from Supabase:', {
              found_by: data ? 'database' : 'none',
              profile_id: data?.id,
              profile_email: data?.email,
              profile_name: data?.full_name,
              lookup_user_id: devUserId,
              lookup_email: devUserEmail
            });
          } catch (error) {
            console.log('UserProvider: No profile found in Supabase, using defaults:', error);
          }
          
          console.log('UserProvider: Development mode - setting up dev user');
          setIsAuthenticated(true);
          setUser({ id: devUserId, email: devUserEmail });
          setProfile(profileData || { 
            id: devUserId,
            user_id: devUserId, 
            email: devUserEmail,
            full_name: 'Development User',
            profile_avatar_url: ''
          });
          setUserIdState(devUserId);
          setSessionIdState(`session_${devUserId}`);
          setAgentIdState(`agent_${devUserId}`);
          localStorage.setItem('squidgy_user_id', devUserId);
          
          setIsReady(true);
          return;
        }
        
        // Production mode - check Supabase authentication with retry logic
        console.log('UserProvider: Production mode - checking Supabase auth');
        
        let retryCount = 0;
        const maxRetries = 3;
        let authResult = null;
        
        while (retryCount < maxRetries && !authResult) {
          try {
            const { user: authUser, profile: userProfile } = await authService.getCurrentUser();
            
            if (authUser) {
              // Wait for profile if user exists but profile is missing
              if (!userProfile) {
                console.log('UserProvider: User found but profile missing, waiting...');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Try to get profile again
                const { profile: retryProfile } = await authService.getCurrentUser();
                authResult = { user: authUser, profile: retryProfile };
              } else {
                authResult = { user: authUser, profile: userProfile };
              }
            }
            break;
          } catch (error) {
            retryCount++;
            console.log(`UserProvider: Auth check attempt ${retryCount} failed:`, error);
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        if (authResult?.user) {
          console.log('UserProvider: User authenticated', { hasProfile: !!authResult.profile });
          setIsAuthenticated(true);
          setUser(authResult.user);
          setProfile(authResult.profile);
          
          const currentUserId = authResult.profile?.user_id || authResult.user.id;
          setUserIdState(currentUserId);
          localStorage.setItem('squidgy_user_id', currentUserId);
          
          const currentAgentId = `agent_${currentUserId}`;
          setAgentIdState(currentAgentId);
        } else {
          console.log('UserProvider: No authenticated user found');
          setIsAuthenticated(false);
          setUser(null);
          setProfile(null);
        }
        
        // Generate session ID
        let currentSessionId = localStorage.getItem('squidgy_session_id');
        if (!currentSessionId) {
          currentSessionId = generateSessionId();
          localStorage.setItem('squidgy_session_id', currentSessionId);
        }
        setSessionIdState(currentSessionId);

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        
        // In production, don't fallback to dev mode - set as unauthenticated
        const isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || 
                             !import.meta.env.VITE_SUPABASE_URL || 
                             import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';
        
        if (isDevelopment) {
          // Fallback to development mode only in dev environment
          let devUserId = localStorage.getItem('dev_user_id');
          let devUserEmail = localStorage.getItem('dev_user_email') || 'dmacproject123@gmail.com';
          
          if (!devUserId) {
            devUserId = generateUserId();
            localStorage.setItem('dev_user_id', devUserId);
          }
          
          console.log('UserProvider: Fallback to development mode');
          setIsAuthenticated(true);
          setUser({ id: devUserId, email: devUserEmail });
          setProfile({ user_id: devUserId, full_name: 'Development User' });
          setUserIdState(devUserId);
          localStorage.setItem('squidgy_user_id', devUserId);
          
          const currentAgentId = `agent_${devUserId}`;
          setAgentIdState(currentAgentId);
        } else {
          // Production - set as unauthenticated
          setIsAuthenticated(false);
          setUser(null);
          setProfile(null);
        }
        
        setIsReady(true);
      }
    };

    initializeUser();

    // Listen for auth state changes only in production mode
    let subscription: any = null;
    
    const isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || 
                         !import.meta.env.VITE_SUPABASE_URL || 
                         import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';
        if (!isDevelopment) {
      try {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('UserProvider: Auth state change:', event, !!session);
          
          if (event === 'SIGNED_IN' && session?.user) {
            try {
              console.log('UserProvider: User signed in, fetching profile...');
              
              // Wait a bit for profile to be created if it's a new user
              await new Promise(resolve => setTimeout(resolve, 500));
              
              const { user: authUser, profile: userProfile } = await authService.getCurrentUser();
              
              // If profile is missing, wait and try again
              if (authUser && !userProfile) {
                console.log('UserProvider: Profile missing, retrying...');
                await new Promise(resolve => setTimeout(resolve, 1000));
                const { profile: retryProfile } = await authService.getCurrentUser();
                
                setIsAuthenticated(true);
                setUser(authUser);
                setProfile(retryProfile);
                
                const currentUserId = retryProfile?.user_id || authUser.id;
                setUserIdState(currentUserId);
                localStorage.setItem('squidgy_user_id', currentUserId);
                
                const currentAgentId = `agent_${currentUserId}`;
                setAgentIdState(currentAgentId);
              } else {
                setIsAuthenticated(true);
                setUser(authUser);
                setProfile(userProfile);
                
                const currentUserId = userProfile?.user_id || authUser?.id;
                if (currentUserId) {
                  setUserIdState(currentUserId);
                  localStorage.setItem('squidgy_user_id', currentUserId);
                  
                  const currentAgentId = `agent_${currentUserId}`;
                  setAgentIdState(currentAgentId);
                }
              }
              
              console.log('UserProvider: Auth state updated successfully');
            } catch (error) {
              console.error('Error handling auth state change:', error);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('UserProvider: User signed out');
            setIsAuthenticated(false);
            setUser(null);
            setProfile(null);
            setUserIdState('');
            setAgentIdState('');
            localStorage.removeItem('squidgy_user_id');
          }
        });
        subscription = data.subscription;
      } catch (error) {
        console.error('Error setting up auth listener:', error);
      }
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const setUserId = (newUserId: string) => {
    console.log('UserProvider: setUserId called with:', newUserId);
    
    // Don't update if it's the same user ID to prevent unnecessary re-renders
    if (newUserId === userId) {
      console.log('UserProvider: Same user ID, skipping update');
      return;
    }
    
    setUserIdState(newUserId);
    localStorage.setItem('squidgy_user_id', newUserId);
    
    const newAgentId = `agent_${newUserId}`;
    setAgentIdState(newAgentId);
    
    // Update authentication state for development users
    const isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || 
                         !import.meta.env.VITE_SUPABASE_URL || 
                         import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';
    
    if (isDevelopment && newUserId) {
      const devUserEmail = localStorage.getItem('dev_user_email') || 'dmacproject123@gmail.com';
      const devUserName = localStorage.getItem('dev_user_name') || 'Development User';
      const devUserAvatar = localStorage.getItem('dev_user_avatar') || '';
      console.log('UserProvider: Updating auth state for dev user with localStorage data');
      setIsAuthenticated(true);
      setUser({ id: newUserId, email: devUserEmail });
      setProfile({ 
        user_id: newUserId, 
        full_name: devUserName,
        profile_avatar_url: devUserAvatar
      });
    }
  };

  const clearUser = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    
    setUserIdState('');
    setSessionIdState('');
    setAgentIdState('');
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('squidgy_user_id');
    localStorage.removeItem('squidgy_session_id');
    localStorage.removeItem('dev_user_id');
    localStorage.removeItem('dev_user_email');
    setIsReady(true); // Keep ready state true to prevent re-initialization
  };

  // Add refresh function to reload profile from database
  const refreshProfile = async () => {
    if (!userId) return;
    
    try {
      const { supabase } = await import('../lib/supabase');
      
      // Try to fetch updated profile from database
      let { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!data) {
        // If not found by ID, try by email
        const userEmail = user?.email || localStorage.getItem('dev_user_email');
        if (userEmail) {
          const result = await supabase
            .from('profiles')
            .select('*')
            .eq('email', userEmail)
            .single();
          data = result.data;
        }
      }
      
      if (data) {
        console.log('UserProvider: Profile refreshed from database:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('UserProvider: Failed to refresh profile:', error);
    }
  };

  const value = {
    isAuthenticated,
    isReady,
    user,
    profile,
    userId,
    sessionId,
    agentId,
    setUserId,
    clearUser,
    refreshProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
