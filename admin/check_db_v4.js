const { Pool } = require('pg');

const url = "postgresql://postgres.juxvocfnvzzadfxeihxl:-R7d6-%25rgu%24NyG%2B@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

async function main() {
  const pool = new Pool({ 
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    console.log('Testing connection to Supabase Pooler...');
    const res = await pool.query('SELECT current_user, now();');
    console.log('SUCCESS:', res.rows[0]);
  } catch (e) {
    console.error('CONNECTION FAILED:', e.message);
    if (e.detail) console.error('Detail:', e.detail);
    if (e.hint) console.error('Hint:', e.hint);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
