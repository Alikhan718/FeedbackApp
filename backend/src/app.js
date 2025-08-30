const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const businessRoutes = require('./routes/business');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const db = require('../config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

app.use(cors());
app.use(express.json());

// Serve uploaded files (logos, etc.) statically
// __dirname: backend/src → uploads root should be backend/uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running!' });
});

// Business routes
app.use('/api/business', businessRoutes);

// Review routes with file upload middleware
app.use('/api/reviews', upload.single('receipt'), reviewRoutes);
app.use('/api/users', userRoutes);

// TODO: Add other API routes here

// Test database connection before starting server
async function startServer() {
  try {
    console.log('🚀 Starting server...');
    
    // Test database connection using the improved test function
    await db.testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Make sure your .env file has the correct DATABASE_URL');
    process.exit(1);
  }
}

startServer();
