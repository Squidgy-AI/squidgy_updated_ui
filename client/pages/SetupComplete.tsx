import { useState } from "react";
import { X, Menu, Check, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Chat Interface Component
function ChatInterface({ isActive }: { isActive: boolean }) {
  const messages = [
    {
      type: 'bot',
      content: '👋 Hey, I\'m your new AI Solar Sales agent! Please follow my instructions to complete the setup so I can start sending you sales leads!\n\nFirst, please share your website URL.',
      timestamp: '8 minutes ago'
    },
    {
      type: 'user',
      content: 'rmsenergy.com',
      timestamp: '8 minutes ago'
    },
    {
      type: 'bot',
      content: 'Great! I have pre-filled all the information I need from your website. Please go through the steps to confirm. Feel free to ask for any help or clarification on the setup process.',
      timestamp: '8 minutes ago'
    },
    {
      type: 'bot',
      content: '���🔥🔥 Setup is complete! 🔥🔥🔥\n\nFeel free to ask any further questions relating to setup here. You can also preview the customer-facing sales agent in the "Sales" tab.',
      timestamp: 'Just now'
    }
  ];

  return (
    <div className="w-96 bg-white border border-grey-700 rounded-2xl h-[793px] flex flex-col">
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
            <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-squidgy-purple" fill="none" stroke="currentColor" viewBox="0 0 18 18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.49969 15.0003L11.1515 8.34853C11.4485 8.05152 11.597 7.90301 11.7682 7.84737C11.9189 7.79842 12.0811 7.79842 12.2318 7.84737C12.403 7.90301 12.5515 8.05152 12.8485 8.34853L16.0539 11.5539M7.875 6.375C7.875 7.20343 7.20343 7.875 6.375 7.875C5.54657 7.875 4.875 7.20343 4.875 6.375C4.875 5.54657 5.54657 4.875 6.375 4.875C7.20343 4.875 7.875 5.54657 7.875 6.375ZM16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z" />
              </svg>
            </button>
            <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-squidgy-purple" fill="none" stroke="currentColor" viewBox="0 0 18 18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6.69853C16.5 6.24417 16.5 6.01699 16.4102 5.91179C16.3322 5.82051 16.2152 5.77207 16.0956 5.78149C15.9577 5.79234 15.797 5.95298 15.4757 6.27426L12.75 9L15.4757 11.7257C15.797 12.047 15.9577 12.2077 16.0956 12.2185C16.2152 12.2279 16.3322 12.1795 16.4102 12.0882C16.5 11.983 16.5 11.7558 16.5 11.3015V6.69853ZM1.5 7.35C1.5 6.08988 1.5 5.45982 1.74524 4.97852C1.96095 4.55516 2.30516 4.21095 2.72852 3.99524C3.20982 3.75 3.83988 3.75 5.1 3.75H9.15C10.4101 3.75 11.0402 3.75 11.5215 3.99524C11.9448 4.21095 12.289 4.55516 12.5048 4.97852C12.75 5.45982 12.75 6.08988 12.75 7.35V10.65C12.75 11.9101 12.75 12.5402 12.5048 13.0215C12.289 13.4448 11.9448 13.789 11.5215 14.0048C11.0402 14.25 10.4101 14.25 9.15 14.25H5.1C3.83988 14.25 3.20982 14.25 2.72852 14.0048C2.30516 13.789 1.96095 13.4448 1.74524 13.0215C1.5 12.5402 1.5 11.9101 1.5 10.65V7.35Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <div className="flex bg-grey-900 rounded-lg p-1 relative">
            <div className="flex-1 relative">
              <div className="bg-white border border-grey-500 rounded-lg px-3 py-1.5 text-center">
                <span className="text-text-primary font-semibold text-sm">Setup</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="px-3 py-1.5 text-center">
                <span className="text-text-secondary font-semibold text-sm">Sales</span>
              </div>
            </div>
            {/* Status pill */}
            <div className="absolute -top-3 -right-3">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white ${
                isActive ? 'bg-[#DA078C]' : 'bg-[#444652]'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
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
                  ? 'bg-gray-100 rounded-2xl p-3 max-w-[80%]' 
                  : 'rounded-lg'
              }`}>
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">
                  {message.content}
                </p>
              </div>
              <p className={`text-text-subtle text-xs mt-1 font-semibold ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-grey-700 rounded-b-2xl">
        <div className="flex items-center border border-grey-500T rounded-xl overflow-hidden">
          <input 
            type="text" 
            placeholder="Your message..." 
            className="flex-1 px-3 py-2 text-text-subtle text-base outline-none"
          />
          <button className="bg-squidgy-gradient p-2.5 hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 18 18">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.87464 10.1251L15.7496 2.25013M7.97033 10.3712L9.94141 15.4397C10.1151 15.8862 10.2019 16.1094 10.327 16.1746C10.4354 16.2311 10.5646 16.2312 10.6731 16.1748C10.7983 16.1098 10.8854 15.8866 11.0596 15.4403L16.0023 2.77453C16.1595 2.37164 16.2381 2.1702 16.1951 2.04148C16.1578 1.92969 16.0701 1.84197 15.9583 1.80462C15.8296 1.76162 15.6281 1.84023 15.2252 1.99746L2.55943 6.94021C2.11313 7.11438 1.88997 7.20146 1.82494 7.32664C1.76857 7.43516 1.76864 7.56434 1.82515 7.67279C1.89033 7.7979 2.11358 7.88472 2.56009 8.05836L7.62859 10.0294C7.71923 10.0647 7.76455 10.0823 7.80271 10.1095C7.83653 10.1337 7.86611 10.1632 7.89024 10.1971C7.91746 10.2352 7.93508 10.2805 7.97033 10.3712Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Check Icon Component
function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="#028833" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Main Setup Complete Page Component
export default function SetupComplete() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  const handleGoToDashboard = () => {
    navigate('/');
  };

  const handleClose = () => {
    navigate('/');
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
          
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/864daee3c48065f4ab3fdbb7a217feae74f1f24a?width=188" 
            alt="Squidgy Logo" 
            className="h-8"
          />
        </div>
        <button 
          onClick={handleClose}
          className="text-squidgy-purple font-bold text-sm px-5 py-3 rounded-button hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
      
      {/* Progress Bar - Full */}
      <div className="h-1 bg-grey-800">
        <div className="h-full w-full bg-squidgy-gradient"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="p-5">
          <ChatInterface isActive={isActive} />
        </div>

        {/* Main Form Content */}
        <div className="flex-1 max-w-lg mx-auto p-10 pb-10">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#E5F6EC] rounded-[20px] flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-sm">
              <CheckIcon />
            </div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2 leading-[30px]">Setup complete!</h2>
            <p className="text-text-secondary text-sm leading-5">
              Your AI solar sales agent is ready to bring in new sales leads. Preview the customer-facing agent in the "Sales" tab.
            </p>
          </div>

          {/* Status Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between gap-2 pb-5">
              <div className="flex-1">
                <label className="text-text-primary text-sm font-semibold leading-6">
                  Current sales agent status:
                </label>
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white ${
                isActive ? 'bg-[#DA078C]' : 'bg-[#444652]'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </div>
              <button className="p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-6 h-6 text-text-primary" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button 
                onClick={handleToggleActive}
                className={`w-full font-bold text-sm py-3 px-5 rounded-button transition-all leading-6 ${
                  isActive 
                    ? 'border-2 border-squidgy-purple text-squidgy-purple hover:bg-purple-50'
                    : 'bg-squidgy-gradient text-white hover:opacity-90'
                }`}
              >
                {isActive ? 'Set as inactive' : 'Set as active'}
              </button>
              
              <button 
                onClick={handleGoToDashboard}
                className="w-full border-2 border-squidgy-purple text-squidgy-purple font-bold text-sm py-3 px-5 rounded-button hover:bg-purple-50 transition-colors leading-6"
              >
                Go to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full bg-white w-80">
            <div className="p-4">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mb-4"
              >
                <X className="w-5 h-5 text-text-primary" />
              </button>
              <p className="text-text-primary">Sidebar content placeholder</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
