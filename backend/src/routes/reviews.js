const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Submit a review (main endpoint for QR code flow)
router.post('/', reviewController.submitReview);

// Get reviews by business ID
router.get('/business/:businessId', reviewController.getReviewsByBusiness);

// Get reviews by user ID
router.get('/user/:userId', reviewController.getReviewsByUser);

// Get a single review by ID
router.get('/:id', reviewController.getReviewById);

module.exports = router; 