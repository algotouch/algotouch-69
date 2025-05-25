import test from 'node:test';
import assert from 'node:assert/strict';

const url = process.env.VALIDATE_SESSION_URL || 'http://localhost:54321/functions/v1/validate-session';

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
