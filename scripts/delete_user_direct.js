const { Client } = require('pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_lD5ypmT6MWHb@ep-solitary-thunder-adjq6xeu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function deleteUserByEmail(email) {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Find the user by email first
    const res = await client.query('SELECT id FROM "User" WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      console.log('User not found:', email);
      return;
    }

    const userId = res.rows[0].id;
    console.log('Found user with ID:', userId);

    // Delete related records manually to avoid foreign key issues
    // Focus on the main ones with different column names or no cascade
    
    // WalletAccount uses userId (already deleted? Let's be sure)
    await client.query('DELETE FROM "WalletAccount" WHERE "userId" = $1', [userId]);

    // Store uses ownerId
    await client.query('DELETE FROM "Store" WHERE "ownerId" = $1', [userId]);

    // Accounts / Sessions usually have cascade, but let's be explicit
    await client.query('DELETE FROM "Account" WHERE "userId" = $1', [userId]);
    await client.query('DELETE FROM "Session" WHERE "userId" = $1', [userId]);

    // For others, let's just try to delete the User and see if it works
    const finalDel = await client.query('DELETE FROM "User" WHERE id = $1', [userId]);
    if (finalDel.rowCount > 0) {
      console.log(`✅ Successfully deleted user "${email}" (ID: ${userId})`);
    } else {
      console.log('User was already gone.');
    }

  } catch (err) {
    console.error('An error occurred during user deletion:', err.message);
  } finally {
    await client.end();
  }
}

const targetEmail = 'gabrielesquivia@gmail.com';
deleteUserByEmail(targetEmail);
