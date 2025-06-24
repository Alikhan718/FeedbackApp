const User = require('../models/User');

const userController = {
  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error getting user by email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getUserBonuses(req, res) {
    try {
      const { userId } = req.params;
      const bonuses = await User.getUserBonuses(userId);
      res.json(bonuses);
    } catch (error) {
      console.error('Error getting user bonuses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateProfile(req, res) {
    try {
      const { userId } = req.params;
      const { name, phone_number } = req.body;
      const updatedUser = await User.updateProfile(userId, { name, phone_number });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController; 