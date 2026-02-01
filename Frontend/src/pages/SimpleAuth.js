import React, { useState } from 'react';

const SimpleAuth = () => {
  const [email, setEmail] = useState('khoa@gmail.com');
  const [password, setPassword] = useState('123456');
  const [result, setResult] = useState('');

  const testLogin = async () => {
    setResult('Testing...');
    
    try {
      console.log('Sending data:', { email, password });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`SUCCESS: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`FAILED: ${JSON.stringify(data, null, 2)}`);
      }
      
    } catch (error) {
      setResult(`ERROR: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Simple Auth Test</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Password:</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      
      <button onClick={testLogin} style={{ padding: '10px 20px' }}>
        Test Login
      </button>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
        <h4>Result:</h4>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default SimpleAuth;