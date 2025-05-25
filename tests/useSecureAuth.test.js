import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { transpileModule } from 'typescript';

// Helper to load the hook with mocked dependencies
async function loadHook(reactMock, supabaseMock) {
  const sourcePath = path.resolve('src/hooks/useSecureAuth.ts');
  const tsSource = fs.readFileSync(sourcePath, 'utf8');
  const { outputText } = transpileModule(tsSource, {
    compilerOptions: { module: 'ES2020', target: 'ES2020' }
  });

  // Remove import lines and rely on globals
  const withoutImports = outputText
    .replace(/import[^;]+react';\n/, '')
    .replace(/import[^;]+supabase-client';\n/, '');

  const moduleCode = `const { useState, useEffect } = global.reactMock;\n` +
    `const supabase = global.supabaseMock;\n` + withoutImports;

  const dataUrl = `data:text/javascript;base64,${Buffer.from(moduleCode).toString('base64')}`;

  global.reactMock = reactMock;
  global.supabaseMock = supabaseMock;
  return import(dataUrl);
}

test('signIn updates auth state immediately', async () => {
  const state = [];
  let cursor = 0;
  const reactMock = {
    useState: (init) => {
      const idx = cursor++;
      if (state[idx] === undefined) state[idx] = init;
      const set = (val) => { state[idx] = typeof val === 'function' ? val(state[idx]) : val; };
      return [state[idx], set];
    },
    useEffect: () => {}
  };

  const session = { id: 'sess1' };
  const user = { id: 'user1' };
  const supabaseMock = {
    auth: {
      signInWithPassword: async () => ({ data: { session, user }, error: null })
    }
  };

  const { useSecureAuth } = await loadHook(reactMock, supabaseMock);

  function render() {
    cursor = 0;
    return useSecureAuth();
  }

  let hook = render();
  assert.equal(hook.isAuthenticated, false);
  const res = await hook.signIn('e@example.com', 'pw');
  assert.deepEqual(res, { success: true });
  hook = render();
  assert.equal(hook.isAuthenticated, true);
  assert.equal(state[0], session);
  assert.equal(state[1], user);
});
