#!/usr/bin/env node

/**
 * Test Suite - Creatiendas Features
 * Prueba todas las funcionalidades principales de la aplicación
 */

const https = require('https');
const http = require('http');

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function testRequest(url, description) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;

        log(`\n🧪 Testing: ${description}`, 'cyan');
        log(`   URL: ${url}`, 'blue');

        const startTime = Date.now();

        protocol.get(url, (res) => {
            const duration = Date.now() - startTime;

            if (res.statusCode === 200) {
                log(`   ✅ PASS - Status: ${res.statusCode} (${duration}ms)`, 'green');
                resolve({ success: true, status: res.statusCode, duration });
            } else {
                log(`   ⚠️  WARN - Status: ${res.statusCode} (${duration}ms)`, 'yellow');
                resolve({ success: false, status: res.statusCode, duration });
            }
        }).on('error', (err) => {
            const duration = Date.now() - startTime;
            log(`   ❌ FAIL - Error: ${err.message} (${duration}ms)`, 'red');
            resolve({ success: false, error: err.message, duration });
        });
    });
}

async function runTests() {
    log('\n' + '='.repeat(60), 'cyan');
    log('🚀 CREATIENDAS - FEATURE TEST SUITE', 'cyan');
    log('='.repeat(60) + '\n', 'cyan');

    const tests = [
        // Core Pages
        {
            url: 'http://localhost:3002',
            description: 'Home Page (Landing)'
        },
        {
            url: 'http://localhost:3002/auth/login',
            description: 'Login Page'
        },
        {
            url: 'http://localhost:3002/auth/register',
            description: 'Register Page'
        },

        // Unified Views
        {
            url: 'http://localhost:3002/unified-view.html',
            description: 'Unified View (Store + Chat + Wallet)'
        },
        {
            url: 'http://localhost:3002/dual-preview',
            description: 'Dual App Preview'
        },
        {
            url: 'http://localhost:3002/enterprise',
            description: 'Enterprise Interface'
        },

        // Dashboard & Features
        {
            url: 'http://localhost:3002/dashboard',
            description: 'User Dashboard'
        },
        {
            url: 'http://localhost:3002/builder',
            description: 'Store Builder'
        },
        {
            url: 'http://localhost:3002/wallet',
            description: 'Wallet Page'
        },

        // External Services
        {
            url: 'https://b2-chat-ruddy.vercel.app',
            description: 'B2BChat Live (Vercel)'
        }
    ];

    const results = [];

    for (const test of tests) {
        const result = await testRequest(test.url, test.description);
        results.push({ ...test, ...result });
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay between tests
    }

    // Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 TEST SUMMARY', 'cyan');
    log('='.repeat(60) + '\n', 'cyan');

    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const total = results.length;
    const avgDuration = Math.round(results.reduce((sum, r) => sum + r.duration, 0) / total);

    log(`Total Tests: ${total}`, 'blue');
    log(`✅ Passed: ${passed}`, 'green');
    log(`❌ Failed: ${failed}`, 'red');
    log(`⏱️  Avg Response Time: ${avgDuration}ms`, 'yellow');

    if (failed > 0) {
        log('\n⚠️  Failed Tests:', 'yellow');
        results.filter(r => !r.success).forEach(r => {
            log(`   - ${r.description}`, 'red');
            if (r.error) log(`     Error: ${r.error}`, 'red');
        });
    }

    log('\n' + '='.repeat(60) + '\n', 'cyan');

    // Exit code
    process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
    log(`\n❌ Test suite failed: ${err.message}`, 'red');
    process.exit(1);
});
