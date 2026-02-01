// Test login with sample user
const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing login with sample user...');
        
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'khoa@gmail.com',
            password: '123456'
        });
        
        console.log('✅ Login successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Login failed:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

testLogin();