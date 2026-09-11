const test = require('node:test');
const assert = require('node:assert');
const { app } = require('../src/server');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /api/public/stock returns enriched inventory with blood bank details', async () => {
  const res = await fetch(`${baseUrl}/api/public/stock`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.stocks.length > 0);
  const sample = data.stocks[0];
  assert.ok(sample.bloodGroup);
  assert.ok(sample.component);
  assert.ok(sample.bloodBank);
  assert.ok(sample.bloodBank.name);
});

test('GET /api/public/stock?state=Delhi&bloodGroup=O+ filters accurately', async () => {
  const res = await fetch(`${baseUrl}/api/public/stock?state=Delhi&bloodGroup=O%2B`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.stocks.length > 0);
  data.stocks.forEach((s) => {
    assert.strictEqual(s.state, 'Delhi');
    assert.strictEqual(s.bloodGroup, 'O+');
  });
});

test('GET /api/public/blood-banks returns licensed facilities', async () => {
  const res = await fetch(`${baseUrl}/api/public/blood-banks`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.bloodBanks.length >= 10);
  const aiims = data.bloodBanks.find(b => b.name.includes('AIIMS'));
  assert.ok(aiims);
  assert.ok(aiims.licenseNumber);
});

test('GET /api/public/verify-certificate/:id verifies pre-seeded authentic certificate', async () => {
  const certId = 'ERK-CERT-2024-88412';
  const res = await fetch(`${baseUrl}/api/public/verify-certificate/${certId}`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.verified, true);
  assert.strictEqual(data.status, 'AUTHENTIC_VERIFIED');
  assert.ok(data.certificate.qrCode);
  assert.ok(data.certificate.verificationHash);
});

test('GET /api/public/verify-certificate/:id rejects invalid certificate', async () => {
  const res = await fetch(`${baseUrl}/api/public/verify-certificate/FAKE-CERT-000`);
  assert.strictEqual(res.status, 404);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.verified, false);
});
