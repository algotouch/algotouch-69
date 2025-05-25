const DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true';

export function debugLog(...args: unknown[]): void {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}
