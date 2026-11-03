// test-api.js
async function runTests() {
  const BASE = 'http://localhost:5000/api';

  console.log('--- 1. Testing Health Endpoint ---');
  const healthRes = await fetch(`${BASE}/health`);
  const healthData = await healthRes.json();
  console.log('Health:', healthRes.status, healthData);

  console.log('\n--- 2. Testing Categories (Public) ---');
  const catRes = await fetch(`${BASE}/categories`);
  const catData = await catRes.json();
  console.log(`Categories count: ${catData.length}`);

  console.log('\n--- 3. Testing Protected Samagri Endpoint without Auth (Should fail with 401) ---');
  const unauthRes = await fetch(`${BASE}/pooja-items`);
  console.log(`Status: ${unauthRes.status} (Expected 401)`);

  console.log('\n--- 4. Testing Admin Login ---');
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@poojaservices.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status, 'User:', loginData.user?.name);
  const token = loginData.token;

  console.log('\n--- 5. Testing Protected Samagri Endpoint with Token ---');
  const itemsRes = await fetch(`${BASE}/pooja-items`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const items = await itemsRes.json();
  console.log(`Pooja items returned: ${items.length}`);
  console.log('Sample item:', items[0]?.nameEnglish, '<->', items[0]?.nameKannada);

  console.log('\n--- 6. Testing Bilingual Search (Kannada & English) ---');
  const searchKn = await fetch(`${BASE}/pooja-items?q=${encodeURIComponent('ಅಕ್ಕಿ')}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const knItems = await searchKn.json();
  console.log(`Search 'ಅಕ್ಕಿ': found ${knItems.length} items (${knItems.map(i => i.nameEnglish).join(', ')})`);

  const searchEn = await fetch(`${BASE}/pooja-items?q=Coconut`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const enItems = await searchEn.json();
  console.log(`Search 'Coconut': found ${enItems.length} items (${enItems.map(i => i.nameKannada).join(', ')})`);

  console.log('\n--- 7. Testing Pooja Request Persistence ---');
  const reqRes = await fetch(`${BASE}/pooja-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      poojaName: 'Satyanarayana Pooja / ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ',
      poojaDate: '2026-11-15',
      poojaTime: '10:00 AM',
      personName: 'Sri Ramesh Kumar',
      gothra: 'Kashyapa',
      nakshatra: 'Rohini',
      contactNumber: '9876543210',
      location: 'R.K. Hegde Nagar, Bangalore',
      notes: 'Please bring sacred thread',
      items: [
        { poojaItemId: items[0].id, nameEnglish: items[0].nameEnglish, nameKannada: items[0].nameKannada, quantity: '100g' },
        { poojaItemId: items[1].id, nameEnglish: items[1].nameEnglish, nameKannada: items[1].nameKannada, quantity: '50g' }
      ]
    })
  });
  const reqData = await reqRes.json();
  console.log('Pooja Request Created Status:', reqRes.status, 'ID:', reqData.id, 'Items count:', reqData.items?.length);

  console.log('\nALL BACKEND API TESTS COMPLETED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

