export function debugLog(...args: unknown[]): void {
  const debug = Deno.env.get('DEBUG') === 'true' || Deno.env.get('NODE_ENV') !== 'production';
  if (debug) {
    console.log(...args);
  }
}
