import { useState } from "react";

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string, selectedAssistants: string[]) => void;
}

interface Assistant {
  id: string;
  name: string;
  category: string;
  description: string;
  avatar: string;
  isActive: boolean;
}

export default function CreateGroupChatModal({ isOpen, onClose, onCreateGroup }: CreateGroupChatModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(["SMM Assistant"]);
  const [activeTab, setActiveTab] = useState<"ai" | "team">("ai");

  const assistants: Assistant[] = [
    {
      id: "SMM Assistant",
      name: "SMM Assistant",
      category: "Marketing",
      description: "Trend. Post. Analyze.",
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/5de94726d88f958a1bdd5755183ee631960b155f?width=64",
      isActive: true
    },
    {
      id: "Content Strategist",
      name: "Content Strategist",
      category: "Marketing",
      description: "Plan. Write. Repurpose.",
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/fae0953bfe5842c25b1a321c667188d167c18abb?width=64",
      isActive: true
    },
    {
      id: "Lead Generator",
      name: "Lead Generator",
      category: "Sales",
      description: "Find leads fast.",
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/1c1a9e476685a48c996662d5e993f34fffc24ec0?width=64",
      isActive: true
    },
    {
      id: "Personal Assistant",
      name: "Personal Assistant",
      category: "General",
      description: "Always here to help.",
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/67bd34c904bea0de4f9e4c9c66814ba3425c5a06?width=64",
      isActive: true
    },
    {
      id: "CRM Updater",
      name: "CRM Updater",
      category: "Sales",
      description: "Keep data clean.",
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/aba5f5c2e7b9e818f550225ff47becc0bcd708e2?width=64",
      isActive: true
    },
    {
      id: "Recruiter Assistant",
      name: "Recruiter Assistant",
      category: "HR",
      description: "Hire with ease.",
      avatar: "https://api.builder.io/api/v1/image/assets/TEMP/ffe6304047504c08d7faccb66297228d39227080?width=64",
      isActive: true
    }
  ];

  const handleAssistantToggle = (assistantId: string) => {
    setSelectedAssistants(prev => 
      prev.includes(assistantId)
        ? prev.filter(id => id !== assistantId)
        : [...prev, assistantId]
    );
  };

  const handleCreateGroup = () => {
    if (selectedAssistants.length > 0) {
      onCreateGroup(groupName || "New Group Chat", selectedAssistants);
      onClose();
      setGroupName("");
      setSelectedAssistants(["SMM Assistant"]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[480px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.1839 13.7715V12.4889C12.1839 11.8086 11.9137 11.1562 11.4326 10.6751C10.9516 10.1941 10.2991 9.92383 9.6188 9.92383H5.77115C5.09085 9.92383 4.4384 10.1941 3.95735 10.6751C3.47631 11.1562 3.20605 11.8086 3.20605 12.4889V13.7715" stroke="#6017E8" strokeWidth="1.2825" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.69547 7.35872C9.11214 7.35872 10.2606 6.21028 10.2606 4.79362C10.2606 3.37695 9.11214 2.22852 7.69547 2.22852C6.27881 2.22852 5.13037 3.37695 5.13037 4.79362C5.13037 6.21028 6.27881 7.35872 7.69547 7.35872Z" stroke="#6017E8" strokeWidth="1.2825" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Create Group Chat</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <p className="text-xs text-gray-600 mb-6">
            Select AI assistants and team members to add to your group chat
          </p>

          {/* Group Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Chat Name (Optional)
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter a name for this group chat..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-squidgy-primary focus:border-transparent focus:bg-white"
            />
          </div>

          {/* Participants Count */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm text-green-600 font-medium">
              {selectedAssistants.length} participants selected
            </span>
          </div>

          {/* Tabs */}
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-t-lg ${
                activeTab === "ai"
                  ? "bg-squidgy-gradient text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              AI Assistants ({assistants.length})
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-t-lg ${
                activeTab === "team"
                  ? "bg-squidgy-gradient text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Team Members (0)
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search AI Assistants..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-squidgy-primary focus:border-transparent focus:bg-white text-sm"
            />
          </div>

          {/* Assistant List */}
          {activeTab === "ai" && (
            <div className="space-y-3">
              {assistants.map((assistant) => (
                <div
                  key={assistant.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAssistants.includes(assistant.id)
                      ? "border-squidgy-primary bg-squidgy-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleAssistantToggle(assistant.id)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAssistants.includes(assistant.id)
                      ? "border-squidgy-primary bg-squidgy-primary"
                      : "border-gray-300"
                  }`}>
                    {selectedAssistants.includes(assistant.id) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  
                  <img
                    src={assistant.avatar}
                    alt={assistant.name}
                    className="w-10 h-10 rounded-full"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{assistant.name}</h3>
                      {assistant.isActive && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{assistant.category}</p>
                    <p className="text-xs text-gray-500">{assistant.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "team" && (
            <div className="text-center py-8">
              <p className="text-gray-500">No team members available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={selectedAssistants.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedAssistants.length > 0
                ? "bg-squidgy-gradient text-white hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Create Group Chat ({selectedAssistants.length})
          </button>
        </div>
      </div>
    </div>
  );
}
