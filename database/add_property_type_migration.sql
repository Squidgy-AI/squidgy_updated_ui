-- Migration to add property_type column to solar_setup table
-- Execute this migration to add property type support

-- Add property_type column
ALTER TABLE public.solar_setup 
ADD COLUMN property_type VARCHAR(20) DEFAULT 'Residential' NOT NULL;

-- Add check constraint to ensure only valid property types
ALTER TABLE public.solar_setup 
ADD CONSTRAINT chk_property_type 
CHECK (property_type IN ('Residential', 'Commercial', 'Other'));

-- Create index for property_type for better query performance
CREATE INDEX IF NOT EXISTS idx_solar_setup_property_type ON public.solar_setup(property_type);

-- Update existing records to have 'Residential' as default property type
UPDATE public.solar_setup 
SET property_type = 'Residential' 
WHERE property_type IS NULL;

-- Add comment to the column for documentation
COMMENT ON COLUMN public.solar_setup.property_type IS 'Type of property: Residential, Commercial, or Other';