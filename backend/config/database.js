const { Pool } = require('pg');

// Validate environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Attempting to connect to database...');
console.log('🔍 Connection string:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

// Determine if we're connecting to Supabase (production) or localhost (development)
const isSupabase = process.env.DATABASE_URL.includes('supabase.co');
const isLocalhost = process.env.DATABASE_URL.includes('localhost');

console.log('🔍 Connection type:', isSupabase ? 'Supabase (production)' : 'Local PostgreSQL (development)');

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
};

// Only use SSL for Supabase connections
if (isSupabase) {
  poolConfig.ssl = { rejectUnauthorized: false };
  console.log('🔍 Using SSL for Supabase connection');
} else {
  console.log('🔍 Using non-SSL connection for localhost');
}

const pool = new Pool(poolConfig);

// Test the connection
pool.on('connect', (client) => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
  process.exit(-1);
});

// Test connection function
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    throw error;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
}; 