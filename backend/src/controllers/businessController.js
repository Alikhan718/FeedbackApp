const Business = require('../models/Business');

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
  }
};

module.exports = businessController; 