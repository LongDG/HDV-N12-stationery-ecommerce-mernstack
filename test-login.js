// Test login function using native Node.js modules
async function testLogin() {
    console.log('=== TESTING LOGIN FUNCTIONALITY ===');
    
    return new Promise((resolve, reject) => {
        const http = require('http');
        
        const loginData = {
            email: 'khoa@gmail.com',
            password: '123456'
        };

        const postData = JSON.stringify(loginData);
        
        console.log('Sending login request...');
        console.log('Data:', postData);
        
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('\n✅ LOGIN SUCCESS!');
                    console.log('Status:', res.statusCode);
                    console.log('Response:', JSON.stringify(response, null, 2));
                    resolve(response);
                } catch (error) {
                    console.log('\n❌ PARSE ERROR!');
                    console.log('Raw response:', data);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log('\n❌ LOGIN FAILED!');
            console.log('Error:', error.message);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Test frontend proxy
async function testFrontendProxy() {
    console.log('\n=== TESTING FRONTEND PROXY ===');
    
    return new Promise((resolve, reject) => {
        const http = require('http');
        
        const loginData = {
            email: 'khoa@gmail.com',
            password: '123456'
        };

        const postData = JSON.stringify(loginData);
        
        console.log('Testing frontend proxy at http://localhost:3000/api/auth/login');
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('✅ FRONTEND PROXY SUCCESS!');
                    console.log('Status:', res.statusCode);
                    console.log('Response:', JSON.stringify(response, null, 2));
                    resolve(response);
                } catch (error) {
                    console.log('❌ FRONTEND PROXY FAILED!');
                    console.log('Status:', res.statusCode);
                    console.log('Raw response:', data);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ FRONTEND PROXY FAILED!');
            console.log('No response - Frontend might not be running');
            console.log('Error:', error.message);
            resolve(null); // Don't reject, just resolve with null
        });

        req.write(postData);
        req.end();
    });
}

// Run tests
async function runTests() {
    try {
        // Test direct backend
        await testLogin();
        
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test frontend proxy
        await testFrontendProxy();
        
    } catch (error) {
        console.log('\nTest suite failed');
        process.exit(1);
    }
}

// Run the tests
runTests();