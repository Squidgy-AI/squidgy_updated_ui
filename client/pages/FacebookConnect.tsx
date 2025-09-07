// client/pages/FacebookConnect.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import SetupStepsSidebar from '../components/SetupStepsSidebar';
import FacebookSetup from '../components/FacebookSetup';

export default function FacebookConnect() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId } = useUser();

  const handleComplete = () => {
    // Navigate to dashboard or next step after Facebook setup
    console.log('✅ Facebook setup completed!');
    navigate('/dashboard');
  };

  const handleSkip = () => {
    // Skip Facebook setup and go to dashboard
    console.log('⏭️ Facebook setup skipped');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-light-bg flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <SetupStepsSidebar
        currentStep={6}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <FacebookSetup 
              onComplete={handleComplete}
              onSkip={handleSkip}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}