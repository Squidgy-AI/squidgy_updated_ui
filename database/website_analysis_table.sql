-- Website Analysis Table Creation Script
-- This table stores website analysis data from the WebsiteDetails.tsx page

CREATE TABLE IF NOT EXISTS website_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    agent_id VARCHAR(50) NOT NULL DEFAULT 'SOL',
    firm_id UUID, -- References profiles(company_id) but no foreign key constraint since company_id is not unique
    website_url VARCHAR(500) NOT NULL,
    company_description TEXT,
    value_proposition TEXT,
    business_niche TEXT,
    tags TEXT[], -- Array of tags (max 5)
    screenshot_url VARCHAR(500),
    favicon_url VARCHAR(500),
    analysis_status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Create unique constraint to prevent duplicates
    UNIQUE(firm_user_id, agent_id, website_url)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_analysis_firm_user_id ON website_analysis(firm_user_id);
CREATE INDEX IF NOT EXISTS idx_website_analysis_agent_id ON website_analysis(agent_id);
CREATE INDEX IF NOT EXISTS idx_website_analysis_last_updated ON website_analysis(last_updated_timestamp);

-- Create trigger to automatically update last_updated_timestamp
CREATE OR REPLACE FUNCTION update_website_analysis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_timestamp = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_website_analysis_timestamp
    BEFORE UPDATE ON website_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_website_analysis_timestamp();

-- Example usage:
-- INSERT INTO website_analysis (firm_user_id, agent_id, website_url, company_description, value_proposition, business_niche, tags)
-- VALUES ('user-uuid-here', 'SOL', 'https://www.nike.com', 'Nike is a leading athletic wear company...', 'Innovation in sports...', 'Athletic apparel market', ARRAY['Sports', 'Innovation', 'Athletic Wear', 'Footwear', 'Apparel']);