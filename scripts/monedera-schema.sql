-- Run this on your Postgres DB
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  kyc_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  balance BIGINT DEFAULT 0, -- cents
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  tx_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'credit' | 'debit' | 'transfer'
  amount BIGINT NOT NULL,
  balance_after BIGINT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (tx_id)
);
