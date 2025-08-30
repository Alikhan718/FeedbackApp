-- Migration: Add logo_url column to businesses table
ALTER TABLE businesses ADD COLUMN logo_url VARCHAR(500); 