// Edge Function: linkedin-callback
// Intercetta code da LinkedIn, scambia per token, salva in holding_auth

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    const error_description = url.searchParams.get('error_description')

    // Check for OAuth errors
    if (error) {
      console.error('LinkedIn OAuth error:', error, error_description)
      return new Response(
        JSON.stringify({ error, error_description }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get secrets from environment
    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET')
    const redirectUri = Deno.env.get('LINKEDIN_REDIRECT_URI') || `${url.origin}/functions/v1/linkedin-callback`

    if (!clientId || !clientSecret) {
      console.error('Missing LinkedIn credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to exchange code for token', details: errorData }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenData = await tokenResponse.json()
    
    // Calculate expiration
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Save tokens to holding_auth
    const { data, error: dbError } = await supabase
      .from('holding_auth')
      .upsert({
        provider: 'linkedin',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: expiresAt,
        scope: tokenData.scope || 'w_member_social',
      }, {
        onConflict: 'provider'
      })
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save tokens', details: dbError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'LinkedIn authentication successful',
        expires_at: expiresAt,
        scope: tokenData.scope
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
