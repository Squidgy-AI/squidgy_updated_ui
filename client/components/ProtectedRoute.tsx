import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isReady } = useUser();

  console.log('ProtectedRoute: Using UserProvider state:', { isAuthenticated, isReady });

  // Show loading spinner while user context is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  const isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || 
                       !import.meta.env.VITE_SUPABASE_URL || 
                       import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';

  // In development mode, always allow access
  if (!isAuthenticated && !isDevelopment) {
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated or in development
  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};
