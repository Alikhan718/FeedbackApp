const db = require('../../config/database');

class Bonus {
  static async create(bonusData) {
    const { business_id, description, type, value, conditions } = bonusData;
    try {
      const result = await db.query(
        'INSERT INTO bonuses (business_id, description, type, value, conditions) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [business_id, description, type, value, conditions]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getByBusinessId(businessId) {
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

  static async getActiveByBusinessId(businessId) {
    try {
      const result = await db.query(
        'SELECT * FROM bonuses WHERE business_id = $1 AND is_active = true ORDER BY created_at DESC',
        [businessId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async claimBonus(userId, bonusId) {
    try {
      // Check if bonus is active
      const bonus = await db.query(
        'SELECT * FROM bonuses WHERE id = $1 AND is_active = true',
        [bonusId]
      );

      if (bonus.rows.length === 0) {
        throw new Error('Bonus not found or inactive');
      }

      // Check if user already claimed this bonus
      const existingClaim = await db.query(
        'SELECT * FROM user_bonuses WHERE user_id = $1 AND bonus_id = $2',
        [userId, bonusId]
      );

      if (existingClaim.rows.length > 0) {
        throw new Error('Bonus already claimed');
      }

      // Claim the bonus
      const result = await db.query(
        'INSERT INTO user_bonuses (user_id, bonus_id, status) VALUES ($1, $2, $3) RETURNING *',
        [userId, bonusId, 'claimed']
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(bonusId, isActive) {
    try {
      const result = await db.query(
        'UPDATE bonuses SET is_active = $1 WHERE id = $2 RETURNING *',
        [isActive, bonusId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(bonusId) {
    try {
      const result = await db.query(
        'DELETE FROM bonuses WHERE id = $1 RETURNING *',
        [bonusId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Bonus; 