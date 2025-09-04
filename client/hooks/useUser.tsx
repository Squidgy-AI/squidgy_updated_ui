import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../lib/auth-service';
import { supabase } from '../lib/supabase';

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate a unique user ID
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// User context interface
interface UserContextType {
  userId: string;
  sessionId: string;
  agentId: string;
  setUserId: (userId: string) => void;
  clearUser: () => void;
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
        // Check authentication first
        const { user: authUser, profile: userProfile } = await authService.getCurrentUser();
        
        if (authUser) {
          setIsAuthenticated(true);
          setUser(authUser);
          setProfile(userProfile);
          
          // Use authenticated user's ID
          const currentUserId = userProfile?.user_id || authUser.id;
          setUserIdState(currentUserId);
          localStorage.setItem('squidgy_user_id', currentUserId);
          
          // Generate agent ID based on user ID
          const currentAgentId = `agent_${currentUserId}`;
          setAgentIdState(currentAgentId);
        } else {
          // Not authenticated - clear any stored data
          setIsAuthenticated(false);
          setUser(null);
          setProfile(null);
          localStorage.removeItem('squidgy_user_id');
          localStorage.removeItem('squidgy_session_id');
        }

        // Always generate/get session ID for tracking
        let currentSessionId = localStorage.getItem('squidgy_session_id');
        if (!currentSessionId) {
          currentSessionId = generateSessionId();
          localStorage.setItem('squidgy_session_id', currentSessionId);
        }
        setSessionIdState(currentSessionId);

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize user:', error);
        setIsAuthenticated(false);
        setIsReady(true);
      }
    };

    initializeUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { user: authUser, profile: userProfile } = await authService.getCurrentUser();
        setIsAuthenticated(true);
        setUser(authUser);
        setProfile(userProfile);
        
        const currentUserId = userProfile?.user_id || authUser.id;
        setUserIdState(currentUserId);
        localStorage.setItem('squidgy_user_id', currentUserId);
        
        const currentAgentId = `agent_${currentUserId}`;
        setAgentIdState(currentAgentId);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
        setUserIdState('');
        setAgentIdState('');
        localStorage.removeItem('squidgy_user_id');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUserId = (newUserId: string) => {
    setUserIdState(newUserId);
    localStorage.setItem('squidgy_user_id', newUserId);
    
    // Update agent ID when user ID changes
    const newAgentId = `agent_${newUserId}`;
    setAgentIdState(newAgentId);
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
    setIsReady(false);
  };

  return (
    <UserContext.Provider value={{ 
      userId, 
      sessionId, 
      agentId, 
      setUserId, 
      clearUser, 
      isReady,
      isAuthenticated,
      user,
      profile
    }}>
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
