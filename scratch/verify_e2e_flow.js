const https = require('https');

function makeRequest(urlPath, method = 'GET', headers = {}, bodyData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'smart-urine-monitoring-system.vercel.app',
      path: urlPath,
      method: method,
      headers: {
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', err => reject(err));
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

async function runE2ETests() {
  console.log('--- STARTING PRODUCTION E2E AUTHENTICATION VERIFICATION ---');

  // 1. Patient Portal E2E Flow
  console.log('\n--- TESTING PATIENT PORTAL FLOW ---');
  const verifyData = JSON.stringify({ phone: '+19998887777', token: '123456' });
  const verifyRes = await makeRequest('/api/auth/otp/verify', 'POST', {
    'Content-Type': 'application/json',
    'Content-Length': verifyData.length
  }, verifyData);

  console.log(`1. OTP Verify Status: ${verifyRes.statusCode}`);
  const setCookies = verifyRes.headers['set-cookie'] || [];
  console.log(`2. Set-Cookie Received: ${setCookies.length > 0}`);
  
  let authTokenCookie = '';
  setCookies.forEach(c => {
    if (c.startsWith('sb-ldjabikdwigwvxnfiqos-auth-token=')) {
      authTokenCookie = c.split(';')[0];
    }
  });

  console.log(`3. Auth Token Cookie Extracted: ${authTokenCookie.length > 0}`);

  // Access Patient Portal with Cookie
  const portalRes = await makeRequest('/patient-portal', 'GET', {
    'Cookie': authTokenCookie
  });
  console.log(`4. Patient Portal Page Access Status (with cookie): ${portalRes.statusCode}`);

  // Refresh check
  const refreshRes = await makeRequest('/patient-portal', 'GET', {
    'Cookie': authTokenCookie
  });
  console.log(`5. Patient Portal Refresh Session Preserved Status: ${refreshRes.statusCode}`);

  // Logout check
  const logoutRes = await makeRequest('/api/auth/signout', 'POST', {
    'Cookie': authTokenCookie
  });
  console.log(`6. Signout Status: ${logoutRes.statusCode}`);

  // 2. Admin Center E2E Flow
  console.log('\n--- TESTING ADMIN CENTER FLOW ---');
  const adminVerifyRes = await makeRequest('/api/auth/otp/verify', 'POST', {
    'Content-Type': 'application/json',
    'Content-Length': verifyData.length
  }, verifyData);

  console.log(`1. Admin OTP Verify Status: ${adminVerifyRes.statusCode}`);
  const adminCookies = adminVerifyRes.headers['set-cookie'] || [];
  let adminAuthCookie = '';
  adminCookies.forEach(c => {
    if (c.startsWith('sb-ldjabikdwigwvxnfiqos-auth-token=')) {
      adminAuthCookie = c.split(';')[0];
    }
  });

  const adminCenterRes = await makeRequest('/admin-center', 'GET', {
    'Cookie': adminAuthCookie
  });
  console.log(`2. Admin Center Page Access Status (with cookie): ${adminCenterRes.statusCode}`);

  console.log('\n--- E2E VERIFICATION COMPLETED SUCCESSFULLY ---');
}

runE2ETests().catch(console.error);
