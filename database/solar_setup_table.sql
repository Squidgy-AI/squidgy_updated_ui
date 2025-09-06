-- Solar Setup Table Creation Script
-- This table stores solar setup data from the SolarSetup.tsx page

CREATE TABLE IF NOT EXISTS solar_setup (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    agent_id VARCHAR(50) NOT NULL DEFAULT 'SOL',
    
    -- Pricing Information
    installation_price DECIMAL(6, 2) NOT NULL DEFAULT 2.00, -- $/Watt
    dealer_fee DECIMAL(5, 2) NOT NULL DEFAULT 15.0, -- Percentage
    broker_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Fixed dollar amount
    
    -- Purchase Options
    allow_financed BOOLEAN NOT NULL DEFAULT true,
    allow_cash BOOLEAN NOT NULL DEFAULT true,
    
    -- Financing Details
    financing_apr DECIMAL(5, 2) NOT NULL DEFAULT 5.0, -- Annual percentage rate
    financing_term INTEGER NOT NULL DEFAULT 240, -- Months
    
    -- Energy Information
    energy_price DECIMAL(6, 3) NOT NULL DEFAULT 0.170, -- $/kW
    yearly_electric_cost_increase DECIMAL(5, 2) NOT NULL DEFAULT 4.0, -- Percentage
    
    -- Installation Details
    installation_lifespan INTEGER NOT NULL DEFAULT 20, -- Years
    typical_panel_count INTEGER NOT NULL DEFAULT 40, -- Number of panels
    max_roof_segments INTEGER NOT NULL DEFAULT 4, -- Maximum segments
    solar_incentive DECIMAL(5, 2) NOT NULL DEFAULT 3.0, -- Percentage
    
    -- Metadata
    setup_status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Create unique constraint to prevent duplicates per user/agent
    UNIQUE(firm_user_id, agent_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_solar_setup_firm_user_id ON solar_setup(firm_user_id);
CREATE INDEX IF NOT EXISTS idx_solar_setup_agent_id ON solar_setup(agent_id);
CREATE INDEX IF NOT EXISTS idx_solar_setup_last_updated ON solar_setup(last_updated_timestamp);

-- Create trigger to automatically update last_updated_timestamp
CREATE OR REPLACE FUNCTION update_solar_setup_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_timestamp = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_solar_setup_timestamp
    BEFORE UPDATE ON solar_setup
    FOR EACH ROW
    EXECUTE FUNCTION update_solar_setup_timestamp();

-- Example usage:
-- INSERT INTO solar_setup (
--     firm_user_id, agent_id, installation_price, dealer_fee, broker_fee,
--     allow_financed, allow_cash, financing_apr, financing_term,
--     energy_price, yearly_electric_cost_increase, installation_lifespan,
--     typical_panel_count, max_roof_segments, solar_incentive
-- ) VALUES (
--     'user-uuid-here', 'SOL', 2.00, 15.0, 0.00,
--     true, true, 5.0, 240,
--     0.170, 4.0, 20,
--     40, 4, 3.0
-- );