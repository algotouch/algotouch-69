export function envCheck(requiredVars: string[]): void {
  const missing: string[] = [];
  for (const key of requiredVars) {
    if (!Deno.env.get(key)) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
