-- SQL script to add ruby-specific columns to your products table
-- Run this in your Supabase SQL editor

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS carat DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS shape TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS clarity TEXT,
ADD COLUMN IF NOT EXISTS origin TEXT,
ADD COLUMN IF NOT EXISTS treatment TEXT;

-- Optional: Add comments to document the columns
COMMENT ON COLUMN products.carat IS 'Weight of the gemstone in carats';
COMMENT ON COLUMN products.dimensions IS 'Physical dimensions of the gemstone (e.g., "7.7x6.6x4.1")';
COMMENT ON COLUMN products.shape IS 'Cut shape of the gemstone (e.g., "Oval", "Round", "Cushion")';
COMMENT ON COLUMN products.color IS 'Color description of the gemstone';
COMMENT ON COLUMN products.clarity IS 'Clarity grade of the gemstone';
COMMENT ON COLUMN products.origin IS 'Geographic origin of the gemstone';
COMMENT ON COLUMN products.treatment IS 'Any treatments applied to the gemstone';

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
