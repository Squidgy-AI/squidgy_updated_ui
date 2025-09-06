import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { X, Menu, Globe, ChevronDown, Loader2 } from "lucide-react";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { useUser } from '../hooks/useUser';
import { websiteApi, callN8NWebhook, saveWebsiteAnalysis, getWebsiteAnalysis, getProfileUserId } from '../lib/api';
import { ChatInterface } from '../components/ChatInterface';
import { UserAccountDropdown } from '../components/UserAccountDropdown';
import { SetupStepsSidebar } from '../components/SetupStepsSidebar';

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



// Main Website Details Page Component
export default function WebsiteDetails() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, sessionId, agentId, isReady } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [businessNiche, setBusinessNiche] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  
  // Load existing data on mount
  useEffect(() => {
    const loadExistingData = async () => {
      if (user?.email && !dataLoaded) {
        console.log('🔍 WebsiteDetails: Getting user_id for email:', user.email);
        
        // Get the correct user_id from profiles table using email
        const profileUserId = await getProfileUserId(user.email);
        if (!profileUserId) {
          console.error('❌ WebsiteDetails: No user_id found for email:', user.email);
          return;
        }
        
        console.log('✅ WebsiteDetails: Using user_id:', profileUserId);
        const existingData = await getWebsiteAnalysis(profileUserId);
        console.log('🔍 WebsiteDetails: Loaded existing data:', existingData);
        
        if (existingData) {
          setWebsiteUrl(existingData.website_url || "");
          setCompanyDescription(existingData.company_description || "");
          setValueProposition(existingData.value_proposition || "");
          setBusinessNiche(existingData.business_niche || "");
          setTags(existingData.tags || []);
          setScreenshotUrl(existingData.screenshot_url || "");
          setFaviconUrl(existingData.favicon_url || "");
          setDataLoaded(true);
        } else {
          console.log('🔍 WebsiteDetails: No existing data found');
          setDataLoaded(true);
        }
      }
    };
    
    loadExistingData();
  }, [user?.email, dataLoaded]);

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  // Helper function to parse agent response and extract business information
  const parseAgentResponse = (agentResponse: string) => {
    try {
      // Clean the response by removing screenshot and favicon links
      let cleanedResponse = agentResponse;
      
      // Remove screenshot links and references
      cleanedResponse = cleanedResponse.replace(/screenshot.*?(?:can be (?:viewed|accessed|found)|is available).*?\[here\]\([^)]+\)[^.]*\./gi, '');
      cleanedResponse = cleanedResponse.replace(/(?:I have also captured|captured) a screenshot.*?\[here\]\([^)]+\)[^.]*\./gi, '');
      cleanedResponse = cleanedResponse.replace(/screenshot.*?https?:\/\/[^\s)]+(?:screenshots|favicons)[^\s)]*[^.]*\./gi, '');
      
      // Remove favicon links and references  
      cleanedResponse = cleanedResponse.replace(/favicon.*?(?:can be (?:viewed|accessed|found)|is available).*?\[here\]\([^)]+\)[^.]*\./gi, '');
      cleanedResponse = cleanedResponse.replace(/(?:and the |the )?favicon.*?\[here\]\([^)]+\)[^.]*\./gi, '');
      cleanedResponse = cleanedResponse.replace(/favicon.*?https?:\/\/[^\s)]+(?:screenshots|favicons)[^\s)]*[^.]*\./gi, '');
      
      // Remove any remaining Supabase storage links
      cleanedResponse = cleanedResponse.replace(/https?:\/\/[^\s]*supabase[^\s]*(?:screenshots|favicons)[^\s]*/gi, '');
      
      // Look for company description
      const companyMatch = cleanedResponse.match(/company name:\s*([^|]+)/i) || 
                          cleanedResponse.match(/description:\s*([^|]+)/i) ||
                          cleanedResponse.match(/what.*company.*does[:\s]*([^|]+)/i);
      
      // Look for value proposition/takeaways
      const valueMatch = cleanedResponse.match(/takeaways:\s*([^|]+)/i) ||
                        cleanedResponse.match(/value proposition[:\s]*([^|]+)/i);
      
      // Look for business niche
      const nicheMatch = cleanedResponse.match(/niche:\s*([^|]+)/i) ||
                        cleanedResponse.match(/market[:\s]*([^|]+)/i);
      
      // Look for tags and limit to top 5
      const tagsMatch = cleanedResponse.match(/tags:\s*([^|]+)/i);
      let extractedTags: string[] = [];
      if (tagsMatch && tagsMatch[1]) {
        const allTags = tagsMatch[1].split(/[,.]/).map(tag => tag.trim()).filter(tag => tag.length > 0);
        // Limit to top 5 tags only
        extractedTags = allTags.slice(0, 5);
      }

      // Extract screenshot URL but don't include Supabase storage links in the cleaned response
      const screenshotMatch = agentResponse.match(/(https?:\/\/[^\s]+\.(png|jpg|jpeg|webp))/i);
      
      return {
        companyDescription: companyMatch ? companyMatch[1].trim() : null,
        valueProposition: valueMatch ? valueMatch[1].trim() : null,
        businessNiche: nicheMatch ? nicheMatch[1].trim() : null,
        tags: extractedTags.length > 0 ? extractedTags : null,
        screenshotUrl: screenshotMatch ? screenshotMatch[1] : null
      };
    } catch (error) {
      console.error('Error parsing agent response:', error);
      return {
        companyDescription: null,
        valueProposition: null,
        businessNiche: null,
        tags: null,
        screenshotUrl: null
      };
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
      // Ensure URL has protocol and www
      let formattedUrl = websiteUrl;
      
      // Add https:// if no protocol
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // Add www. if not present (but skip for subdomains)
      const urlObj = new URL(formattedUrl);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Only add www. if:
      // 1. It doesn't already have www.
      // 2. It's not already a subdomain (no dots before the main domain)
      // 3. It's not localhost or an IP address
      if (!hostname.startsWith('www.') && 
          hostname.split('.').length === 2 && // Only domain.tld format
          !hostname.includes('localhost') &&
          !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) { // Not an IP address
        urlObj.hostname = `www.${hostname}`;
        formattedUrl = urlObj.toString();
      }
      
      if (!user?.email) {
        toast({
          title: "Authentication required",
          description: "Please log in to analyze websites",
          variant: "destructive"
        });
        return;
      }

      // Get the correct user_id from profiles table using email
      const profileUserId = await getProfileUserId(user.email);
      if (!profileUserId) {
        toast({
          title: "User profile not found",
          description: "Unable to find user profile. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      // Generate unique IDs for the N8N request
      const requestId = crypto.randomUUID();
      const currentTime = new Date().toISOString();

      // Prepare N8N webhook payload
      const n8nPayload = {
        user_id: profileUserId,
        user_mssg: formattedUrl, // Send the website URL as the message
        session_id: `${sessionId}_SOL_${Date.now()}`,
        agent_name: "SOL", // Using SOL as specified
        timestamp_of_call_made: currentTime,
        request_id: requestId
      };

      console.log('Sending N8N webhook request:', n8nPayload);
      
      // Call N8N webhook
      const n8nResponse = await callN8NWebhook(n8nPayload);
      
      console.log('N8N webhook response:', n8nResponse);
      
      // Parse the agent response to extract business information
      if (n8nResponse.agent_response) {
        const parsedData = parseAgentResponse(n8nResponse.agent_response);
        
        // Update form fields with extracted data
        if (parsedData.companyDescription) {
          setCompanyDescription(parsedData.companyDescription);
        }
        if (parsedData.valueProposition) {
          setValueProposition(parsedData.valueProposition);
        }
        if (parsedData.businessNiche) {
          setBusinessNiche(parsedData.businessNiche);
        }
        if (parsedData.tags) {
          setTags(parsedData.tags);
        }
        
        // Update screenshot if URL is provided
        if (parsedData.screenshotUrl) {
          const screenshotElement = document.querySelector('img[alt="RMS Energy website screenshot"]') as HTMLImageElement;
          if (screenshotElement) {
            screenshotElement.src = parsedData.screenshotUrl;
            screenshotElement.alt = `${websiteUrl} website screenshot`;
          }
        }
        
        toast({
          title: "Website analyzed successfully",
          description: "Form fields have been updated with AI analysis results."
        });
      } else {
        throw new Error('No agent response received from N8N webhook');
      }
    } catch (error) {
      console.error('Website analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Listen for website analysis completion from chat
  useEffect(() => {
    const handleWebsiteAnalysisComplete = (event: CustomEvent) => {
      const { url, result } = event.detail;
      
      // Update URL field if it matches
      if (url) {
        setWebsiteUrl(url);
      }
      
      // Update form fields with analysis results if available
      if (result.company_description) setCompanyDescription(result.company_description);
      if (result.value_proposition) setValueProposition(result.value_proposition);
      if (result.business_niche) setBusinessNiche(result.business_niche);
      if (result.tags && Array.isArray(result.tags)) setTags(result.tags);
      
      // Update screenshot if URL changed
      if (result.screenshot_url) {
        // Update the screenshot in the UI
        const screenshotElement = document.querySelector('img[alt="RMS Energy website screenshot"]') as HTMLImageElement;
        if (screenshotElement) {
          screenshotElement.src = result.screenshot_url;
          screenshotElement.alt = `${url} website screenshot`;
        }
      }
      
      toast({
        title: "Website analyzed successfully",
        description: "Form fields have been updated with the analysis results from chat."
      });
    };

    window.addEventListener('websiteAnalysisComplete', handleWebsiteAnalysisComplete as EventListener);
    
    return () => {
      window.removeEventListener('websiteAnalysisComplete', handleWebsiteAnalysisComplete as EventListener);
    };
  }, [toast]);

  const handleContinue = async () => {
    if (!isReady || !user?.email) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 WebsiteDetails Save: Getting user_id for email:', user.email);
      
      // Get the correct user_id from profiles table using email
      const profileUserId = await getProfileUserId(user.email);
      if (!profileUserId) {
        toast({
          title: "User profile not found",
          description: "Unable to save. Please contact support.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      console.log('✅ WebsiteDetails Save: Using user_id:', profileUserId);
      
      // Save website analysis data to database
      toast({
        title: "Saving website analysis...",
        description: "Storing your business information"
      });

      const websiteAnalysisData = {
        firm_user_id: profileUserId, // Use profileUserId as firm_user_id
        agent_id: 'SOL',
        website_url: websiteUrl.startsWith('http') ? websiteUrl : `https://www.${websiteUrl}`,
        company_description: companyDescription.trim() || null,
        value_proposition: valueProposition.trim() || null,
        business_niche: businessNiche.trim() || null,
        tags: tags.length > 0 ? tags : null,
        screenshot_url: screenshotUrl.trim() || null, // Capture screenshot URL
        favicon_url: faviconUrl.trim() || null, // Capture favicon URL
        analysis_status: 'completed'
      };

      await saveWebsiteAnalysis(websiteAnalysisData);
      
      toast({
        title: "Website analysis saved!",
        description: "Your business information has been stored successfully"
      });

      // Step 2: Create GHL Sub-account and User (existing logic)
      toast({
        title: "Creating Go High Level account...",
        description: "Setting up your CRM integration"
      });

      const ghlResult = await createGHLAccount(profileUserId);
      
      if (ghlResult.success) {
        // Step 3: Setup Facebook Integration
        toast({
          title: "Setting up Facebook integration...",
          description: "Connecting your social media"
        });

        await setupFacebookIntegration(ghlResult.credentials);
      }
      
      toast({
        title: "Agent setup complete!",
        description: "Your Solar Sales Agent is ready to use"
      });
      
      navigate('/business-details');
    } catch (error) {
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Failed to complete agent setup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createGHLAccount = async (userId: string) => {
    try {
      const randomNum = Math.floor(Math.random() * 1000);
      
      const ghlPayload = {
        company_id: "lp2p1q27DrdGta1qGDJd",
        snapshot_id: "bInwX5BtZM6oEepAsUwo",
        agency_token: "pit-e3d8d384-00cb-4744-8213-b1ab06ae71fe",
        user_id: userId,
        subaccount_name: companyDescription.split(' ').slice(0, 3).join(' ') || `SolarBusiness_${randomNum}`,
        prospect_email: `solar+${randomNum}@squidgy.ai`,
        prospect_first_name: "Solar",
        prospect_last_name: "Specialist",
        phone: "+1-555-SOLAR-1",
        website: websiteUrl,
        address: "123 Solar Business Ave",
        city: "Solar City",
        state: "CA",
        country: "US",
        postal_code: "90210",
        timezone: 'America/Los_Angeles',
        allow_duplicate_contact: false,
        allow_duplicate_opportunity: false,
        allow_facebook_name_merge: true,
        disable_contact_timezone: false
      };

      const response = await fetch('/api/ghl/create-subaccount-and-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ghlPayload)
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        return {
          success: true,
          credentials: {
            location_id: result.subaccount.location_id,
            user_id: result.business_user.user_id,
            user_email: result.business_user.details.email,
            ghl_automation_email: 'info+zt1rcl49@squidgy.net',
            ghl_automation_password: 'Dummy@123'
          }
        };
      } else {
        throw new Error(result.detail || 'Failed to create GHL account');
      }
    } catch (error) {
      console.error('GHL creation error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const setupFacebookIntegration = async (ghlCredentials: any) => {
    try {
      const facebookConfig = {
        location_id: ghlCredentials.location_id,
        user_id: ghlCredentials.user_id,
        integration_status: 'pending' as const,
        ghl_credentials: {
          email: ghlCredentials.ghl_automation_email,
          password: ghlCredentials.ghl_automation_password
        }
      };

      // Skip Facebook setup for now - focus on website analysis flow
      console.log('Facebook config prepared:', facebookConfig);

      return { success: true };
    } catch (error) {
      console.error('Facebook setup error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
                <Input
                  placeholder="Enter website URL"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAnalyzeWebsite}
                  disabled={!websiteUrl.trim() || loading || !isReady}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </Button>
              </div>
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
                💡 <strong>Tip:</strong> You can analyze your website using the button above OR by pasting the URL in the chat on the right - Seth will automatically extract your business information!
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
          <SetupStepsSidebar currentStep={1} />
        </div>
      </div>

      {/* Mobile Setup Steps Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full">
            <SetupStepsSidebar currentStep={1} />
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
