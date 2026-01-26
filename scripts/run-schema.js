const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.CREATIENDAS_FINAL_DB || process.env.DATABASE_URL,
});

async function runSchema() {
    try {
        const schemaPath = path.join(__dirname, '../scripts/monedera-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema...');
        await pool.query(schemaSql);
        console.log('Schema executed successfully.');
    } catch (err) {
        console.error('Error running schema:', err);
    } finally {
        await pool.end();
    }
}

runSchema();
