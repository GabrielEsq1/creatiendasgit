
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkConnection() {
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING');
    if (!process.env.DATABASE_URL) {
        console.log('No DATABASE_URL in .env.local, checking .env...');
        require('dotenv').config({ path: '.env' });
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
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
