const express = require('express');
const multer = require('multer');
const businessController = require('../controllers/businessController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

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

// Upload/update business logo
router.post('/:id/logo', upload.single('logo'), businessController.uploadLogo);

// Delete business logo
router.delete('/:id/logo', businessController.deleteLogo);

module.exports = router; 