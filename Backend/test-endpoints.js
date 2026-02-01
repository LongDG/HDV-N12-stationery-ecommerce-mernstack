// Test script để kiểm tra các endpoints đã fix
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('🧪 Testing fixed endpoints...\n');

  try {
    // Test 1: Best-seller products
    console.log('1. Testing /products/best-seller...');
    const bestSellerRes = await axios.get(`${BASE_URL}/products/best-seller?limit=5`);
    console.log('✅ Best-seller endpoint works!');
    console.log(`   Found ${bestSellerRes.data.count} products\n`);

    // Test 2: Featured products
    console.log('2. Testing /products/featured...');
    const featuredRes = await axios.get(`${BASE_URL}/products/featured?limit=5`);
    console.log('✅ Featured endpoint works!');
    console.log(`   Found ${featuredRes.data.count} products\n`);

    // Test 3: Get a product ID for testing related products
    console.log('3. Getting product list for testing...');
    const productsRes = await axios.get(`${BASE_URL}/products?limit=1`);
    if (productsRes.data.data && productsRes.data.data.length > 0) {
      const testProductId = productsRes.data.data[0]._id;
      
      // Test 4: Related products
      console.log(`4. Testing /products/${testProductId}/related...`);
      const relatedRes = await axios.get(`${BASE_URL}/products/${testProductId}/related?limit=4`);
      console.log('✅ Related products endpoint works!');
      console.log(`   Found ${relatedRes.data.count} related products\n`);

      // Test 5: Individual product fetch
      console.log(`5. Testing /products/${testProductId}...`);
      const productRes = await axios.get(`${BASE_URL}/products/${testProductId}`);
      console.log('✅ Individual product endpoint works!');
      console.log(`   Product: ${productRes.data.data.name}\n`);
    }

    // Test 6: Invalid ObjectId handling
    console.log('6. Testing invalid ObjectId handling...');
    try {
      await axios.get(`${BASE_URL}/products/invalid-id`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Invalid ObjectId properly handled!');
        console.log(`   Error: ${error.response.data.message}\n`);
      } else {
        throw error;
      }
    }

    console.log('🎉 All endpoint tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run if script is executed directly
if (require.main === module) {
  testEndpoints();
}

module.exports = testEndpoints;