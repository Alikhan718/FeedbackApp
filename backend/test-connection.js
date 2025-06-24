// test-connection.js  (ESM version)
import 'dotenv/config';        // loads .env before anything else
import postgres from 'postgres';

console.log('🧪 Testing database connection…');

// 1️⃣ Check env var
const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  console.error('❌ DATABASE_URL is not set in .env file');
  process.exit(1);
}

// 2️⃣ Pretty‑print without the password
const maskedUrl = rawUrl.replace(/:[^:@]*@/, ':****@');
console.log('✅ DATABASE_URL is set');
console.log('🔍 Connection string (password hidden):', maskedUrl);

// 3️⃣ Validate format (guards against stray spaces / bad paste)
try {
  const url = new URL(rawUrl.trim());
  console.log('✅ Connection string format is valid');
  console.log('   Host:', url.hostname);
  console.log('   Port:', url.port || '(default)');
  console.log('   DB  :', url.pathname.slice(1));
  console.log('   User:', url.username);
} catch (err) {
  console.error('❌ Invalid connection string format:', err.message);
  process.exit(1);
}

// 4️⃣ Create a pooled client (postgres.js uses pooling by default)
const sql = postgres(rawUrl, {
  // ssl: 'require',          // <‑‑ uncomment only if sslmode=require is missing
  connect_timeout: 10,        // seconds before TCP timeout
  idle_timeout:    30,        // seconds before an idle conn is closed
  max:             10         // Supabase free tier limit
});

async function testConnection() {
  console.log('🔍 Attempting to connect…');
  try {
    const [{ now }] = await sql`SELECT NOW()`;
    console.log('✅ Connection successful!');
    console.log('🕐 Server time:', now);
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('💡 Error details:', err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });  // tidy up pool before exit
  }
}

testConnection();