# PayPal Integration Setup Guide

## Step 1: Get PayPal Sandbox Credentials

1. Go to https://developer.paypal.com/
2. Login with your PayPal account
3. Navigate to "Dashboard" → "My Apps & Credentials"
4. Under "Sandbox", find or create a REST API app
5. Copy your:
   - **Client ID**
   - **Secret**

## Step 2: Configure Environment Variables

Add these to your `.env.local` file (create if doesn't exist):

```env
# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_secret_here
PAYPAL_ENV=sandbox

# App URL (required for PayPal redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Important**: Replace `your_sandbox_client_id_here` and `your_sandbox_secret_here` with your actual credentials!

## Step 3: Run Database Migration

### Option A: Using psql directly
```bash
psql -U postgres -d your_database_name -f "c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\public\b2chat\B2Chat-main\prisma\migrations\add_payment_messages.sql"
```

### Option B: Using Prisma (if schema is updated)
```bash
cd c:\Users\ASUS\Desktop\creatiendas\creatiendasgit\public\b2chat\B2Chat-main
npx prisma db push
```

### Option C: Manual SQL execution
Copy the contents of `add_payment_messages.sql` and run in your database client.

## Step 4: Verify Installation

### Check 1: Database Schema
Run this query to verify columns were added:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Message' 
AND column_name IN ('type', 'paymentData');
```

**Expected Result**: Two rows showing `type` (varchar) and `paymentData` (jsonb)

### Check 2: API Routes
Start your dev server and check these endpoints exist:
- `http://localhost:3000/api/chat/payment/create`
- `http://localhost:3000/api/chat/payment/capture`

### Check 3: UI Components
1. Start the app: `npm run dev`
2. Login to B2B Chat
3. Open any conversation
4. **Look for**: Green 💰 button next to the message send button

## Step 5: Test Payment Flow

### Create Test Payment
1. Click the 💰 button
2. Enter amount: `10.00`
3. Add note: "Test payment"
4. Click "Send via PayPal"
5. You'll be redirected to PayPal Sandbox
6. Login with a sandbox test account
7. Complete the payment
8. You'll return to the chat

### Verify Payment Message
After returning to chat, you should see a special payment message showing:
- ✅ Completed status badge
- $10.00 USD amount
- Your note
- Timestamp
- Transaction ID

## Troubleshooting

### Issue: "Error creating PayPal order"
**Solution**: Check your PayPal credentials are correct in `.env.local`

### Issue: Database error when capturing payment
**Solution**: Ensure migration was run successfully. Check columns exist in Message table.

### Issue: Payment button not showing
**Solution**: 
- Clear browser cache
- Restart dev server
- Check console for import errors

### Issue: Redirect back to chat doesn't work
**Solution**: Verify `NEXT_PUBLIC_APP_URL` is set correctly in `.env.local`

## PayPal Sandbox Test Accounts

Create test accounts at: https://developer.paypal.com/dashboard/accounts

You'll need:
- 1 **Personal account** (buyer) - to send payments
- 1 **Business account** (seller) - to receive payments (optional)

## Production Deployment

When ready for production:

1. Change environment variables:
   ```env
   PAYPAL_ENV=live
   PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_secret
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. Get live credentials from https://developer.paypal.com/ under "Live" section

3. Test thoroughly in production environment before going live!

---

## Need Help?

- PayPal Developer Docs: https://developer.paypal.com/docs/
- PayPal SDK GitHub: https://github.com/paypal/Checkout-NodeJS-SDK
- PayPal Sandbox: https://www.sandbox.paypal.com/
