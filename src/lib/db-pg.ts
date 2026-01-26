import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.CREATIENDAS_FINAL_DB,
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
    getClient: () => pool.connect(),
};
