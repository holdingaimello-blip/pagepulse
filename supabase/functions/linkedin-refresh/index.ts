// Edge Function: linkedin-refresh
// Refresha il token LinkedIn ogni 30 giorni

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

  // Verify cron secret if called via cron
  const cronSecret = req.headers.get('X-Cron-Secret')
  const expectedCronSecret = Deno.env.get('CRON_SECRET')
  
  if (expectedCronSecret && cronSecret !== expectedCronSecret) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get current LinkedIn tokens
    const { data: authData, error: fetchError } = await supabase
      .from('holding_auth')
      .select('*')
      .eq('provider', 'linkedin')
      .single()

    if (fetchError || !authData) {
      console.error('No LinkedIn auth found:', fetchError)
      return new Response(
        JSON.stringify({ error: 'No LinkedIn authentication found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!authData.refresh_token) {
      console.error('No refresh token available')
      return new Response(
        JSON.stringify({ error: 'No refresh token available. Re-authentication required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get secrets
    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      throw new Error('Missing LinkedIn credentials')
    }

    // Refresh token
    const refreshResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: authData.refresh_token,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!refreshResponse.ok) {
      const errorData = await refreshResponse.text()
      console.error('Token refresh failed:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to refresh token', details: errorData }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenData = await refreshResponse.json()

    // Calculate new expiration
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null

    // Update tokens in database
    const { data, error: updateError } = await supabase
      .from('holding_auth')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || authData.refresh_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('provider', 'linkedin')
      .select()

    if (updateError) {
      console.error('Database update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update tokens', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Token refreshed successfully',
        expires_at: expiresAt
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
