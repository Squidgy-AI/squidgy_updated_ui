import { useState } from "react";
import LeftNavigation from "./LeftNavigation";
import AssistantSidebar from "./AssistantSidebar";
import ChatArea from "./ChatArea";
import AssistantDetails from "./AssistantDetails";

export default function MainLayout() {
  const [selectedAssistant, setSelectedAssistant] = useState("SMM Assistant");
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-white">
      {/* Left Navigation - Fixed width */}
      <div className="hidden sm:block">
        <LeftNavigation />
      </div>

      {/* Assistant Sidebar - Fixed width */}
      {isSidebarOpen && (
        <div className="hidden lg:block transition-all duration-300 ease-in-out">
          <AssistantSidebar
            selectedAssistant={selectedAssistant}
            onSelectAssistant={setSelectedAssistant}
          />
        </div>
      )}

      {/* Main Chat Area - Flexible width */}
      <div className="flex-1 flex flex-col">
        <ChatArea
          selectedAssistant={selectedAssistant}
          onToggleDetails={() => setIsDetailsPanelOpen(!isDetailsPanelOpen)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Assistant Details Panel - Fixed width, collapsible */}
      {isDetailsPanelOpen && (
        <div className="hidden xl:block">
          <AssistantDetails
            assistant={selectedAssistant}
            onClose={() => setIsDetailsPanelOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
