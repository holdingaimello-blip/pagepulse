// Edge Function: linkedin-post
// Pubblica post su LinkedIn usando token da holding_auth

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
    // Parse request body
    const { text, visibility = 'PUBLIC' } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Missing post text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get LinkedIn tokens
    const { data: authData, error: fetchError } = await supabase
      .from('holding_auth')
      .select('*')
      .eq('provider', 'linkedin')
      .single()

    if (fetchError || !authData) {
      console.error('No LinkedIn auth found:', fetchError)
      return new Response(
        JSON.stringify({ error: 'No LinkedIn authentication found. Please authenticate first.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if token is expired
    if (authData.expires_at && new Date(authData.expires_at) < new Date()) {
      console.error('Token expired')
      return new Response(
        JSON.stringify({ error: 'Token expired. Please refresh or re-authenticate.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user URN from LinkedIn
    const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.text()
      console.error('Failed to get user info:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to get LinkedIn user info', details: errorData }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userInfo = await userInfoResponse.json()
    const authorUrn = `urn:li:person:${userInfo.sub}`

    // Create post
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
      }),
    })

    if (!postResponse.ok) {
      const errorData = await postResponse.text()
      console.error('Failed to create post:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to create LinkedIn post', details: errorData }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const postData = await postResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Post published successfully',
        post_id: postData.id,
        author: authorUrn
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
