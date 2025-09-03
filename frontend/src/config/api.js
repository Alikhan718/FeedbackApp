// API Configuration
// Update this file with your actual Railway backend URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_BASE = `${API_URL}/api`;
export const API_ORIGIN = API_URL;

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${API_URL}${imagePath}`;
};
