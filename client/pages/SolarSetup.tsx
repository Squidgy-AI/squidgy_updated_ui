import { useState } from "react";
import { X, Menu, Sun, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatInterface } from "../components/ChatInterface";
import { UserAccountDropdown } from "../components/UserAccountDropdown";
import { SetupStepsSidebar } from "../components/SetupStepsSidebar";
import { useUser } from "../hooks/useUser";
import { saveSolarSetup } from "../lib/api";
import { toast } from "sonner";



// Helper component for input fields with help icons
function HelpTooltip({ content }: { content: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div className="absolute left-6 top-0 z-10 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
          {content}
          <div className="absolute left-0 top-2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
}

// Main Solar Setup Page Component
export default function SolarSetup() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [installationPrice, setInstallationPrice] = useState(2.00);
  const [dealerFee, setDealerFee] = useState(15.0);
  const [brokerFee, setBrokerFee] = useState(0.00);
  const [allowFinanced, setAllowFinanced] = useState(true);
  const [allowCash, setAllowCash] = useState(true);
  const [financingApr, setFinancingApr] = useState(5.0);
  const [financingTerm, setFinancingTerm] = useState(240);
  const [energyPrice, setEnergyPrice] = useState(0.17);
  const [yearlyElectricCostIncrease, setYearlyElectricCostIncrease] = useState(4.0);
  const [installationLifespan, setInstallationLifespan] = useState(20);
  const [typicalPanelCount, setTypicalPanelCount] = useState(40);
  const [maxRoofSegments, setMaxRoofSegments] = useState(4);
  const [solarIncentive, setSolarIncentive] = useState(3.0);

  const handleContinue = async () => {
    if (!user?.id) {
      toast.error('Please log in to continue');
      return;
    }

    setIsLoading(true);
    
    try {
      const solarSetupData = {
        firm_user_id: user.id,
        agent_id: 'SOL',
        installation_price: installationPrice,
        dealer_fee: dealerFee,
        broker_fee: brokerFee,
        allow_financed: allowFinanced,
        allow_cash: allowCash,
        financing_apr: financingApr,
        financing_term: financingTerm,
        energy_price: energyPrice,
        yearly_electric_cost_increase: yearlyElectricCostIncrease,
        installation_lifespan: installationLifespan,
        typical_panel_count: typicalPanelCount,
        max_roof_segments: maxRoofSegments,
        solar_incentive: solarIncentive,
        setup_status: 'completed'
      };

      const result = await saveSolarSetup(solarSetupData);
      
      if (result.success) {
        toast.success('Solar setup saved successfully!');
        navigate('/calendar-setup');
      } else {
        toast.error('Failed to save solar setup');
      }
    } catch (error: any) {
      console.error('Solar setup save error:', error);
      toast.error(error.message || 'Failed to save solar setup');
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
        <div className="h-full w-96 bg-squidgy-gradient"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="p-5">
          <ChatInterface 
            agentName="Seth agent"
            agentDescription="Solar Setup Assistant"
            context="solar_setup"
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
                <Sun className="w-6 h-6 text-squidgy-purple" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">3. Solar setup</h2>
              <p className="text-text-secondary text-sm">
                Please review your solar offer details. You can edit these later as well.
              </p>
            </div>

            {/* Installation Price */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Installation price
                <HelpTooltip content="Base price charged per watt of solar panel capacity. Default: $2.00." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.01"
                  value={installationPrice}
                  onChange={(e) => setInstallationPrice(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">$/Watt</span>
              </div>
            </div>

            {/* Dealer Fee */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Dealer fee
                <HelpTooltip content="Percentage fee added to the base installation price for dealer markup." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={dealerFee}
                  onChange={(e) => setDealerFee(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">%</span>
              </div>
            </div>

            {/* Broker Fee */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Broker fee
                <HelpTooltip content="Fixed dollar amount charged as a broker fee for the installation." />
              </label>
              <div className="flex items-center">
                <span className="px-4 py-3 bg-gray-50 border border-r-0 border-grey-500 rounded-l-md text-text-primary">$</span>
                <input
                  type="number"
                  step="1"
                  value={brokerFee}
                  onChange={(e) => setBrokerFee(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-r-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
              </div>
            </div>

            {/* Purchase Options */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-primary mb-4">Purchase options</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowFinanced}
                    onChange={(e) => setAllowFinanced(e.target.checked)}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Allow financed purchases</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowCash}
                    onChange={(e) => setAllowCash(e.target.checked)}
                    className="w-5 h-5 text-squidgy-purple border-gray-300 rounded focus:ring-squidgy-purple"
                  />
                  <span className="text-text-primary">Allow cash purchases</span>
                </label>
              </div>
            </div>

            {/* Financing APR */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Financing APR
                <HelpTooltip content="Annual Percentage Rate for financing options offered to customers." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={financingApr}
                  onChange={(e) => setFinancingApr(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">%</span>
              </div>
            </div>

            {/* Financing Term */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Financing term
                <HelpTooltip content="Length of the financing term in months." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="1"
                  value={financingTerm}
                  onChange={(e) => setFinancingTerm(parseInt(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">Months</span>
              </div>
            </div>

            {/* Energy Price */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Energy price
                <HelpTooltip content="Current electricity rate per kilowatt-hour for cost comparison calculations." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.01"
                  value={energyPrice}
                  onChange={(e) => setEnergyPrice(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">$/kW</span>
              </div>
            </div>

            {/* Yearly Electric Cost Increase */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Yearly electric cost increase
                <HelpTooltip content="Expected annual increase in electricity costs for savings calculations." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={yearlyElectricCostIncrease}
                  onChange={(e) => setYearlyElectricCostIncrease(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">%</span>
              </div>
            </div>

            {/* Installation Lifespan */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Installation lifespan
                <HelpTooltip content="Expected lifespan of the solar installation in years." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="1"
                  value={installationLifespan}
                  onChange={(e) => setInstallationLifespan(parseInt(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">Years</span>
              </div>
            </div>

            {/* Typical Panel Count */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Typical panel count
                <HelpTooltip content="Average number of solar panels in a typical installation." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="1"
                  value={typicalPanelCount}
                  onChange={(e) => setTypicalPanelCount(parseInt(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">Panels</span>
              </div>
            </div>

            {/* Maximum Roof Segments */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Maximum roof segments
                <HelpTooltip content="Maximum number of roof segments that can be used for panel installation." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="1"
                  value={maxRoofSegments}
                  onChange={(e) => setMaxRoofSegments(parseInt(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">Segments</span>
              </div>
            </div>

            {/* Solar Incentive */}
            <div className="mb-8">
              <label className="flex items-center text-sm font-semibold text-text-primary mb-2">
                Solar incentive
                <HelpTooltip content="Percentage discount or incentive offered on solar installations." />
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={solarIncentive}
                  onChange={(e) => setSolarIncentive(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 border border-grey-500 rounded-l-md text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                />
                <span className="px-4 py-3 bg-gray-50 border border-l-0 border-grey-500 rounded-r-md text-text-primary">%</span>
              </div>
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
          <SetupStepsSidebar currentStep={3} />
        </div>
      </div>

      {/* Mobile Setup Steps Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full">
            <SetupStepsSidebar currentStep={3} />
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
