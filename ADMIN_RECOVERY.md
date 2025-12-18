# Admin Access Recovery

## Issue
Admin lost access due to forgotten password and "Invalid Credentials" error.

## Solution
We have reset the admin password using a direct database script.

### Credentials
- **User:** `localadmin@test.com`
- **Pass:** `admin123`

### Scripts Added
- `scripts/create-local-admin.js`: Ensures admin user exists.
- `scripts/force-reset-admin.js`: Overwrites password hash to `admin123`.
- `scripts/kpi-report.js`: Generates system metrics.

## Usage
Run `node scripts/force-reset-admin.js` if access is lost again.
