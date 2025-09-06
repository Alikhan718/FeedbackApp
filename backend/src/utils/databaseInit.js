const fs = require('fs');
const path = require('path');
const db = require('../../config/database');

class DatabaseInitializer {
  constructor() {
    this.schemaPath = path.join(__dirname, '../../database/schema.sql');
    this.seedPath = path.join(__dirname, '../../database/seed.sql');
  }

  async initialize() {
    try {
      console.log('🔧 Initializing database...');
      
      // Check if tables exist
      const tablesExist = await this.checkTablesExist();
      
      if (!tablesExist) {
        console.log('📋 Creating database schema...');
        await this.createSchema();
        console.log('✅ Schema created successfully!');
        
        console.log('🌱 Seeding database with initial data...');
        await this.seedDatabase();
        console.log('✅ Database seeded successfully!');
      } else {
        console.log('✅ Database tables already exist, skipping initialization');
      }
      
      console.log('🎉 Database initialization complete!');
    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      throw error;
    }
  }

  async checkTablesExist() {
    try {
      const result = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      return result.rows[0].exists;
    } catch (error) {
      console.log('🔍 No tables found, will create schema');
      return false;
    }
  }

  async createSchema() {
    try {
      const schemaSQL = fs.readFileSync(this.schemaPath, 'utf8');
      
      // Split the SQL into individual statements
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await db.query(statement);
        }
      }
    } catch (error) {
      console.error('❌ Error creating schema:', error.message);
      throw error;
    }
  }

  async seedDatabase() {
    try {
      const seedSQL = fs.readFileSync(this.seedPath, 'utf8');
      
      // Split the SQL into individual statements
      const statements = seedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await db.query(statement);
        }
      }
    } catch (error) {
      console.error('❌ Error seeding database:', error.message);
      throw error;
    }
  }

  async resetDatabase() {
    try {
      console.log('🔄 Resetting database...');
      
      // Drop all tables in reverse order of dependencies
      const dropStatements = [
        'DROP TABLE IF EXISTS settings CASCADE;',
        'DROP TABLE IF EXISTS user_bonuses CASCADE;',
        'DROP TABLE IF EXISTS bonuses CASCADE;',
        'DROP TABLE IF EXISTS reviews CASCADE;',
        'DROP TABLE IF EXISTS businesses CASCADE;',
        'DROP TABLE IF EXISTS users CASCADE;'
      ];

      for (const statement of dropStatements) {
        await db.query(statement);
      }

      console.log('✅ Database reset complete!');
      
      // Recreate schema and seed
      await this.createSchema();
      await this.seedDatabase();
      
      console.log('🎉 Database recreated successfully!');
    } catch (error) {
      console.error('❌ Error resetting database:', error.message);
      throw error;
    }
  }
}

module.exports = new DatabaseInitializer();
