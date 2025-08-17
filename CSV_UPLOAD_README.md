# CSV Bulk Upload Feature - Ruby/Gemstone Support

This feature allows you to upload multiple products (especially rubies and gemstones) to your Supabase database using a CSV file.

## Database Setup Required

**IMPORTANT**: Before using the CSV upload, you need to add the following columns to your Supabase `products` table:

```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS carat DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS shape TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS clarity TEXT,
ADD COLUMN IF NOT EXISTS origin TEXT,
ADD COLUMN IF NOT EXISTS treatment TEXT;
```

Run this SQL in your Supabase SQL editor to add support for gemstone-specific attributes.

## Supported CSV Formats

The system now supports both formats:

### Standard Product Format:
```csv
Product Name,Description,Price,Categories
Diamond Ring,Beautiful ring,50000,Rings,Diamond
```

### Ruby/Gemstone Format (like your file):
```csv
Carat,Dimensions,Shape,Color,Clarity,Origin,Treatment,Price,Title,Description,Tags
2.0,7.7x6.6x4.1,Oval,Deep Pinkish-Red,Transparent,Mozambique,Heated,,Ruby Title,Description,tag1,tag2
```

## How to Use

1. **Setup Database** (One-time setup)
   - Run the SQL script above in your Supabase dashboard
   - This adds columns for: carat, dimensions, shape, color, clarity, origin, treatment

2. **Access the CSV Upload Page**
   - Navigate to Product Management > CSV Bulk Upload
   - Or use the "Bulk Upload CSV" button on the Product List page

3. **Upload Your Ruby CSV**
   - Select your `mozambique_rubies.csv` file
   - The system will automatically map:
     - `Title` → Product Name
     - `Description` → Description  
     - `Tags` → Categories
     - `Carat` → Carat weight
     - `Shape` → Cut shape
     - `Color` → Color description
     - `Clarity` → Clarity grade
     - `Origin` → Geographic origin
     - `Treatment` → Treatment type
     - `Price` → Price (will use default if empty)

4. **Preview and Upload**
   - Click "Parse and Preview CSV"
   - Review the data preview
   - Click "Upload" to add all products

## Your Ruby CSV Features

- ✅ **Automatic Header Mapping**: Maps `Title` to `name`, `Tags` to `categories`, etc.
- ✅ **Empty Price Handling**: Sets default price (1000) when price is empty
- ✅ **Gemstone Attributes**: Preserves carat, shape, color, clarity, origin, treatment
- ✅ **Tag Processing**: Converts comma-separated tags to categories
- ✅ **Flexible File Types**: Accepts .csv files with various MIME types

## After Upload

Your product list will show:
- Product photos (if uploaded separately)
- Product name (from Title)
- Carat weight
- Shape (cut)
- Color
- Categories (from Tags)
- Price
- Edit/Delete actions

## Troubleshooting

- **"Invalid file" error**: Make sure the file has .csv extension
- **Database errors**: Ensure you've run the SQL schema update
- **Missing data**: Empty price fields will use default value (1000)
- **Column errors**: The system automatically maps common column names
