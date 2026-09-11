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

test('POST /api/auth/login succeeds with valid donor credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'donor@eraktkosh.in',
      password: 'Donor@123',
      role: 'donor'
    })
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.token);
  assert.strictEqual(data.user.email, 'donor@eraktkosh.in');
  assert.strictEqual(data.user.role, 'donor');
  assert.strictEqual(data.user.password, undefined); // Ensure sanitized
});

test('POST /api/auth/login succeeds with valid admin credentials', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@aiims.edu',
      password: 'Admin@123',
      role: 'admin'
    })
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.token);
  assert.strictEqual(data.user.role, 'admin');
  assert.ok(data.bloodBank);
});

test('POST /api/auth/login rejects incorrect password with 401', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'donor@eraktkosh.in',
      password: 'WrongPassword999',
      role: 'donor'
    })
  });

  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.success, false);
});

test('POST /api/auth/login rejects mismatched role portal with 403', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'donor@eraktkosh.in',
      password: 'Donor@123',
      role: 'admin' // Deliberate mismatch
    })
  });

  assert.strictEqual(res.status, 403);
  const data = await res.json();
  assert.strictEqual(data.success, false);
});

test('POST /api/auth/register rejects invalid email and blood group', async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Donor',
      email: 'not-an-email',
      password: 'pass',
      bloodGroup: 'INVALID_GROUP'
    })
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
});

test('GET /api/auth/me rejects unauthenticated requests with 401', async () => {
  const res = await fetch(`${baseUrl}/api/auth/me`);
  assert.strictEqual(res.status, 401);
});

test('GET /api/auth/me succeeds with valid Bearer token', async () => {
  // First login
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'donor@eraktkosh.in',
      password: 'Donor@123',
      role: 'donor'
    })
  });
  const { token } = await loginRes.json();

  // Then fetch me
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  assert.strictEqual(meRes.status, 200);
  const meData = await meRes.json();
  assert.strictEqual(meData.success, true);
  assert.strictEqual(meData.user.email, 'donor@eraktkosh.in');
});
