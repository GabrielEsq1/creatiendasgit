
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkConnection() {
    const dbUrl = process.env.CREATIENDAS_FINAL_DB || process.env.DATABASE_URL;
    console.log('Using CREATIENDAS_FINAL_DB:', dbUrl ? 'FOUND' : 'MISSING');
    if (!dbUrl) {
        console.log('No CREATIENDAS_FINAL_DB in .env.local, checking .env...');
        require('dotenv').config({ path: '.env' });
    }

    const client = new Client({
        connectionString: dbUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Successfully connected to Postgres directly!');
        const res = await client.query('SELECT current_database(), now();');
        console.log('Query result:', res.rows[0]);
    } catch (err) {
        console.error('Raw Postgres Connection Failed:', err.stack);
    } finally {
        await client.end();
    }
}

checkConnection();
