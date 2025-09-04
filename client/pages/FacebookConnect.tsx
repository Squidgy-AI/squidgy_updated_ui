import { useState } from "react";
import { X, Menu, Facebook, Check, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../components/ChatInterface";

// Setup Steps Sidebar Component
function SetupStepsSidebar() {
  const steps = [
    { id: 1, label: "Website details", status: "completed" },
    { id: 2, label: "2. Business details", status: "completed" },
    { id: 3, label: "3. Solar setup", status: "completed" },
    { id: 4, label: "4. Calendar setup", status: "completed" },
    { id: 5, label: "5. Notifications preferences", status: "completed" },
    { id: 6, label: "6. Connect to Facebook", status: "current" },
  ];

  return (
    <div className="w-96 bg-white h-full flex flex-col">
      <div className="flex-1 border-l border-grey-700 p-5">
        <div className="pt-10 pb-5">
          <h3 className="text-lg font-semibold text-text-primary">Setup steps</h3>
        </div>
        
        <div className="space-y-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                step.status === "current"
                  ? "border-2 border-squidgy-purple"
                  : "border border-grey-700T"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {step.status === "completed" ? (
                  <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : step.status === "current" ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-squidgy-purple ml-1.25" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 ml-1.25" />
                )}
                <span className="text-sm text-text-primary">
                  {step.label}
                </span>
              </div>
              {step.status === "completed" && (
                <Edit className="w-4 h-4 text-squidgy-purple" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// Facebook Icon Component
function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 12C23 5.92533 18.0747 1 12 1C5.92533 1 1 5.92533 1 12C1 17.4899 5.02194 22.0409 10.2814 22.867V15.1804H7.4877V12H10.2814V9.57601C10.2814 6.81943 11.9242 5.29574 14.4364 5.29574C15.6399 5.29574 16.899 5.51076 16.899 5.51076V8.21783H15.5115C14.1455 8.21783 13.7186 9.06553 13.7186 9.93644V12H16.7691L16.2818 15.1804H13.7186V22.867C18.9781 22.0425 23 17.4915 23 12Z" fill="#1977F3"/>
      <path d="M16.2818 15.1804L16.7691 12H13.7186V9.93644C13.7186 9.06708 14.144 8.21783 15.5115 8.21783H16.899V5.51076C16.899 5.51076 15.6399 5.29574 14.4364 5.29574C11.9242 5.29574 10.2814 6.81789 10.2814 9.57601V12H7.4877V15.1804H10.2814V22.867C10.8414 22.9551 11.4153 23 12 23C12.5847 23 13.1586 22.9536 13.7186 22.867V15.1804H16.2818Z" fill="white"/>
    </svg>
  );
}

// Info Icon Component
function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.99999 13.3332V9.99984M9.99999 6.6665H10.0083M18.3333 9.99984C18.3333 14.6022 14.6024 18.3332 9.99999 18.3332C5.39762 18.3332 1.66666 14.6022 1.66666 9.99984C1.66666 5.39746 5.39762 1.6665 9.99999 1.6665C14.6024 1.6665 18.3333 5.39746 18.3333 9.99984Z" stroke="#5E17EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// External Link Icon Component  
function ExternalLinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 7.50001L17.5 2.50001M17.5 2.50001H12.5M17.5 2.50001L10 10M8.33333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V11.6667" stroke="#91929A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Loading Icon Component
function LoadingIcon() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5" stroke="#91929A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Main Facebook Connect Page Component
export default function FacebookConnect() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'instructions' | 'confirmation'>('selection');
  const [selectedPages, setSelectedPages] = useState<string[]>(['RMS Energy Ltd.']);
  const [loginConfirmed, setLoginConfirmed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const facebookPages = [
    'RMS Energy Ltd.',
    'Fido fan page', 
    'Pottery daily'
  ];

  const handlePageToggle = (page: string) => {
    setSelectedPages(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  const handleFacebookLogin = () => {
    // Open Facebook login in new window
    window.open('https://facebook.com/login', '_blank');
    setCurrentStep('confirmation');
  };

  const handleConnectFinish = () => {
    if (currentStep === 'selection') {
      setCurrentStep('instructions');
    } else if (currentStep === 'confirmation' && loginConfirmed === true) {
      setIsLoading(true);
      // Simulate completion
      setTimeout(() => {
        navigate('/setup-complete');
      }, 2000);
    }
  };

  const handleNext = () => {
    if (loginConfirmed === true) {
      setCurrentStep('selection');
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
          
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/864daee3c48065f4ab3fdbb7a217feae74f1f24a?width=188" 
            alt="Squidgy Logo" 
            className="h-8"
          />
        </div>
        <button className="text-squidgy-purple font-bold text-sm px-5 py-3 rounded-button hover:bg-gray-50 transition-colors">
          Close (save draft)
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-grey-800">
        <div className="h-full bg-squidgy-gradient" style={{ width: '84.7%' }}></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="p-5">
          <ChatInterface 
            agentName="Seth agent"
            agentDescription="Facebook Setup Assistant"
            context="facebook_setup"
          />
        </div>

        {/* Main Form Content */}
        <div className="flex-1 max-w-lg mx-auto p-10 pb-10">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-100 rounded-[20px] flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-sm">
              <FacebookIcon />
            </div>
            <h2 className="text-[22px] font-semibold text-text-primary mb-2 leading-8">Connect to Facebook</h2>
            <p className="text-text-secondary text-sm leading-5">
              Connect to reach your sales leads on Facebook
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-5">
            {/* Page Selection State */}
            {currentStep === 'selection' && (
              <>
                {/* Logged in as */}
                <div className="flex items-center justify-between pb-5">
                  <div className="flex-1">
                    <p className="text-text-subtle text-sm mb-1.5">Logged in as:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                      <span className="text-squidgy-purple text-base font-semibold underline">Joanne Smith</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-text-primary text-sm font-bold border border-grey-500T rounded-[6px] hover:bg-gray-50 transition-colors">
                    Log out
                  </button>
                </div>

                {/* Page Selection */}
                <div className="pb-5">
                  <label className="block text-text-primary text-sm font-semibold mb-2 leading-6">
                    Select the Facebook pages you want to connect to
                  </label>
                  <div className="space-y-0">
                    {facebookPages.map((page) => (
                      <div key={page} className="flex items-center gap-2 py-3 pr-2">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={page}
                            checked={selectedPages.includes(page)}
                            onChange={() => handlePageToggle(page)}
                            className="sr-only"
                          />
                          <div 
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                              selectedPages.includes(page)
                                ? 'bg-squidgy-purple border-squidgy-purple'
                                : 'bg-white border-text-primary'
                            }`}
                            onClick={() => handlePageToggle(page)}
                          >
                            {selectedPages.includes(page) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <label 
                          htmlFor={page}
                          className="text-text-primary text-base leading-6 cursor-pointer flex-1"
                        >
                          {page}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connect Button */}
                <button 
                  onClick={handleConnectFinish}
                  className="w-full bg-squidgy-gradient text-white font-bold text-sm py-3 px-5 rounded-button hover:opacity-90 transition-opacity leading-6"
                >
                  Connect & Finish
                </button>
              </>
            )}

            {/* Instructions State */}
            {currentStep === 'instructions' && (
              <>
                {/* Alert */}
                <div className="border border-squidgy-purple bg-primary-600 rounded-lg p-1 mb-5">
                  <div className="flex items-center gap-2 p-1.5">
                    <InfoIcon />
                    <p className="text-text-primary text-sm flex-1">
                      Click the button below to log into your Facebook account in a separate window. Return to this page after.
                    </p>
                  </div>
                </div>

                {/* Login Button */}
                <div className="pb-5">
                  <button 
                    onClick={handleFacebookLogin}
                    className="w-full bg-text-disabled text-text-disabled font-bold text-sm py-3 px-5 rounded-button flex items-center justify-center gap-2 leading-6 cursor-not-allowed"
                    disabled
                  >
                    Log into Facebook
                    <ExternalLinkIcon />
                  </button>
                </div>

                {/* Confirmation Question */}
                <div className="pb-5">
                  <label className="block text-text-primary text-sm font-semibold mb-2 leading-6">
                    Did you successfully log into Facebook?
                  </label>
                  <div className="space-y-0">
                    <div className="flex items-center gap-2 py-3 pr-3">
                      <div className="relative">
                        <input
                          type="radio"
                          name="loginSuccess"
                          value="yes"
                          checked={loginConfirmed === true}
                          onChange={() => setLoginConfirmed(true)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-5 h-5 rounded-full border-2 border-text-disabled flex items-center justify-center cursor-pointer ${
                            loginConfirmed === true ? 'bg-white' : 'bg-white'
                          }`}
                          onClick={() => setLoginConfirmed(true)}
                        >
                          {loginConfirmed === true && (
                            <div className="w-2.5 h-2.5 rounded-full bg-text-disabled"></div>
                          )}
                        </div>
                      </div>
                      <label className="text-text-primary text-base leading-6 cursor-pointer flex-1">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center gap-2 py-3 pr-3">
                      <div className="relative">
                        <input
                          type="radio"
                          name="loginSuccess"
                          value="no"
                          checked={loginConfirmed === false}
                          onChange={() => setLoginConfirmed(false)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-5 h-5 rounded-full border-2 border-text-disabled flex items-center justify-center cursor-pointer ${
                            loginConfirmed === false ? 'bg-white' : 'bg-white'
                          }`}
                          onClick={() => setLoginConfirmed(false)}
                        >
                          {loginConfirmed === false && (
                            <div className="w-2.5 h-2.5 rounded-full bg-text-disabled"></div>
                          )}
                        </div>
                      </div>
                      <label className="text-text-primary text-base leading-6 cursor-pointer flex-1">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button 
                  onClick={handleNext}
                  disabled={loginConfirmed === null}
                  className="w-full bg-text-disabled text-text-disabled font-bold text-sm py-3 px-5 rounded-button flex items-center justify-center gap-2 leading-6 cursor-not-allowed"
                >
                  Next
                  {isLoading && <LoadingIcon />}
                </button>
              </>
            )}

            {/* Confirmation State */}
            {currentStep === 'confirmation' && (
              <>
                {/* Alert */}
                <div className="border border-squidgy-purple bg-primary-600 rounded-lg p-1 mb-5">
                  <div className="flex items-center gap-2 p-1.5">
                    <InfoIcon />
                    <p className="text-text-primary text-sm flex-1">
                      Click the button below to log into your Facebook account in a separate window. Return to this page after.
                    </p>
                  </div>
                </div>

                {/* Login Button */}
                <div className="pb-5">
                  <button 
                    onClick={handleFacebookLogin}
                    className="w-full bg-squidgy-gradient text-white font-bold text-sm py-3 px-5 rounded-button hover:opacity-90 transition-opacity flex items-center justify-center gap-2 leading-6"
                  >
                    Log into Facebook
                    <ExternalLinkIcon />
                  </button>
                </div>

                {/* Confirmation Question */}
                <div className="pb-5">
                  <label className="block text-text-primary text-sm font-semibold mb-2 leading-6">
                    Did you successfully log into Facebook?
                  </label>
                  <div className="space-y-0">
                    <div className="flex items-center gap-2 py-3 pr-3">
                      <div className="relative">
                        <input
                          type="radio"
                          name="loginSuccess"
                          value="yes"
                          checked={loginConfirmed === true}
                          onChange={() => setLoginConfirmed(true)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-5 h-5 rounded-full border-2 border-squidgy-purple flex items-center justify-center cursor-pointer ${
                            loginConfirmed === true ? 'bg-white' : 'bg-white'
                          }`}
                          onClick={() => setLoginConfirmed(true)}
                        >
                          {loginConfirmed === true && (
                            <div className="w-2.5 h-2.5 rounded-full bg-squidgy-purple"></div>
                          )}
                        </div>
                      </div>
                      <label className="text-text-primary text-base leading-6 cursor-pointer flex-1">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center gap-2 py-3 pr-3">
                      <div className="relative">
                        <input
                          type="radio"
                          name="loginSuccess"
                          value="no"
                          checked={loginConfirmed === false}
                          onChange={() => setLoginConfirmed(false)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-5 h-5 rounded-full border-2 border-squidgy-purple flex items-center justify-center cursor-pointer ${
                            loginConfirmed === false ? 'bg-white' : 'bg-white'
                          }`}
                          onClick={() => setLoginConfirmed(false)}
                        >
                          {loginConfirmed === false && (
                            <div className="w-2.5 h-2.5 rounded-full bg-squidgy-purple"></div>
                          )}
                        </div>
                      </div>
                      <label className="text-text-primary text-base leading-6 cursor-pointer flex-1">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button 
                  onClick={handleNext}
                  disabled={loginConfirmed === null}
                  className={`w-full font-bold text-sm py-3 px-5 rounded-button flex items-center justify-center gap-2 leading-6 ${
                    loginConfirmed === null 
                      ? 'bg-text-disabled text-text-disabled cursor-not-allowed'
                      : 'bg-squidgy-gradient text-white hover:opacity-90 transition-opacity'
                  }`}
                >
                  Next
                  {isLoading && <LoadingIcon />}
                </button>
              </>
            )}
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
