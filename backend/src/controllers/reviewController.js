const Review = require('../models/Review');
const User = require('../models/User');
const Bonus = require('../models/Bonus');
const Business = require('../models/Business');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');

const reviewController = {
  // Submit a review (main endpoint for QR code flow)
  async submitReview(req, res) {
    try {
      // Handle multipart form data
      const { businessId, text, rating, userEmail } = req.body;
      const receiptImage = req.file; // Assuming you're using multer for file upload

      // Validate required fields
      if (!businessId || !text || !rating || !userEmail) {
        return res.status(400).json({ 
          error: 'Missing required fields: businessId, text, rating, userEmail' 
        });
      }

      // Check if business exists
      const business = await Business.getById(businessId);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Duplicate review detection (last 10 reviews)
      const lastReviews = await Review.getLastNByBusinessId(businessId, 10);
      const normalizedNewText = text.trim().toLowerCase();
      const isDuplicate = lastReviews.some(r => r.text.trim().toLowerCase() === normalizedNewText);
      if (isDuplicate) {
        return res.status(200).json({
          approved: false,
          message: 'Duplicate review detected',
          reason: 'Your review is too similar to a recent review. Please provide unique feedback.',
          suggestions: 'Try to add more details or share a different aspect of your experience.',
          sentiment: null,
          topics: [],
          covered_aspects: [],
          missing_aspects: [],
          confirmation_message: null
        });
      }

      // Process receipt image with OCR if provided
      let receiptText = null;
      if (receiptImage) {
        const ocrResult = await ocrService.extractTextFromImage(receiptImage.buffer);
        if (ocrResult.success) {
          receiptText = ocrResult.text;
        } else {
          console.error('OCR failed:', ocrResult.error);
        }
      }

      // Process review text with AI for validation
      const aiResult = await aiService.analyzeReview(text, business.industry);

      // If AI doesn't approve the review, return rejection with suggestions
      if (!aiResult.approved) {
        return res.status(200).json({
          approved: false,
          message: 'Review needs improvement',
          reason: aiResult.reason,
          suggestions: aiResult.suggestions,
          sentiment: aiResult.sentiment,
          topics: aiResult.topics,
          covered_aspects: aiResult.covered_aspects,
          missing_aspects: aiResult.missing_aspects,
          confirmation_message: aiResult.confirmation_message
        });
      }

      // Check if user exists, if not create one
      let user = await User.getByEmail(userEmail);
      if (!user) {
        user = await User.createAfterReview(userEmail);
      }

      // Create the review (only if approved by AI)
      const review = await Review.create({
        user_id: user.id,
        business_id: businessId,
        text,
        rating,
        receipt_text: receiptText, // Store OCR result instead of image URL
        ai_sentiment: aiResult.sentiment,
        ai_topics: aiResult.topics.join(','),
        created_at: new Date()
      });

      // Get available bonuses for this business
      const availableBonuses = await Bonus.getActiveByBusinessId(businessId);
      
      // Auto-assign first available bonus (you can modify this logic)
      let assignedBonus = null;
      if (availableBonuses.length > 0) {
        try {
          assignedBonus = await Bonus.claimBonus(user.id, availableBonuses[0].id);
        } catch (error) {
          console.log('Could not assign bonus:', error.message);
        }
      }

      res.status(201).json({
        approved: true,
        message: 'Review submitted successfully',
        review,
        user: { id: user.id, email: user.email },
        assignedBonus,
        receiptProcessed: !!receiptText,
        sentiment: aiResult.sentiment,
        topics: aiResult.topics,
        covered_aspects: aiResult.covered_aspects,
        missing_aspects: aiResult.missing_aspects,
        confirmation_message: aiResult.confirmation_message
      });

    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get reviews by business ID
  async getReviewsByBusiness(req, res) {
    try {
      const { businessId } = req.params;
      const reviews = await Review.getByBusinessId(businessId);
      
      res.json(reviews);
    } catch (error) {
      console.error('Error getting reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get reviews by user ID
  async getReviewsByUser(req, res) {
    try {
      const { userId } = req.params;
      const reviews = await Review.getByUserId(userId);
      
      res.json(reviews);
    } catch (error) {
      console.error('Error getting user reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get a single review by ID
  async getReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.getById(id);
      
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      res.json(review);
    } catch (error) {
      console.error('Error getting review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = reviewController; 