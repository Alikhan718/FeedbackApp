const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Get user by email
router.get('/email/:email', userController.getUserByEmail);

// Get user bonuses
router.get('/:userId/bonuses', userController.getUserBonuses);

// Update user profile
router.patch('/:userId', userController.updateProfile);

module.exports = router; 