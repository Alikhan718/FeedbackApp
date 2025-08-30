const db = require('../../config/database');

class Business {
  static async getById(id) {
    try {
      const result = await db.query(
        'SELECT * FROM businesses WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const result = await db.query('SELECT * FROM businesses ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(businessData) {
    const { name, industry, location, owner_id } = businessData;
    try {
      const result = await db.query(
        'INSERT INTO businesses (name, industry, location, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, industry, location, owner_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getReviews(businessId) {
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

  static async getBonuses(businessId) {
    try {
      const result = await db.query(
        'SELECT * FROM bonuses WHERE business_id = $1 ORDER BY created_at DESC',
        [businessId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateLogoUrl(businessId, logoUrl) {
    try {
      const result = await db.query(
        'UPDATE businesses SET logo_url = $1 WHERE id = $2 RETURNING *',
        [logoUrl, businessId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Business; 