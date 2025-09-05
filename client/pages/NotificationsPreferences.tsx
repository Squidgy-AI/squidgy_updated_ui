import { useState } from "react";
import { X, Menu, Bell, HelpCircle, Mail, MessageCircle, MessageSquare, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../components/ChatInterface";
import { UserAccountDropdown } from "../components/UserAccountDropdown";

// Setup Steps Sidebar Component
function SetupStepsSidebar() {
  const steps = [
    { id: 1, label: "1. Website details", status: "completed" },
    { id: 2, label: "2. Business details", status: "completed" },
    { id: 3, label: "3. Solar setup", status: "completed" },
    { id: 4, label: "4. Calendar setup", status: "completed" },
    { id: 5, label: "5. Notifications preferences", status: "current" },
    { id: 6, label: "6. Connect to Facebook", status: "future" },
  ];

  return (
    <div className="w-80 bg-white border-l border-grey-700 h-full flex flex-col p-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Setup steps</h3>
      </div>
      
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
              step.status === "current"
                ? "border-squidgy-purple bg-white"
                : step.status === "completed"
                ? "border-green-500 bg-white"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="p-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  step.status === "current" 
                    ? "bg-squidgy-purple" 
                    : step.status === "completed"
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
            </div>
            <span
              className={`text-sm ${
                step.status === "current" || step.status === "completed" 
                  ? "text-text-primary" 
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
            {step.status === "completed" && (
              <button className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 4.5L4.75 11L1.25 7.5" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// Notification Channel Component
function NotificationChannel({ 
  icon, 
  title, 
  subtitle, 
  enabled, 
  selected, 
  onToggle 
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  enabled: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div 
      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
        selected && enabled 
          ? 'border-squidgy-purple bg-purple-50' 
          : enabled 
          ? 'border-gray-200 hover:border-gray-300' 
          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
      }`}
      onClick={enabled ? onToggle : undefined}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
        selected && enabled 
          ? 'bg-squidgy-purple text-white' 
          : enabled 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-300 text-gray-500'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold ${enabled ? 'text-text-primary' : 'text-gray-400'}`}>
          {title}
        </h4>
        <p className={`text-sm ${enabled ? 'text-text-secondary' : 'text-gray-400'}`}>
          {subtitle}
        </p>
      </div>
      {enabled && (
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          selected 
            ? 'bg-squidgy-purple border-squidgy-purple' 
            : 'border-gray-300'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 12 12">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 3.5L5 7l-1.5-1.5" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}

// Main Notifications Preferences Page Component
export default function NotificationsPreferences() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationChannels, setNotificationChannels] = useState({
    email: true,
    messenger: true,
    sms: false,
    whatsapp: false,
    ghl: false,
  });
  const [notificationTypes, setNotificationTypes] = useState({
    confirmations: true,
    reminders: true,
    cancellations: true,
  });

  const toggleChannel = (channel: string) => {
    setNotificationChannels(prev => ({
      ...prev,
      [channel]: !prev[channel as keyof typeof prev]
    }));
  };

  const toggleNotificationType = (type: string) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
  };

  const handleContinue = () => {
    navigate('/facebook-connect');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 bg-white border-b border-grey-700 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
          
          <div className="w-6 h-6 bg-squidgy-gradient rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-bold text-lg text-text-primary">Squidgy</span>
          <UserAccountDropdown />
        </div>
        <button className="text-squidgy-purple font-bold text-sm px-5 py-3 rounded-button hover:bg-gray-50 transition-colors">
          Close (save draft)
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-grey-800">
        <div className="h-full bg-squidgy-gradient" style={{ width: '600px' }}></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="p-5">
          <ChatInterface 
            agentName="Seth agent"
            agentDescription="Notifications Setup Assistant"
            context="notifications_setup"
          />
        </div>

        {/* Main Form Content */}
        <div className="flex-1 max-w-2xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-text-primary mb-8">Create an agent</h1>
          </div>

          {/* Form */}
          <div className="max-w-lg mx-auto">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-squidgy-purple" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">5. Notifications preferences</h2>
              <p className="text-text-secondary text-sm">
                Please review how you will receive notifications.
              </p>
            </div>

            {/* Notification Channels */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Notification channels</h3>
              <div className="grid grid-cols-1 gap-3">
                <NotificationChannel
                  icon={<Mail className="w-6 h-6" />}
                  title="Email"
                  subtitle="Professional email notifications"
                  enabled={true}
                  selected={notificationChannels.email}
                  onToggle={() => toggleChannel('email')}
                />
                
                <NotificationChannel
                  icon={<MessageCircle className="w-6 h-6" />}
                  title="Facebook Messenger"
                  subtitle="Chat via Facebook Messenger"
                  enabled={true}
                  selected={notificationChannels.messenger}
                  onToggle={() => toggleChannel('messenger')}
                />
                
                <NotificationChannel
                  icon={<MessageSquare className="w-6 h-6" />}
                  title="SMS"
                  subtitle="Text messages (coming soon)"
                  enabled={false}
                  selected={notificationChannels.sms}
                  onToggle={() => toggleChannel('sms')}
                />
                
                <NotificationChannel
                  icon={<Smartphone className="w-6 h-6" />}
                  title="WhatsApp"
                  subtitle="WhatsApp business (coming soon)"
                  enabled={false}
                  selected={notificationChannels.whatsapp}
                  onToggle={() => toggleChannel('whatsapp')}
                />
                
                <NotificationChannel
                  icon={
                    <div className="w-6 h-6 bg-current rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-white">G</span>
                    </div>
                  }
                  title="GHL app"
                  subtitle="GoHighLevel app (coming soon)"
                  enabled={false}
                  selected={notificationChannels.ghl}
                  onToggle={() => toggleChannel('ghl')}
                />
              </div>
            </div>

            {/* Email for Notifications */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Email for notifications</label>
              <div className="relative">
                <input
                  type="email"
                  defaultValue="info@rmsenergy.com"
                  className="w-full p-3 pl-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Notification Types */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Notification types</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationTypes.confirmations}
                    onChange={() => toggleNotificationType('confirmations')}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Appointment confirmations</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationTypes.reminders}
                    onChange={() => toggleNotificationType('reminders')}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Appointment reminders (24h before)</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationTypes.cancellations}
                    onChange={() => toggleNotificationType('cancellations')}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Cancellations and reschedules</span>
                </label>
              </div>
            </div>

            {/* Continue Button */}
            <button 
              onClick={handleContinue}
              className="w-full bg-squidgy-gradient text-white font-bold text-sm py-3 px-5 rounded-button hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 21 21">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.83333 10.1123H17.1667M17.1667 10.1123L12.1667 5.1123M17.1667 10.1123L12.1667 15.1123" />
              </svg>
            </button>
          </div>
        </div>

        {/* Setup Steps Sidebar */}
        <div className="hidden lg:block">
          <SetupStepsSidebar />
        </div>
      </div>

      {/* Mobile Setup Steps Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full">
            <SetupStepsSidebar />
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
