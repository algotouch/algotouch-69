import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  return null;
}

function unauthorized(message: string) {
  return new Response(
    JSON.stringify({ error: message }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
  );
}

serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return unauthorized('Missing Authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  let payload: { session_id?: string; sub?: string };
  try {
    payload = JSON.parse(atob(token.split('.')[1]));
  } catch {
    return unauthorized('Invalid JWT');
  }

  const sessionId = payload.session_id;
  const userId = payload.sub;
  if (!sessionId || !userId) {
    return unauthorized('Invalid JWT payload');
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );

  const { data: session, error } = await supabaseAdmin
    .schema('auth')
    .from('sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (error || !session) {
    return unauthorized('Session not found');
  }

  return new Response(
    JSON.stringify({ valid: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  );
});
