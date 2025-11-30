@echo off
echo ========================================
echo PayPal P2P Payment - Setup Checklist
echo ========================================
echo.

echo [Step 1] Environment Variables
echo Status: .env.local created with template
echo Action Required: Add your PayPal sandbox credentials
echo.
echo To get credentials:
echo 1. Visit https://developer.paypal.com/
echo 2. Login and go to: Dashboard ^> My Apps ^& Credentials
echo 3. Under "Sandbox", create a new REST API app
echo 4. Copy Client ID and Secret to .env.local
echo.

echo [Step 2] Database Migration
echo File: public\b2chat\B2Chat-main\prisma\migrations\add_payment_messages.sql
echo.
echo Run this command (replace with your DB details):
echo psql -U postgres -d your_database -f "public\b2chat\B2Chat-main\prisma\migrations\add_payment_messages.sql"
echo.

echo [Step 3] Verify Installation
echo After completing Steps 1 and 2:
echo 1. Start the app: npm run dev
echo 2. Open a chat conversation
echo 3. Look for the green $ button next to message input
echo 4. Click it to test the payment flow
echo.

echo ========================================
echo Documentation:
echo ========================================
echo - Quick Start: public\b2chat\B2Chat-main\PAYPAL_README.md
echo - Setup Guide: public\b2chat\B2Chat-main\PAYPAL_SETUP.md
echo - Full Docs: .gemini\antigravity\brain\...\walkthrough.md
echo.

echo ========================================
echo Test Payment:
echo ========================================
echo Run: node public\b2chat\B2Chat-main\test-paypal-payment.js
echo.

pause
