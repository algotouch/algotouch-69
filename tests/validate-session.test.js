import test from 'node:test';
import assert from 'node:assert/strict';

const url = process.env.VALIDATE_SESSION_URL ||
  'http://localhost:54321/functions/v1/validate-session';

// Helper mirroring client logic for deciding if a session should remain active
function shouldKeepSession(error) {
  if (error && error.status === 401) {
    return false;
  }
  if (error) {
    console.error('Session validation error:', error);
  }
  return true;
}

test('validate-session returns 401 without token', async (t) => {
  let response;
  try {
    response = await fetch(url, { method: 'POST' });
  } catch (err) {
    t.skip('Edge function server not reachable');
    return;
  }
  assert.equal(response.status, 401);
});

test('shouldKeepSession returns false for 401 errors', () => {
  assert.equal(shouldKeepSession({ status: 401 }), false);
});

test('shouldKeepSession keeps session for other errors', () => {
  assert.equal(shouldKeepSession({ status: 500 }), true);
});
