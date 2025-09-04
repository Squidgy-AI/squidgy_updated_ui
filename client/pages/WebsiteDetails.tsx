import { useState } from "react";
import { X, Menu, Globe, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../components/ChatInterface";
import { useUser } from "@/hooks/useUser";
import { websiteApi, agentApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

// Tag Chip Component
function TagChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md">
      <span className="px-3 py-1.5 text-sm text-text-primary">{label}</span>
      <button
        onClick={onRemove}
        className="p-2 hover:bg-gray-200 rounded-r-md transition-colors"
      >
        <X className="w-4 h-4 text-text-primary" />
      </button>
    </div>
  );
}

// Setup Steps Sidebar Component
function SetupStepsSidebar() {
  const steps = [
    { id: 1, label: "Website details", status: "current" },
    { id: 2, label: "2. Business details", status: "future" },
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
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="p-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  step.status === "current" ? "bg-squidgy-purple" : "bg-gray-400"
                }`}
              />
            </div>
            <span
              className={`text-sm ${
                step.status === "current" ? "text-text-primary" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


// Main Website Details Page Component
export default function WebsiteDetails() {
  const navigate = useNavigate();
  const { userId, sessionId, agentId, isReady } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("rmsenergy.com");
  const [companyDescription, setCompanyDescription] = useState(
    "RMS Energy is a leading provider of comprehensive, safety-first power solutions across the electrical grid. Their breadth of technical expertise, commitment to safety, and dedication to transparent communication make them the trusted partner for organizations navigating dynamic energy needs."
  );
  const [valueProposition, setValueProposition] = useState(
    "Client-Centric Approach with core values of agility, safety, integrity, and teamwork; Engineering-Focused Organization run by practicing engineers; Comprehensive Solutions from planning to implementation; Cutting-Edge Training and Technology with industry-leading computational environment."
  );
  const [businessNiche, setBusinessNiche] = useState(
    "Turn-key solutions provider to the power industry, serving utilities, commercial, industrial, renewable, data center, and government clients across the U.S., focusing on critical infrastructure including substation design, commissioning, equipment upgrades, and system protection."
  );
  const [tags, setTags] = useState([
    "Substation design",
    "Commissioning", 
    "Equipment upgrades",
    "System protection",
    "Utilities",
    "Commercial",
    "Industrial",
    "Renewable",
    "Data center",
    "Government"
  ]);
  const [newTag, setNewTag] = useState("");

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleAnalyzeWebsite = async () => {
    if (!isReady || !websiteUrl.trim()) return;
    
    setLoading(true);
    try {
      const result = await websiteApi.analyzeWebsite({
        url: websiteUrl,
        user_id: userId,
        session_id: sessionId
      });
      
      // Update form fields with analysis results if available
      if (result.company_description) setCompanyDescription(result.company_description);
      if (result.value_proposition) setValueProposition(result.value_proposition);
      if (result.business_niche) setBusinessNiche(result.business_niche);
      if (result.tags && Array.isArray(result.tags)) setTags(result.tags);
      
      toast({
        title: "Website analyzed successfully",
        description: "Form fields have been updated with the analysis results."
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!isReady) return;
    
    setLoading(true);
    try {
      // Save website analysis data
      const setupData = {
        website_url: websiteUrl,
        company_description: companyDescription,
        value_proposition: valueProposition,
        business_niche: businessNiche,
        tags: tags
      };
      
      await agentApi.createSetup({
        user_id: userId,
        agent_id: agentId,
        agent_name: "Solar Sales Agent",
        setup_data: setupData,
        setup_type: "BusinessSetup"
      });
      
      toast({
        title: "Website details saved",
        description: "Moving to business details..."
      });
      
      navigate('/business-details');
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save website details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
        </div>
        <button className="text-squidgy-purple font-bold text-sm px-5 py-3 rounded-button hover:bg-gray-50 transition-colors">
          Close (save draft)
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-grey-800">
        <div className="h-full w-32 bg-squidgy-gradient"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="p-5">
          <ChatInterface 
            agentName="Seth agent"
            agentDescription="Website Setup Assistant"
            context="website_setup"
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
                <Globe className="w-6 h-6 text-squidgy-purple" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">1. Website details</h2>
              <p className="text-text-secondary text-sm">
                Please review if information from your website accurately describes your business. Edit if necessary.
              </p>
            </div>

            {/* Screenshot Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Screenshot</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f4d168c44c076c21cd4c9f5f8d6e8c8c8cb1fbed?width=840"
                  alt="RMS Energy website screenshot"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Website URL Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Website URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1 p-3 border border-grey-500 rounded-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  placeholder="Enter website URL"
                />
                <button
                  onClick={handleAnalyzeWebsite}
                  disabled={loading || !websiteUrl.trim() || !isReady}
                  className="px-4 py-3 bg-squidgy-gradient text-white font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>

            {/* What the company does */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">What the company does</label>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                className="w-full h-32 p-3 border border-grey-500 rounded-md text-text-primary text-base resize-none focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* Value proposition */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Value proposition (AI generated)</label>
              <textarea
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                className="w-full h-36 p-3 border border-grey-500 rounded-md text-text-primary text-base resize-none focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* Business niche */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Business niche</label>
              <textarea
                value={businessNiche}
                onChange={(e) => setBusinessNiche(e.target.value)}
                className="w-full h-32 p-3 border border-grey-500 rounded-md text-text-primary text-base resize-none focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
              />
            </div>

            {/* Tags Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-2">Tags</label>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Start typing to add more..."
                  className="w-full p-3 pr-10 border border-grey-500 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-primary hover:text-squidgy-purple transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <TagChip
                    key={index}
                    label={tag}
                    onRemove={() => removeTag(index)}
                  />
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={loading || !isReady}
              className="w-full bg-squidgy-gradient text-white font-bold text-sm py-3 px-5 rounded-button hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}
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
