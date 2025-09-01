import { useState } from "react";
import { X, Menu, Calendar, ChevronDown, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Setup Steps Sidebar Component
function SetupStepsSidebar() {
  const steps = [
    { id: 1, label: "1. Website details", status: "completed" },
    { id: 2, label: "2. Business details", status: "completed" },
    { id: 3, label: "3. Solar setup", status: "completed" },
    { id: 4, label: "4. Calendar setup", status: "current" },
    { id: 5, label: "5. Notifications preferences", status: "future" },
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

// Business Hours Component
function BusinessHours() {
  const [businessHours, setBusinessHours] = useState({
    monday: { enabled: true, start: '9:00', end: '17:00' },
    tuesday: { enabled: true, start: '9:00', end: '17:00' },
    wednesday: { enabled: true, start: '9:00', end: '17:00' },
    thursday: { enabled: true, start: '9:00', end: '17:00' },
    friday: { enabled: true, start: '9:00', end: '17:00' },
    saturday: { enabled: false, start: '9:00', end: '17:00' },
    sunday: { enabled: false, start: '9:00', end: '17:00' },
  });

  const toggleDay = (day: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        enabled: !prev[day as keyof typeof prev].enabled
      }
    }));
  };

  const updateTime = (day: string, field: 'start' | 'end', value: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="space-y-4">
      {days.map(({ key, label }) => (
        <div key={key}>
          <label className="flex items-center gap-3 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={businessHours[key as keyof typeof businessHours].enabled}
              onChange={() => toggleDay(key)}
              className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
            />
            <span className="text-text-primary font-medium">{label}</span>
          </label>
          
          {businessHours[key as keyof typeof businessHours].enabled && (
            <div className="ml-8 flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-text-secondary mb-1">Starts</label>
                <div className="relative">
                  <input
                    type="time"
                    value={businessHours[key as keyof typeof businessHours].start}
                    onChange={(e) => updateTime(key, 'start', e.target.value)}
                    className="w-full p-3 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm text-text-secondary mb-1">Ends</label>
                <div className="relative">
                  <input
                    type="time"
                    value={businessHours[key as keyof typeof businessHours].end}
                    onChange={(e) => updateTime(key, 'end', e.target.value)}
                    className="w-full p-3 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Main Calendar Setup Page Component
export default function CalendarSetup() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [allowRescheduling, setAllowRescheduling] = useState(true);
  const [allowCancellations, setAllowCancellations] = useState(true);

  const handleContinue = () => {
    navigate('/notifications-preferences');
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
        <div className="h-full bg-squidgy-gradient" style={{ width: '480px' }}></div>
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
                <Calendar className="w-6 h-6 text-squidgy-purple" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">4. Calendar setup</h2>
              <p className="text-text-secondary text-sm">
                Please review how appointments and calls will function in your calendar.
              </p>
            </div>

            {/* Calendar Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Calendar name</label>
              <input
                type="text"
                defaultValue="Solar consultations"
                className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Description</label>
              <textarea
                className="w-full h-20 p-3 border border-grey-500 rounded-md text-text-primary text-base resize-none focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                defaultValue="Schedule solar consultations and site visits with potential customers."
              />
            </div>

            {/* Call Duration and Max Calls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Call duration</label>
                <div className="relative">
                  <select className="w-full p-3 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent appearance-none">
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60" selected>60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Max calls per day</label>
                <div className="relative">
                  <select className="w-full p-3 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent appearance-none">
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8" selected>8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Rules Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Rules</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Notice (hours)</label>
                  <input
                    type="number"
                    defaultValue="24"
                    className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Book ahead (days)</label>
                  <input
                    type="number"
                    defaultValue="24"
                    className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoConfirm}
                    onChange={(e) => setAutoConfirm(e.target.checked)}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Auto-confirm appointments</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowRescheduling}
                    onChange={(e) => setAllowRescheduling(e.target.checked)}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Allow rescheduling</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowCancellations}
                    onChange={(e) => setAllowCancellations(e.target.checked)}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Allow cancellations</span>
                </label>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Business hours</h3>
              <BusinessHours />
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
