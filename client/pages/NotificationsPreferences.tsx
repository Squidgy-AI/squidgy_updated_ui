import { useState } from "react";
import { X, Menu, Bell, Mail, MessageCircle, Smartphone, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// Chat Interface Component
function ChatInterface() {
  const messages = [
    {
      type: 'bot',
      content: '👋 Hey, I\'m your new AI Solar Sales agent! Please follow my instructions to complete the setup so I can start sending you sales leads!\n\nFirst, please share your website URL.',
      timestamp: '4 minutes ago'
    },
    {
      type: 'user',
      content: 'rmsenergy.com',
      timestamp: '2 minutes ago'
    },
    {
      type: 'bot',
      content: 'Great! I have pre-filled all the information I need from your website. Please go through the steps to confirm. Feel free to ask for any help or clarification on the setup process.',
      timestamp: '2 minutes ago'
    }
  ];

  return (
    <div className="w-96 bg-white border border-grey-700 rounded-modal h-[793px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-grey-700">
        <h3 className="text-2xl font-semibold text-text-primary text-center">Set up your AI agent</h3>
      </div>

      {/* Agent Header */}
      <div className="p-4 border-b border-grey-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
            <span className="text-white font-semibold">☀️</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary">Solar sales agent</h4>
            <p className="text-text-subtle text-sm">rmsenergy.com</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-squidgy-purple" fill="none" stroke="currentColor" viewBox="0 0 18 18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.49969 15.0003L11.1515 8.34853C11.4485 8.05152 11.597 7.90301 11.7682 7.84737C11.9189 7.79842 12.0811 7.79842 12.2318 7.84737C12.403 7.90301 12.5515 8.05152 12.8485 8.34853L16.0539 11.5539M7.875 6.375C7.875 7.20343 7.20343 7.875 6.375 7.875C5.54657 7.875 4.875 7.20343 4.875 6.375C4.875 5.54657 5.54657 4.875 6.375 4.875C7.20343 4.875 7.875 5.54657 7.875 6.375ZM16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-squidgy-purple" fill="none" stroke="currentColor" viewBox="0 0 18 18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6.69853C16.5 6.24417 16.5 6.01699 16.4102 5.91179C16.3322 5.82051 16.2152 5.77207 16.0956 5.78149C15.9577 5.79234 15.797 5.95298 15.4757 6.27426L12.75 9L15.4757 11.7257C15.797 12.047 15.9577 12.2077 16.0956 12.2185C16.2152 12.2279 16.3322 12.1795 16.4102 12.0882C16.5 11.983 16.5 11.7558 16.5 11.3015V6.69853ZM1.5 7.35C1.5 6.08988 1.5 5.45982 1.74524 4.97852C1.96095 4.55516 2.30516 4.21095 2.72852 3.99524C3.20982 3.75 3.83988 3.75 5.1 3.75H9.15C10.4101 3.75 11.0402 3.75 11.5215 3.99524C11.9448 4.21095 12.289 4.55516 12.5048 4.97852C12.75 5.45982 12.75 6.08988 12.75 7.35V10.65C12.75 11.9101 12.75 12.5402 12.5048 13.0215C12.289 13.4448 11.9448 13.789 11.5215 14.0048C11.0402 14.25 10.4101 14.25 9.15 14.25H5.1C3.83988 14.25 3.20982 14.25 2.72852 14.0048C2.30516 13.789 1.96095 13.4448 1.74524 13.0215C1.5 12.5402 1.5 11.9101 1.5 10.65V7.35Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`${
              message.type === 'user' ? 'ml-8 flex flex-col items-end' : 'mr-8'
            }`}>
              <div className={`${
                message.type === 'user' 
                  ? 'bg-gray-100 rounded-xl p-3 max-w-[80%]' 
                  : 'bg-gray-50 rounded-lg p-3'
              }`}>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">
                  {message.content}
                </p>
              </div>
              <p className={`text-text-subtle text-xs mt-1 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-grey-700">
        <div className="flex items-center gap-2 border border-grey-500 rounded-xl p-2">
          <input 
            type="text" 
            placeholder="Your message..." 
            className="flex-1 px-3 py-2 text-text-primary text-base outline-none"
          />
          <button className="bg-squidgy-gradient p-2 rounded-lg hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 18 18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.87464 10.1251L15.7496 2.25013M7.97033 10.3712L9.94141 15.4397C10.1151 15.8862 10.2019 16.1094 10.327 16.1746C10.4354 16.2311 10.5646 16.2312 10.6731 16.1748C10.7983 16.1098 10.8854 15.8866 11.0596 15.4403L16.0023 2.77453C16.1595 2.37164 16.2381 2.1702 16.1951 2.04148C16.1578 1.92969 16.0701 1.84197 15.9583 1.80462C15.8296 1.76162 15.6281 1.84023 15.2252 1.99746L2.55943 6.94021C2.11313 7.11438 1.88997 7.20146 1.82494 7.32664C1.76857 7.43516 1.76864 7.56434 1.82515 7.67279C1.89033 7.7979 2.11358 7.88472 2.56009 8.05836L7.62859 10.0294C7.71923 10.0647 7.76455 10.0823 7.80271 10.1095C7.83653 10.1337 7.86611 10.1632 7.89024 10.1971C7.91746 10.2352 7.93508 10.2805 7.97033 10.3712Z" />
            </svg>
          </button>
        </div>
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
          <ChatInterface />
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
