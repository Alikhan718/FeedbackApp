#!/usr/bin/env node

const databaseInit = require('../src/utils/databaseInit');

const command = process.argv[2];

async function main() {
  try {
    switch (command) {
      case 'init':
        console.log('🔧 Initializing database...');
        await databaseInit.initialize();
        break;
        
      case 'reset':
        console.log('🔄 Resetting database...');
        await databaseInit.resetDatabase();
        break;
        
      case 'check':
        console.log('🔍 Checking database status...');
        const tablesExist = await databaseInit.checkTablesExist();
        console.log(tablesExist ? '✅ Tables exist' : '❌ Tables do not exist');
        break;
        
      default:
        console.log(`
🗄️  Database Manager

Usage: node scripts/db-manager.js <command>

Commands:
  init    - Initialize database (create tables and seed data)
  reset   - Reset database (drop all tables and recreate)
  check   - Check if database tables exist

Examples:
  node scripts/db-manager.js init
  node scripts/db-manager.js reset
  node scripts/db-manager.js check
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
