const express = require('express');
const businessController = require('../controllers/businessController');

const router = express.Router();

// Get business by ID (for QR code scanning)
router.get('/:id', businessController.getBusinessById);

// Get all reviews for a business
router.get('/:id/reviews', businessController.getBusinessReviews);

// Get all bonuses for a business
router.get('/:id/bonuses', businessController.getBusinessBonuses);

// Get business analytics
router.get('/:id/analytics', businessController.getBusinessAnalytics);

// Get all businesses
router.get('/', businessController.getAllBusinesses);

module.exports = router; 