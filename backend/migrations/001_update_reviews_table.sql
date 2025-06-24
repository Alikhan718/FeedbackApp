-- Drop receipt_image_url column and add receipt_text column
ALTER TABLE reviews DROP COLUMN IF EXISTS receipt_image_url;
ALTER TABLE reviews ADD COLUMN receipt_text TEXT; 