const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { app } = require('../src/server');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    // Listen on random available port for testing
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

test('GET /api/public/health returns 200 and UP status', async () => {
  const res = await fetch(`${baseUrl}/api/public/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'UP');
  assert.strictEqual(data.service, 'e-RaktKosh Connect API');
});

test('GET /api/public/stats returns national metrics', async () => {
  const res = await fetch(`${baseUrl}/api/public/stats`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.stats.totalUnitsAvailable > 0);
  assert.ok(data.stats.licensedBloodBanks >= 1);
  assert.ok(data.stats.registeredDonors >= 1);
});

test('GET /api/public/states returns list of Indian states', async () => {
  const res = await fetch(`${baseUrl}/api/public/states`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.states));
  assert.ok(data.states.includes('Delhi'));
});

test('GET /api/public/districts?state=Delhi returns districts', async () => {
  const res = await fetch(`${baseUrl}/api/public/districts?state=Delhi`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.districts));
  assert.ok(data.districts.length > 0);
});

test('GET /api/public/camps returns scheduled donation drives', async () => {
  const res = await fetch(`${baseUrl}/api/public/camps`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.camps));
  assert.ok(data.camps.length >= 1);
});

test('GET /api/public/emergency returns emergency blood requests', async () => {
  const res = await fetch(`${baseUrl}/api/public/emergency`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(Array.isArray(data.requests));
});
