-- Business Details Table Creation Script
-- This table stores business details data from the BusinessDetails.tsx page

CREATE TABLE IF NOT EXISTS business_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    agent_id VARCHAR(50) NOT NULL DEFAULT 'SOL',
    
    -- Business Information
    business_name VARCHAR(255) NOT NULL,
    business_email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    emergency_numbers TEXT[], -- Array of emergency phone numbers
    
    -- Location Information
    country VARCHAR(10) NOT NULL DEFAULT 'US', -- Country code (US, CA, GB, etc.)
    address_method VARCHAR(20) DEFAULT 'manual', -- 'lookup' or 'manual'
    address_line VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    
    -- Metadata
    setup_status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Create unique constraint to prevent duplicates per user/agent
    UNIQUE(firm_user_id, agent_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_details_firm_user_id ON business_details(firm_user_id);
CREATE INDEX IF NOT EXISTS idx_business_details_agent_id ON business_details(agent_id);
CREATE INDEX IF NOT EXISTS idx_business_details_business_email ON business_details(business_email);
CREATE INDEX IF NOT EXISTS idx_business_details_last_updated ON business_details(last_updated_timestamp);

-- Create trigger to automatically update last_updated_timestamp
CREATE OR REPLACE FUNCTION update_business_details_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_timestamp = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_business_details_timestamp
    BEFORE UPDATE ON business_details
    FOR EACH ROW
    EXECUTE FUNCTION update_business_details_timestamp();

-- Example usage:
-- INSERT INTO business_details (
--     firm_user_id, agent_id, business_name, business_email, phone_number,
--     emergency_numbers, country, address_line, city, state, postal_code
-- ) VALUES (
--     'user-uuid-here', 'SOL', 'RMS Energy Ltd.', 'info@rmsenergy.com', '888-683-3630',
--     ARRAY['888-683-3631'], 'US', '15396 183rd St Little Falls, MN 56345', 
--     'Little Falls', 'Minnesota', '56345'
-- );