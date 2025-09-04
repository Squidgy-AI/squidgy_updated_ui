import { useState, useEffect } from "react";
import { X, Menu, Building, Trash2, Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../components/ChatInterface";

// Setup Steps Sidebar Component
function SetupStepsSidebar() {
  const steps = [
    { id: 1, label: "1. Website details", status: "completed" },
    { id: 2, label: "2. Business details", status: "current" },
    { id: 3, label: "3. Solar setup", status: "future" },
    { id: 4, label: "4. Calendar setup", status: "future" },
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


// Main Business Details Page Component
export default function BusinessDetails() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyNumbers, setEmergencyNumbers] = useState(['888-683-3631']);
  const [addressMethod, setAddressMethod] = useState('manual'); // 'lookup' or 'manual'

  const addEmergencyNumber = () => {
    setEmergencyNumbers([...emergencyNumbers, '']);
  };

  const removeEmergencyNumber = (index: number) => {
    if (emergencyNumbers.length > 1) {
      setEmergencyNumbers(emergencyNumbers.filter((_, i) => i !== index));
    }
  };

  const updateEmergencyNumber = (index: number, value: string) => {
    const updated = [...emergencyNumbers];
    updated[index] = value;
    setEmergencyNumbers(updated);
  };

  const handleContinue = () => {
    navigate('/solar-setup');
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
        <div className="h-full w-64 bg-squidgy-gradient"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="p-5">
          <ChatInterface 
            agentName="Seth agent"
            agentDescription="Business Setup Assistant"
            context="business_setup"
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
                <Building className="w-6 h-6 text-squidgy-purple" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">2. Business details</h2>
              <p className="text-text-secondary text-sm">
                Please review the business details, you only need to do this for the very first agent you set up.
              </p>
            </div>

            {/* Business Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Business name</label>
              <input
                type="text"
                defaultValue="RMS Energy Ltd."
                className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* Business Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Business email</label>
              <div className="relative">
                <input
                  type="email"
                  defaultValue="info@rmsenergy.com"
                  className="w-full p-3 pl-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Phone number</label>
              <div className="relative">
                <input
                  type="tel"
                  defaultValue="888-683-3630"
                  className="w-full p-3 pl-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            {/* 24/7 Emergency Numbers */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">24/7 emergency number (optional)</label>
              {emergencyNumbers.map((number, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={number}
                      onChange={(e) => updateEmergencyNumber(index, e.target.value)}
                      className="w-full p-3 pl-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  {emergencyNumbers.length > 1 && (
                    <button
                      onClick={() => removeEmergencyNumber(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEmergencyNumber}
                className="flex items-center gap-2 text-squidgy-purple font-semibold text-sm hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Country */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Country</label>
              <div className="relative">
                <select className="w-full p-3 pl-10 pr-10 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent appearance-none">
                  <option value="US">🇺🇸 United States</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                </select>
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.914a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Address Details */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-4">Address details</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="addressMethod"
                    value="lookup"
                    checked={addressMethod === 'lookup'}
                    onChange={(e) => setAddressMethod(e.target.value)}
                    className="w-4 h-4 text-squidgy-purple border-gray-300 focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary text-sm">Address lookup</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="addressMethod"
                    value="manual"
                    checked={addressMethod === 'manual'}
                    onChange={(e) => setAddressMethod(e.target.value)}
                    className="w-4 h-4 text-squidgy-purple border-gray-300 focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary text-sm">Add manually</span>
                </label>
              </div>
            </div>

            {/* Address Fields */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Address</label>
              <input
                type="text"
                defaultValue="15396 183rd St Little Falls, MN 56345"
                className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* City */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">City</label>
              <input
                type="text"
                defaultValue="Little Falls"
                className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* State */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">State</label>
              <input
                type="text"
                defaultValue="Minnesota"
                className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* Postal Code */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-text-primary mb-2">Postal code</label>
              <input
                type="text"
                defaultValue="56345"
                className="w-full p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
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
