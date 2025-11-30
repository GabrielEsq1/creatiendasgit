-- Migration: Add Payment Support to Messages Table
-- This migration adds support for payment messages in B2B Chat

-- Step 1: Add 'type' column to messages table
-- This allows us to distinguish between text, payment, and system messages
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "type" VARCHAR(20) DEFAULT 'text';

-- Step 2: Add 'paymentData' column to messages table
-- This stores payment-specific information as JSON
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "paymentData" JSONB;

-- Step 3: Create index on type for faster queries
CREATE INDEX IF NOT EXISTS "idx_message_type" ON "Message"("type");

-- Step 4: Create index on paymentData for payment queries
CREATE INDEX IF NOT EXISTS "idx_message_payment" ON "Message" 
USING GIN ("paymentData") WHERE "type" = 'payment';

-- Step 5: Add check constraint to ensure paymentData structure
-- Note: PostgreSQL JSONB constraints (optional, for data integrity)
ALTER TABLE "Message"
ADD CONSTRAINT "check_payment_data" 
CHECK (
  "type" != 'payment' OR (
    "paymentData" IS NOT NULL AND
    "paymentData" ? 'paymentId' AND
    "paymentData" ? 'amount' AND
    "paymentData" ? 'currency' AND
    "paymentData" ? 'status' AND
    "paymentData" ? 'recipientId' AND
    "paymentData" ? 'senderId'
  )
);

-- Documentation
-- 
-- Payment message structure in paymentData JSONB field:
-- {
--   "paymentId": "string",      // PayPal transaction ID
--   "amount": number,            // Amount in USD
--   "currency": "string",        // Currency code (e.g., "USD")
--   "status": "string",          // "pending" | "completed" | "failed"
--   "recipientId": "string",     // User ID of recipient
--   "senderId": "string",        // User ID of sender
--   "note": "string",            // Optional payment note
--   "capturedAt": "string"       // ISO timestamp when payment was captured
-- }
--
-- Example usage:
-- INSERT INTO "Message" ("conversationId", "senderUserId", "text", "type", "paymentData")
-- VALUES (
--   'conv_123',
--   'user_456',
--   'Payment of $50.00 USD',
--   'payment',
--   '{"paymentId": "PAY-123", "amount": 50.00, "currency": "USD", "status": "completed", "recipientId": "user_789", "senderId": "user_456"}'::jsonb
-- );

-- Rollback script (if needed):
-- ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "check_payment_data";
-- DROP INDEX IF EXISTS "idx_message_payment";
-- DROP INDEX IF EXISTS "idx_message_type";
-- ALTER TABLE "Message" DROP COLUMN IF EXISTS "paymentData";
-- ALTER TABLE "Message" DROP COLUMN IF EXISTS "type";
