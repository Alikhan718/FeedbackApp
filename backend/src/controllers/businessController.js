const Business = require('../models/Business');
const fs = require('fs');
const path = require('path');

const businessController = {
  // Get business by ID (for QR code scanning)
  async getBusinessById(req, res) {
    try {
      const { id } = req.params;
      const business = await Business.getById(id);
      
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      
      res.json(business);
    } catch (error) {
      console.error('Error getting business:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all reviews for a business
  async getBusinessReviews(req, res) {
    try {
      const { id } = req.params;
      const reviews = await Business.getReviews(id);
      
      res.json(reviews);
    } catch (error) {
      console.error('Error getting business reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all bonuses for a business
  async getBusinessBonuses(req, res) {
    try {
      const { id } = req.params;
      const bonuses = await Business.getBonuses(id);
      
      res.json(bonuses);
    } catch (error) {
      console.error('Error getting business bonuses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get business analytics (basic stats for now)
  async getBusinessAnalytics(req, res) {
    try {
      const { id } = req.params;
      const reviews = await Business.getReviews(id);
      
      // Calculate basic analytics
      const totalReviews = reviews.length;
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      const sentimentCounts = reviews.reduce((acc, review) => {
        const sentiment = review.ai_sentiment || 'unknown';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      }, {});

      const analytics = {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        sentimentBreakdown: sentimentCounts,
        recentReviews: reviews.slice(0, 5) // Last 5 reviews
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Error getting business analytics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all businesses
  async getAllBusinesses(req, res) {
    try {
      const businesses = await Business.getAll();
      res.json(businesses);
    } catch (error) {
      console.error('Error getting all businesses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Upload or update a business logo
  async uploadLogo(req, res) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Basic file type validation for safety
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Unsupported file type. Please upload a PNG, JPEG, WEBP, or SVG image.' });
      }

      // Ensure business exists and cleanup existing logo if any
      const existing = await Business.getById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Business not found' });
      }

      if (existing.logo_url) {
        const uploadsRoot = path.join(__dirname, '..', 'uploads');
        const relativeUnderUploads = existing.logo_url
          .replace(/^\/+/, '')
          .replace(/^uploads[\/]/, '');
        const oldPath = path.join(uploadsRoot, relativeUnderUploads);
        try { await fs.promises.unlink(oldPath); } catch (_) {}
      }

      // Ensure uploads directory exists (align with app static root: backend/uploads)
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'logos');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename preserving extension
      const originalName = req.file.originalname || 'logo';
      const ext = path.extname(originalName) || '.png';
      const fileName = `business_${id}_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, fileName);

      // Write buffer to disk
      await fs.promises.writeFile(filePath, req.file.buffer);

      // Public URL served by express static: /uploads/logos/<fileName>
      const publicUrl = `/uploads/logos/${fileName}`;

      // Update DB
      const updated = await Business.updateLogoUrl(id, publicUrl);

      res.json({ success: true, logo_url: publicUrl, business: updated });
    } catch (error) {
      console.error('Error uploading logo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Remove a business logo (and clear DB field)
  async deleteLogo(req, res) {
    try {
      const { id } = req.params;
      const business = await Business.getById(id);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      const currentUrl = business.logo_url;
      if (currentUrl) {
        // Attempt to delete file from disk
        const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');
        // Remove leading slash and '/uploads/' prefix to get path relative to uploads root
        const relativeUnderUploads = currentUrl
          .replace(/^\/+/, '')
          .replace(/^uploads[\/]/, '');
        const filePath = path.join(uploadsRoot, relativeUnderUploads);
        try {
          await fs.promises.unlink(filePath);
        } catch (_) {
          // If file missing, continue gracefully
        }
      }

      const updated = await Business.updateLogoUrl(id, null);
      res.json({ success: true, business: updated });
    } catch (error) {
      console.error('Error deleting logo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = businessController; 