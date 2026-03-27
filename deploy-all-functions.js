const https = require('https');

const SUPABASE_PROJECT_REF = 'ksxzytsvrrspeofweleo';
const SUPABASE_ACCESS_TOKEN = 'sbp_1fbc3894e9622edd14a5e75be52405b656e6f43c';

// Function 1: linkedin-callback
const callbackCode = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (!code) return new Response(JSON.stringify({ error: 'Missing code' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET')
    const redirectUri = Deno.env.get('LINKEDIN_REDIRECT_URI') || \`\${url.origin}/functions/v1/linkedin-callback\`
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, client_id: clientId, client_secret: clientSecret })
    })
    if (!tokenRes.ok) return new Response(JSON.stringify({ error: 'Token exchange failed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const tokenData = await tokenRes.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    const { error: dbError } = await supabase.from('holding_auth').upsert({
      provider: 'linkedin', access_token: tokenData.access_token, refresh_token: tokenData.refresh_token || null,
      expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null, scope: tokenData.scope || 'w_member_social'
    }, { onConflict: 'provider' })
    if (dbError) return new Response(JSON.stringify({ error: 'DB error', details: dbError }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})`;

// Function 2: linkedin-refresh
const refreshCode = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const cronSecret = req.headers.get('X-Cron-Secret')
  if (Deno.env.get('CRON_SECRET') && cronSecret !== Deno.env.get('CRON_SECRET')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    const { data: authData } = await supabase.from('holding_auth').select('*').eq('provider', 'linkedin').single()
    if (!authData || !authData.refresh_token) return new Response(JSON.stringify({ error: 'No refresh token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const refreshRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: authData.refresh_token, client_id: Deno.env.get('LINKEDIN_CLIENT_ID'), client_secret: Deno.env.get('LINKEDIN_CLIENT_SECRET') })
    })
    if (!refreshRes.ok) return new Response(JSON.stringify({ error: 'Refresh failed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const tokenData = await refreshRes.json()
    await supabase.from('holding_auth').update({
      access_token: tokenData.access_token, refresh_token: tokenData.refresh_token || authData.refresh_token,
      expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null, updated_at: new Date().toISOString()
    }).eq('provider', 'linkedin')
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})`;

// Function 3: linkedin-post
const postCode = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { text, visibility = 'PUBLIC' } = await req.json()
    if (!text) return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    const { data: authData } = await supabase.from('holding_auth').select('*').eq('provider', 'linkedin').single()
    if (!authData) return new Response(JSON.stringify({ error: 'No auth' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (authData.expires_at && new Date(authData.expires_at) < new Date()) return new Response(JSON.stringify({ error: 'Token expired' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const userInfo = await (await fetch('https://api.linkedin.com/v2/userinfo', { headers: { 'Authorization': \`Bearer \${authData.access_token}\` } })).json()
    const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${authData.access_token}\`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
      body: JSON.stringify({ author: \`urn:li:person:\${userInfo.sub}\`, lifecycleState: 'PUBLISHED', specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'NONE' } }, visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': visibility } })
    })
    if (!postRes.ok) return new Response(JSON.stringify({ error: 'Post failed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const postData = await postRes.json()
    return new Response(JSON.stringify({ success: true, post_id: postData.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})`;

function deployFunction(slug, code) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ slug, name: slug, source: code });
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${SUPABASE_PROJECT_REF}/functions`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`, 'Content-Type': 'application/json', 'Content-Length': data.length }
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: responseData }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Deploying linkedin-callback...');
  const r1 = await deployFunction('linkedin-callback', callbackCode);
  console.log('Status:', r1.status, r1.data);
  
  console.log('Deploying linkedin-refresh...');
  const r2 = await deployFunction('linkedin-refresh', refreshCode);
  console.log('Status:', r2.status, r2.data);
  
  console.log('Deploying linkedin-post...');
  const r3 = await deployFunction('linkedin-post', postCode);
  console.log('Status:', r3.status, r3.data);
}

main().catch(console.error);
