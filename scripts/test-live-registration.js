
const https = require('https');

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function apiRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'creatiendas.co',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function testLiveRegistration() {
    log('🚀 TESTING LIVE REGISTRATION ENDPOINT (creatiendas.co)', 'cyan');

    const email = `test_live_${Date.now()}@test.com`;
    const password = "TestPassword123";
    const name = "Live Test User";

    log(`\nPARAMS:`, 'yellow');
    log(`  Email: ${email}`, 'reset');
    log(`  Name:  ${name}`, 'reset');

    try {
        log(`\n[1] Pinging /auth/register page...`, 'cyan');
        const pageRes = await apiRequest('GET', '/auth/register');
        if (pageRes.statusCode === 200) {
            log(`✅ Page is UP (Status: 200)`, 'green');
        } else {
            log(`❌ Page returned status: ${pageRes.statusCode}`, 'red');
        }

        log(`\n[2] Sending Registration POST Request to /api/auth/register...`, 'cyan');
        const apiRes = await apiRequest('POST', '/api/auth/register', {
            name,
            email,
            password
        });

        log(`   Status: ${apiRes.statusCode}`, 'yellow');

        try {
            const jsonBody = JSON.parse(apiRes.body);
            log(`   Response Body:`, 'reset');
            if (apiRes.statusCode === 201) {
                log(`✅ SUCCESS! User ID: ${jsonBody.userId}`, 'green');
                log(`   Message: ${jsonBody.message}`, 'green');
            } else {
                log(`❌ FAILED. Message: ${jsonBody.message}`, 'red');
                if (jsonBody.debugError) log(`   Debug Error: ${jsonBody.debugError}`, 'red');
                else log(`   Raw Body: ${apiRes.body}`, 'red');
            }
        } catch (e) {
            log(`❌ FAILED to parse JSON response.`, 'red');
            log(`   Raw Body Payload (First 200 chars): ${apiRes.body.substring(0, 200)}...`, 'red');
        }

    } catch (err) {
        log(`❌ NETWORK ERROR: ${err.message}`, 'red');
    }
}

testLiveRegistration();
