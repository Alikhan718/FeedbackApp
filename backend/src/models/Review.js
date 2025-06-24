const db = require('../../config/database');

class Review {
  static async create(reviewData) {
    const { user_id, business_id, text, rating, receipt_text, ai_sentiment, ai_topics } = reviewData;
    try {
      const result = await db.query(
        `INSERT INTO reviews (user_id, business_id, text, rating, receipt_text, ai_sentiment, ai_topics, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
        [user_id, business_id, text, rating, receipt_text, ai_sentiment, ai_topics]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByBusinessId(businessId) {
    try {
      const result = await db.query(
        `SELECT r.*, u.email as user_email 
         FROM reviews r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.business_id = $1 
         ORDER BY r.created_at DESC`,
        [businessId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const result = await db.query(
        `SELECT r.*, b.name as business_name 
         FROM reviews r 
         JOIN businesses b ON r.business_id = b.id 
         WHERE r.user_id = $1 
         ORDER BY r.created_at DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM reviews WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Review; 