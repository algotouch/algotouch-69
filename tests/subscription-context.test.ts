import test from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { fetchSubscriptionRecord } from '../src/contexts/subscription/SubscriptionContext';
import { supabase } from '../src/integrations/supabase/client';

// Use ts-node loader when running this test:
// node --test --loader ts-node/esm tests/subscription-context.test.ts

test('fetchSubscriptionRecord throws on query failure', async () => {
  const restore = mock.method(supabase, 'from', () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: null, error: new Error('fail') })
      })
    })
  }));

  await assert.rejects(() => fetchSubscriptionRecord('1'), /fail/);
  restore.mock.restore();
});
