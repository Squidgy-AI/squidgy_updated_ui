-- Notification Preferences Table Creation Script
-- This table stores notification preferences data from the NotificationPreferences.tsx page

CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    agent_id VARCHAR(50) NOT NULL DEFAULT 'SOL',
    
    -- Notification Channels (enabled/disabled)
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    messenger_enabled BOOLEAN NOT NULL DEFAULT true,
    sms_enabled BOOLEAN NOT NULL DEFAULT false,
    whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
    ghl_enabled BOOLEAN NOT NULL DEFAULT false,
    
    -- Email for notifications
    notification_email VARCHAR(255) NOT NULL,
    
    -- Notification Types (what to get notified about)
    appointment_confirmations BOOLEAN NOT NULL DEFAULT true,
    appointment_reminders BOOLEAN NOT NULL DEFAULT true,
    cancellations_reschedules BOOLEAN NOT NULL DEFAULT true,
    
    -- Metadata
    setup_status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Create unique constraint to prevent duplicates per user/agent
    UNIQUE(firm_user_id, agent_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notification_preferences_firm_user_id ON notification_preferences(firm_user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_agent_id ON notification_preferences(agent_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_notification_email ON notification_preferences(notification_email);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_last_updated ON notification_preferences(last_updated_timestamp);

-- Create trigger to automatically update last_updated_timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_timestamp = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notification_preferences_timestamp
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_preferences_timestamp();

-- Example usage:
-- INSERT INTO notification_preferences (
--     firm_user_id, agent_id, email_enabled, messenger_enabled, sms_enabled,
--     whatsapp_enabled, ghl_enabled, notification_email,
--     appointment_confirmations, appointment_reminders, cancellations_reschedules
-- ) VALUES (
--     'user-uuid-here', 'SOL', true, true, false,
--     false, false, 'info@rmsenergy.com',
--     true, true, true
-- );