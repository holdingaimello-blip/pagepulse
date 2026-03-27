const https = require('https');

// Deploy function to Supabase using Management API
const SUPABASE_PROJECT_REF = 'ksxzytsvrrspeofweleo';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

const functionCode = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = { 'Access-Control-Allow-Origin': '*' }
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { text, visibility = 'PUBLIC' } = await req.json()
    if (!text) return new Response(JSON.stringify({ error: 'Missing post text' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    const { data: authData } = await supabase.from('holding_auth').select('*').eq('provider', 'linkedin').single()
    if (!authData) return new Response(JSON.stringify({ error: 'No LinkedIn auth' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    const userInfo = await (await fetch('https://api.linkedin.com/v2/userinfo', { headers: { 'Authorization': \`Bearer \${authData.access_token}\` } })).json()
    const post = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${authData.access_token}\`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
      body: JSON.stringify({ author: \`urn:li:person:\${userInfo.sub}\`, lifecycleState: 'PUBLISHED', specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'NONE' } }, visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': visibility } })
    })
    if (!post.ok) return new Response(JSON.stringify({ error: 'Post failed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    return new Response(JSON.stringify({ success: true, post_id: (await post.json()).id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})`;

const data = JSON.stringify({
  slug: 'linkedin-post',
  name: 'linkedin-post',
  source: functionCode
});

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${SUPABASE_PROJECT_REF}/functions`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => responseData += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
