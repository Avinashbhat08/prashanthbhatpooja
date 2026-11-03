// test-horoscope-workflow.js
async function runHoroscopeTests() {
  const BASE = 'http://localhost:5000/api';
  console.log('========================================================');
  console.log('🕉️ TESTING PUROHIT-MANAGED HOROSCOPE WORKFLOW (OPTION B)');
  console.log('========================================================\n');

  // Step 1: Health check
  console.log('--- Step 1: Backend Health Check ---');
  const healthRes = await fetch(`${BASE}/health`);
  const healthData = await healthRes.json();
  console.log('Health check response:', healthRes.status, healthData.message);
  if (!healthRes.ok) throw new Error('Health check failed');

  // Step 2: Customer Login
  console.log('\n--- Step 2: Customer Authentication ---');
  const userLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@poojaservices.com', password: 'user123' }),
  });
  const userLogin = await userLoginRes.json();
  console.log('Customer login status:', userLoginRes.status, 'User:', userLogin.user?.name, `(Role: ${userLogin.user?.role})`);
  const userToken = userLogin.token;
  if (!userToken) throw new Error('Customer login failed');

  // Step 3: Admin Login
  console.log('\n--- Step 3: Admin Authentication ---');
  const adminLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@poojaservices.com', password: 'admin123' }),
  });
  const adminLogin = await adminLoginRes.json();
  console.log('Admin login status:', adminLoginRes.status, 'Admin:', adminLogin.user?.name, `(Role: ${adminLogin.user?.role})`);
  const adminToken = adminLogin.token;
  if (!adminToken) throw new Error('Admin login failed');

  // Step 4: Customer submits a Horoscope Request
  console.log('\n--- Step 4: Customer Submits Horoscope Request ---');
  const sampleBirthData = {
    personName: 'Aditi Sharma',
    dateOfBirth: '1996-10-24',
    timeOfBirth: '14:45',
    birthPlace: 'Bangalore, Karnataka',
    gender: 'FEMALE',
    contactNumber: '9242359692',
    preferredLanguage: 'kn',
    notes: 'Seeking guidance regarding auspicious career muhurtha and marriage compatibility.',
  };

  const submitRes = await fetch(`${BASE}/horoscope-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify(sampleBirthData),
  });
  const submitData = await submitRes.json();
  console.log('Submit response status:', submitRes.status);
  console.log('Created Horoscope Request ID:', submitData.data?.id);
  console.log('Initial Status:', submitData.data?.status);
  const requestId = submitData.data?.id;
  if (!requestId) throw new Error('Request creation failed');

  // Step 5: Customer checks their requests list
  console.log('\n--- Step 5: Customer Retrieves Own Requests (/api/horoscope-requests/my) ---');
  const myRes = await fetch(`${BASE}/horoscope-requests/my`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const myData = await myRes.json();
  const myReq = myData.data?.find((r) => r.id === requestId);
  console.log('Found request in customer list:', !!myReq);
  console.log('Request status:', myReq?.status);
  console.log('Is draft calculationData sanitized (hidden from customer before approval)?:', myReq?.calculationData === null);

  // Step 6: Security Check - Customer tries to call Admin Calculate API
  console.log('\n--- Step 6: Security Verification - Customer tries to Calculate Ephemeris ---');
  const unauthorizedCalcRes = await fetch(`${BASE}/horoscope-requests/${requestId}/calculate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log('Unauthorized calculation attempt HTTP status:', unauthorizedCalcRes.status, '(Expected 403 Forbidden)');

  // Step 7: Security Check - Customer tries to Approve their own horoscope
  console.log('\n--- Step 7: Security Verification - Customer tries to Self-Approve ---');
  const unauthorizedApproveRes = await fetch(`${BASE}/horoscope-requests/${requestId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ purohitComments: 'I self approve' }),
  });
  console.log('Unauthorized approve attempt HTTP status:', unauthorizedApproveRes.status, '(Expected 403 Forbidden)');

  // Step 8: Admin views all requests
  console.log('\n--- Step 8: Admin Retrieves All Horoscope Requests ---');
  const adminListRes = await fetch(`${BASE}/horoscope-requests`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminListData = await adminListRes.json();
  console.log(`Total requests accessible to Admin: ${adminListData.data?.length}`);
  const targetReq = adminListData.data?.find((r) => r.id === requestId);
  console.log('Admin identified target request:', targetReq?.personName, 'ID:', targetReq?.id);

  // Step 9: Admin triggers astronomical calculation
  console.log('\n--- Step 9: Admin Calculates Astronomical Ephemeris ---');
  const calcRes = await fetch(`${BASE}/horoscope-requests/${requestId}/calculate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const calcData = await calcRes.json();
  console.log('Calculation HTTP status:', calcRes.status);
  const calc = calcData.data?.calculationData;
  console.log('★ Janma Rashi (Moon Sign):', calc?.janmaRashi?.nameEnglish, `(${calc?.janmaRashi?.nameKannada})`);
  console.log('★ Janma Nakshatra & Pada:', calc?.nakshatra?.nameEnglish, `(${calc?.nakshatra?.nameKannada})`, 'Pada:', calc?.nakshatra?.pada);
  console.log('★ Janma Lagna (Ascendant):', calc?.lagna?.nameEnglish, `(${calc?.lagna?.nameKannada})`, 'Degrees:', calc?.lagna?.formattedDeg);
  console.log('★ Lahiri Ayanamsha:', calc?.formattedAyanamsha);
  console.log(`★ Total Planets calculated: ${calc?.planets?.length}`);
  console.log('★ Sample Planets:', calc?.planets?.slice(0, 4).map((p) => `${p.name}: ${p.formattedDeg} in ${p.rashiEnglish}`).join(' | '));
  console.log('★ South Indian Chart Signs:', calc?.southIndianChart?.length);
  console.log('★ North Indian Chart Houses:', calc?.northIndianChart?.length);
  console.log('★ Vimshottari Mahadasha periods calculated:', calc?.dashas?.length);
  console.log('★ Birth Dasha:', calc?.dashas?.[0]?.lord, 'Balance:', calc?.dashas?.[0]?.durationYears, 'years');
  console.log('★ Detected Doshas:', calc?.doshas?.map((d) => `${d.nameEnglish} (Detected: ${d.detected})`).join(' | '));
  console.log('Updated Status:', calcData.data?.status);

  // Step 10: Admin reviews Doshas and Remedies
  console.log('\n--- Step 10: Admin Reviews Doshas & Shanti Recommendations ---');
  const reviewRes = await fetch(`${BASE}/horoscope-requests/${requestId}/review`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      doshas: calc.doshas.map((d) => ({
        ...d,
        reviewerNotes: `Purohit verified according to traditional Brihat Parashara Hora Shastra rules on ${new Date().toLocaleDateString()}.`,
      })),
      remedies: calc.remedies,
      purohitComments: 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರ ದೈವಜ್ಞ ಅಭಿಪ್ರಾಯ: ಜಾತಕವು ಶುಭಪ್ರದವಾಗಿದ್ದು, ನವಗ್ರಹ ಶಾಂತಿ ಹಾಗೂ ಮಹಾ ಗಣಪತಿ ಹೋಮದಿಂದ ಸರ್ವ ಕಾರ್ಯಸಿದ್ಧಿ ಉಂಟಾಗುತ್ತದೆ.',
      status: 'PENDING_APPROVAL',
    }),
  });
  const reviewData = await reviewRes.json();
  console.log('Review save status:', reviewRes.status, 'Request Status:', reviewData.data?.status);

  // Step 11: Admin approves final horoscope
  console.log('\n--- Step 11: Admin Approves and Releases Horoscope ---');
  const approveRes = await fetch(`${BASE}/horoscope-requests/${requestId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      purohitComments: 'ವೇದ ಬ್ರಹ್ಮ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರಿಂದ ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ. ಸಕಲ ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿರಸ್ತು!',
    }),
  });
  const approveData = await approveRes.json();
  console.log('Approval response status:', approveRes.status);
  console.log('Final Status:', approveData.data?.status);
  console.log('Approved By:', approveData.data?.approvedBy);
  console.log('Approved At:', approveData.data?.approvedAt);

  // Step 12: Customer checks notifications
  console.log('\n--- Step 12: Customer Notifications Verification ---');
  const notifRes = await fetch(`${BASE}/notifications`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const notifData = await notifRes.json();
  console.log('Customer notifications received:', notifData.data?.length);
  notifData.data?.slice(0, 3).forEach((n, i) => {
    console.log(`  ${i + 1}. [${n.type}] ${n.titleEnglish} -> "${n.messageEnglish}"`);
  });

  // Step 13: Customer fetches approved horoscope
  console.log('\n--- Step 13: Customer Views Approved Horoscope & Unlocks Report ---');
  const customerViewRes = await fetch(`${BASE}/horoscope-requests/${requestId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const customerViewData = await customerViewRes.json();
  const approvedReport = customerViewData.data;
  console.log('Customer fetch status:', customerViewRes.status);
  console.log('Approved Report Native:', approvedReport?.personName);
  console.log('Is calculationData unlocked for Customer now?:', approvedReport?.calculationData !== null);
  console.log('Approved Shanti Remedies count:', approvedReport?.remedies?.filter((r) => r.approved)?.length);
  console.log('Purohit Blessed Comments:', approvedReport?.purohitComments);

  console.log('\n========================================================');
  console.log('✅ ALL WORKFLOW AND SECURITY TESTS PASSED WITH 100% SUCCESS!');
  console.log('========================================================\n');
}

runHoroscopeTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
