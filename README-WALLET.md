# 💰 Monedera Wallet Integration

The Monedera Wallet has been successfully integrated into the Creatiendas application!

## ✅ Features Implemented

1.  **Wallet Dashboard**: View balance, recent transactions, and quick actions.
2.  **Transfers**: Send money to other users (by email).
3.  **Deposits**: Simulate deposits via PSE, Card, or Nequi.
4.  **Wallet Badge**: A floating button in the Dashboard showing your current balance.
5.  **Unified Integration**: Works seamlessly with the existing authentication.

## 📂 Data Storage

To avoid complex database setup and disk space issues, the wallet uses a **local file-based database**:

-   **File**: `data/wallet-db.json`
-   **Structure**: Stores `accounts` and `ledger` (transactions).
-   **Persistence**: Data is saved automatically to this JSON file.

## 🚀 API Routes

-   `GET /api/wallet`: Fetches user balance and transaction history.
-   `POST /api/wallet/deposit`: Adds funds to a user's account.
-   `POST /api/wallet/transfer`: Transfers funds between users.

## 🛠️ How to Use

1.  **Login** to the Creatiendas Dashboard.
2.  You will see the **Wallet Badge** in the bottom-right corner.
3.  Click the badge or go to `/wallet` to open the Monedera interface.
4.  **Deposit**: Click "Recargar" to add test funds.
5.  **Transfer**: Click "Enviar" to send money to another email (e.g., `test@creatiendas.com`).

## 📝 Notes

-   This implementation is "serverless-ready" and doesn't require a running PostgreSQL instance.
-   To reset the data, simply delete `data/wallet-db.json`.
