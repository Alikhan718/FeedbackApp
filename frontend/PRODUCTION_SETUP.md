# Production Setup Guide

## Environment Configuration

Your frontend has been updated to use environment variables for API configuration. Here's what you need to do:

### 1. Create Environment File

Create a `.env` file in the `frontend` directory with your Railway backend URL:

```bash
# In frontend/.env
REACT_APP_API_URL=https://your-railway-backend-url.railway.app
```

Replace `https://your-railway-backend-url.railway.app` with your actual Railway backend URL.

### 2. What Was Changed

All frontend files have been updated to use the centralized API configuration:

- **API Configuration**: Created `src/config/api.js` for centralized API management
- **Environment Variables**: All hardcoded `localhost:5000` URLs replaced with `process.env.REACT_APP_API_URL`
- **Image URLs**: Logo and image URLs now use the environment variable
- **Centralized Management**: All API calls now use the same configuration

### 3. Files Updated

The following files were modified to use the environment variable:

- `src/pages/ReviewSubmission.js`
- `src/pages/BusinessDashboard.js`
- `src/pages/Reviews.js`
- `src/pages/Settings.js`
- `src/pages/DashboardHome.js`
- `src/pages/Bonuses.js`
- `src/pages/client/ClientDashboard.js`
- `src/config/api.js` (new file)

### 4. How It Works

The application now uses:
- `REACT_APP_API_URL` environment variable for the base API URL
- Centralized configuration in `src/config/api.js`
- Helper functions for image URL handling
- Fallback to localhost for development

### 5. Deployment

1. Set your Railway backend URL in the `.env` file
2. Build your React app: `npm run build`
3. Deploy to Vercel
4. Make sure to add the environment variable in Vercel's dashboard as well

### 6. Environment Variables in Vercel

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `REACT_APP_API_URL` = `https://your-railway-backend-url.railway.app`

This ensures your production build uses the correct API URL.
