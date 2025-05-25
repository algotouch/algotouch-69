import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { transpileModule } from 'typescript';

async function loadHook(reactMock, authMock) {
  const sourcePath = path.resolve('src/components/payment/hooks/useRegistrationData.ts');
  const tsSource = fs.readFileSync(sourcePath, 'utf8');
  const { outputText } = transpileModule(tsSource, {
    compilerOptions: { module: 'ES2020', target: 'ES2020' }
  });

  const withoutImports = outputText
    .replace(/import[^;]+react';\n/, '')
    .replace(/import[^;]+auth';\n/, '')
    .replace(/import[^;]+payment';\n/, '');

  const moduleCode = `const { useState, useEffect } = global.reactMock;\n` +
    `const useAuth = () => global.authMock;\n` + withoutImports;

  const dataUrl = `data:text/javascript;base64,${Buffer.from(moduleCode).toString('base64')}`;

  global.reactMock = reactMock;
  global.authMock = authMock;
  return import(dataUrl);
}

function createReactMock() {
  const state = [];
  let cursor = 0;
  const react = {
    useState(init) {
      const idx = cursor++;
      if (state[idx] === undefined) state[idx] = init;
      const set = val => { state[idx] = typeof val === 'function' ? val(state[idx]) : val; };
      return [state[idx], set];
    },
    useEffect() {}
  };
  return {
    state,
    react,
    reset() { cursor = 0; }
  };
}

test('update and clear registration data syncs with context', async () => {
  const reactMockHelper = createReactMock();
  const reactMock = reactMockHelper.react;

  let contextRegistrationData = { email: 'test@example.com', planId: 'vip' };
  const authMock = {
    get registrationData() { return contextRegistrationData; },
    setRegistrationData: (data) => { contextRegistrationData = { ...contextRegistrationData, ...data }; },
    clearRegistrationData: () => { contextRegistrationData = null; },
    isRegistering: false,
    pendingSubscription: false,
    setPendingSubscription: () => {}
  };

  const { useRegistrationData } = await loadHook(reactMock, authMock);

  function render() {
    reactMockHelper.reset();
    return useRegistrationData();
  }

  let hook = render();
  assert.deepEqual(hook.registrationData, contextRegistrationData);

  hook.updateRegistrationData({ contractSigned: true });
  hook = render();
  assert.equal(contextRegistrationData.contractSigned, true);
  assert.equal(hook.registrationData.contractSigned, true);

  hook.clearRegistrationData();
  hook = render();
  assert.equal(hook.registrationData, null);
  assert.equal(contextRegistrationData, null);
});

