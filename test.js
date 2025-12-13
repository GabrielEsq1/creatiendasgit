/**
 * Simple Test Script for B2BChat Application
 */

const BASE_URL = 'http://localhost:3000';

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        const result = fn();
        if (result) {
            console.log(`✅ ${name}`);
            passed++;
        } else {
            console.log(`❌ ${name}`);
            failed++;
        }
        tests.push({ name, passed: result });
    } catch (error) {
        console.log(`❌ ${name} - Error: ${error.message}`);
        failed++;
        tests.push({ name, passed: false, error: error.message });
    }
}

async function runTests() {
    console.log('\n🧪 Running Tests...\n');
    
    // Test 1: Server is running
    test('Server is running', async () => {
        try {
            const response = await fetch(BASE_URL);
            return response.status === 200 || response.status === 404;
        } catch {
            return false;
        }
    });
    
    // Test 2: Landing page
    test('Landing page loads', async () => {
        try {
            const response = await fetch(`${BASE_URL}/landing`);
            return response.status === 200;
        } catch {
            return false;
        }
    });
    
    // Test 3: Login page
    test('Login page loads', async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/login`);
            return response.status === 200;
        } catch {
            return false;
        }
    });
    
    // Test 4: Register page
    test('Register page loads', async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/register`);
            return response.status === 200;
        } catch {
            return false;
        }
    });
    
    // Test 5: API routes exist
    test('API routes are accessible', async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'GET'
            });
            return response.status !== 404;
        } catch {
            return false;
        }
    });
    
    // Summary
    console.log('\n' + '='.repeat(40));
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    console.log(`Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);
    
    return failed === 0;
}

// Run tests
if (typeof fetch !== 'undefined') {
    runTests().then(success => {
        process.exit(success ? 0 : 1);
    });
} else {
    console.log('⚠️  fetch is not available. Install node-fetch or run in browser.');
    process.exit(1);
}


