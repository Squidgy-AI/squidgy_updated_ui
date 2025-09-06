import { useState } from "react";
import { X, Menu, Calendar, HelpCircle, Clock, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../components/ChatInterface";
import { UserAccountDropdown } from "../components/UserAccountDropdown";
import { useUser } from "../hooks/useUser";
import { saveCalendarSetup } from "../lib/api";
import { toast } from "sonner";

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


// Business Hours Component
function BusinessHours({ businessHours, setBusinessHours }: {
  businessHours: Record<string, { enabled: boolean; start: string; end: string }>;
  setBusinessHours: (hours: Record<string, { enabled: boolean; start: string; end: string }>) => void;
}) {

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
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [calendarName, setCalendarName] = useState('Solar consultations');
  const [description, setDescription] = useState('Schedule solar consultations and site visits with potential customers.');
  const [callDuration, setCallDuration] = useState(60);
  const [maxCallsPerDay, setMaxCallsPerDay] = useState(8);
  const [noticeHours, setNoticeHours] = useState(24);
  const [bookAheadDays, setBookAheadDays] = useState(24);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [allowRescheduling, setAllowRescheduling] = useState(true);
  const [allowCancellations, setAllowCancellations] = useState(true);
  const [businessHours, setBusinessHours] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' },
  });

  const handleContinue = async () => {
    if (!user?.id) {
      toast.error('Please log in to continue');
      return;
    }

    setIsLoading(true);
    
    try {
      const calendarSetupData = {
        firm_user_id: user.id,
        agent_id: 'SOL',
        calendar_name: calendarName,
        description: description,
        call_duration: callDuration,
        max_calls_per_day: maxCallsPerDay,
        notice_hours: noticeHours,
        book_ahead_days: bookAheadDays,
        auto_confirm: autoConfirm,
        allow_rescheduling: allowRescheduling,
        allow_cancellations: allowCancellations,
        business_hours: businessHours,
        setup_status: 'completed'
      };

      const result = await saveCalendarSetup(calendarSetupData);
      
      if (result.success) {
        toast.success('Calendar setup saved successfully!');
        navigate('/notifications-preferences');
      } else {
        toast.error('Failed to save calendar setup');
      }
    } catch (error: any) {
      console.error('Calendar setup save error:', error);
      toast.error(error.message || 'Failed to save calendar setup');
    } finally {
      setIsLoading(false);
    }
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
        <div className="h-full bg-squidgy-gradient" style={{ width: '480px' }}></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="p-5">
          <ChatInterface 
            agentName="Seth agent"
            agentDescription="Calendar Setup Assistant"
            context="calendar_setup"
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
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
                className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Description</label>
              <textarea
                className="w-full h-20 p-3 border border-grey-500 rounded-md text-text-primary text-base resize-none focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Call Duration and Max Calls */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Call duration</label>
                <div className="relative">
                  <select 
                    value={callDuration}
                    onChange={(e) => setCallDuration(parseInt(e.target.value))}
                    className="w-full p-3 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent appearance-none"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Max calls per day</label>
                <div className="relative">
                  <select
                    value={maxCallsPerDay}
                    onChange={(e) => setMaxCallsPerDay(parseInt(e.target.value))}
                    className="w-full p-3 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent appearance-none"
                  >
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
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
                    value={noticeHours}
                    onChange={(e) => setNoticeHours(parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Book ahead (days)</label>
                  <input
                    type="number"
                    value={bookAheadDays}
                    onChange={(e) => setBookAheadDays(parseInt(e.target.value) || 0)}
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
              <BusinessHours businessHours={businessHours} setBusinessHours={setBusinessHours} />
            </div>

            {/* Continue Button */}
            <button 
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-squidgy-gradient text-white font-bold text-sm py-3 px-5 rounded-button hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Continue'}
              {!isLoading && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 21 21">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.83333 10.1123H17.1667M17.1667 10.1123L12.1667 5.1123M17.1667 10.1123L12.1667 15.1123" />
                </svg>
              )}
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
