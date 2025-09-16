import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Set the auth context
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authorization token')
    }

    const { target_entity_id, target_entity_type, target_user_id } = await req.json()

    if (!target_entity_id || !target_entity_type) {
      throw new Error('Missing required parameters: target_entity_id and target_entity_type')
    }

    // Check if user has already unlocked this contact info
    const { data: existingAccess } = await supabaseClient
      .from('contact_access_logs')
      .select('contact_info')
      .eq('user_id', user.id)
      .eq('target_entity_id', target_entity_id)
      .eq('target_entity_type', target_entity_type)
      .single()

    if (existingAccess) {
      return new Response(JSON.stringify({
        success: true,
        contact_info: existingAccess.contact_info,
        message: 'Contact info already unlocked'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check user's credit balance
    const { data: userCredits, error: creditsError } = await supabaseClient
      .from('user_credits')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    if (creditsError || !userCredits || userCredits.balance < 1) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Insufficient credits. You need 1 credit to unlock contact information.',
        credits_needed: 1,
        current_balance: userCredits?.balance || 0
      }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get contact information based on entity type
    let contactInfo = {}
    let tableName = ''

    switch (target_entity_type) {
      case 'profile':
        tableName = 'profiles'
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('email, phone, preferred_contact_method')
          .eq('id', target_entity_id)
          .single()
        
        if (profileError) throw new Error('Failed to fetch profile data')
        contactInfo = profileData
        break

      case 'consultant_company':
        tableName = 'consultant_companies'
        const { data: consultantData, error: consultantError } = await supabaseClient
          .from('consultant_companies')
          .select('email, phone')
          .eq('id', target_entity_id)
          .single()
        
        if (consultantError) throw new Error('Failed to fetch consultant data')
        contactInfo = consultantData
        break

      case 'equipment_company':
        tableName = 'equipment_companies'
        const { data: equipmentData, error: equipmentError } = await supabaseClient
          .from('equipment_companies')
          .select('email, phone')
          .eq('id', target_entity_id)
          .single()
        
        if (equipmentError) throw new Error('Failed to fetch equipment company data')
        contactInfo = equipmentData
        break

      case 'provider':
        tableName = 'providers'
        const { data: providerData, error: providerError } = await supabaseClient
          .from('providers')
          .select('email, phone')
          .eq('id', target_entity_id)
          .single()
        
        if (providerError) throw new Error('Failed to fetch provider data')
        contactInfo = providerData
        break

      default:
        throw new Error('Invalid entity type')
    }

    // Use charge_credits function to deduct credits
    const { data: chargeResult, error: chargeError } = await supabaseClient
      .rpc('charge_credits', {
        p_user_id: user.id,
        p_api_key_id: null,
        p_amount: 1,
        p_description: `Contact info access for ${target_entity_type}`,
        p_metadata: {
          target_entity_id,
          target_entity_type,
          target_user_id: target_user_id || null
        }
      })

    if (chargeError || !chargeResult) {
      throw new Error('Failed to charge credits')
    }

    // Log the contact access
    const { error: logError } = await supabaseClient
      .from('contact_access_logs')
      .insert({
        user_id: user.id,
        target_user_id: target_user_id || null,
        target_entity_id,
        target_entity_type,
        credits_charged: 1,
        contact_info: contactInfo
      })

    if (logError) {
      console.error('Failed to log contact access:', logError)
      // Don't throw error here as the main operation succeeded
    }

    return new Response(JSON.stringify({
      success: true,
      contact_info: contactInfo,
      credits_charged: 1,
      message: 'Contact information unlocked successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in unlock-contact-info function:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})