const db = require('../../config/database');

class User {
  static async create(userData) {
    const { email, password_hash, role, name = null, phone_number = null } = userData;
    try {
      const result = await db.query(
        'INSERT INTO users (email, password_hash, role, name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [email, password_hash, role, name, phone_number]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createAfterReview(email, name = null, phone_number = null) {
    try {
      // Create a simple password hash for now (in production, use proper hashing)
      const password_hash = 'temp_password_' + Date.now();
      const result = await db.query(
        'INSERT INTO users (email, password_hash, role, name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [email, password_hash, 'client', name, phone_number]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getUserBonuses(userId) {
    try {
      const result = await db.query(
        `SELECT ub.*, b.description, b.type, b.value, bus.name as business_name
         FROM user_bonuses ub
         JOIN bonuses b ON ub.bonus_id = b.id
         JOIN businesses bus ON b.business_id = bus.id
         WHERE ub.user_id = $1
         ORDER BY ub.created_at DESC`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, { name, phone_number }) {
    try {
      const result = await db.query(
        'UPDATE users SET name = $1, phone_number = $2 WHERE id = $3 RETURNING *',
        [name, phone_number, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User; 