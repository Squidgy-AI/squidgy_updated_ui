import { useNavigate } from "react-router-dom";

export default function LeftNavigation() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/welcome');
  };

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      // await authService.signOut();
      console.log('Logout successful, redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login even if logout fails
      navigate('/login');
    }
  };
  return (
    <div className="w-[57px] h-full flex flex-col border-r border-border-purple bg-white">
      {/* Top section with navigation items */}
      <div className="flex-1 flex flex-col pt-7 pr-1 gap-1">
        {/* Chat icon - active */}
        <div className="flex flex-col items-center px-2.5 py-2">
          <div className="flex justify-center items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H6L2 22Z" fill="url(#paint0_linear_chat)"/>
              <defs>
                <linearGradient id="paint0_linear_chat" x1="2" y1="2" x2="21.1521" y2="22.7814" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FB252A"/>
                  <stop offset="0.5" stopColor="#A61D92"/>
                  <stop offset="1" stopColor="#6017E8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-squidgy-primary text-[9px] font-normal leading-4 text-center">Chats</span>
        </div>
        
        {/* Home icon */}
        <button onClick={handleHomeClick} className="flex flex-col items-center px-1 py-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_home)">
              <path d="M11.2499 21.3746V15.7496H15.7499V21.3746C15.7499 21.9933 16.2562 22.4996 16.8749 22.4996H20.2499C20.8687 22.4996 21.3749 21.9933 21.3749 21.3746V13.4996H23.2874C23.8049 13.4996 24.0524 12.8583 23.6587 12.5208L14.2537 4.04957C13.8262 3.66707 13.1737 3.66707 12.7462 4.04957L3.34118 12.5208C2.95868 12.8583 3.19493 13.4996 3.71243 13.4996H5.62493V21.3746C5.62493 21.9933 6.13118 22.4996 6.74993 22.4996H10.1249C10.7437 22.4996 11.2499 21.9933 11.2499 21.3746Z" fill="url(#paint0_linear_home)"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_home" x1="3.15234" y1="3.7627" x2="20.8629" y2="24.9935" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB252A"/>
                <stop offset="0.5" stopColor="#A61D92"/>
                <stop offset="1" stopColor="#6017E8"/>
              </linearGradient>
              <clipPath id="clip0_home">
                <rect width="27" height="27" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <span className="text-squidgy-primary text-[9px] font-normal leading-4 text-center w-[46px]">Home</span>
        </button>
        
        {/* Menu icon */}
        <div className="flex flex-col items-center px-1 py-2">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 12H21.5M3.5 6H21.5M3.5 18H21.5" stroke="url(#paint0_linear_menu)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="paint0_linear_menu" x1="3.5" y1="6" x2="13.7851" y2="22.74" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB252A"/>
                <stop offset="0.5" stopColor="#A61D92"/>
                <stop offset="1" stopColor="#6017E8"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="text-squidgy-primary text-[9px] font-normal leading-4 text-center w-[46px]">Menu</span>
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
      </div>
      
      {/* Bottom section */}
      <div className="flex flex-col">
        {/* Log out */}
        <button onClick={handleLogout} className="flex flex-col items-center px-1 py-4 justify-end hover:bg-gray-100 rounded-lg transition-colors">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.375 21.875H5.20833C4.6558 21.875 4.12589 21.6555 3.73519 21.2648C3.34449 20.8741 3.125 20.3442 3.125 19.7917V5.20833C3.125 4.6558 3.34449 4.12589 3.73519 3.73519C4.12589 3.34449 4.6558 3.125 5.20833 3.125H9.375M16.6667 17.7083L21.875 12.5M21.875 12.5L16.6667 7.29167M21.875 12.5H9.375" stroke="url(#paint0_linear_logout)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="paint0_linear_logout" x1="3.125" y1="3.125" x2="21.0801" y2="22.6076" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FB252A"/>
                <stop offset="0.5" stopColor="#A61D92"/>
                <stop offset="1" stopColor="#6017E8"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="text-squidgy-primary text-[9px] font-normal leading-4 text-center w-[46px]">Log Out</span>
        </button>
        
        {/* Profile */}
        <div className="flex flex-col items-center px-1 py-4 justify-end">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/50df51a52344836e4abaf581e6adf4669f2e4fe5?width=64" 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
          <span className="text-text-secondary text-[9px] font-normal leading-4 text-center w-[46px]">WasteLess</span>
        </div>
      </div>
    </div>
  );
}
