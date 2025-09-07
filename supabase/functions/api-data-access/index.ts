import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHash } from "https://deno.land/std@0.190.0/hash/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

interface ApiKeyData {
  id: string;
  user_id: string;
  is_active: boolean;
  permissions: any;
  rate_limit: number;
  usage_count: number;
  last_used_at: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Get API key from header
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key required" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Hash the API key for lookup
    const hasher = createHash("sha256");
    hasher.update(apiKey);
    const keyHash = hasher.toString();

    // Validate API key
    const { data: apiKeyData, error: keyError } = await supabaseClient
      .from("api_keys")
      .select("*")
      .eq("key_hash", keyHash)
      .eq("is_active", true)
      .single();

    if (keyError || !apiKeyData) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const apiKey_data = apiKeyData as ApiKeyData;
    
    // Check rate limiting (simple hourly check)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentUsage } = await supabaseClient
      .from("api_usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("api_key_id", apiKey_data.id)
      .gte("created_at", oneHourAgo);

    if (recentUsage && recentUsage >= apiKey_data.rate_limit) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded" }),
        { 
          status: 429, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname;
    const searchParams = url.searchParams;

    let responseData: any = {};
    let creditsCharged = 0;
    let endpoint = "";

    // Handle different endpoints
    if (path.includes("/companies")) {
      endpoint = "companies";
      creditsCharged = 1; // 1 credit per company
      
      const limit = parseInt(searchParams.get("limit") || "10");
      const offset = parseInt(searchParams.get("offset") || "0");
      
      // Check if user has enough credits
      const hasCredits = await supabaseClient.rpc("charge_credits", {
        p_user_id: apiKey_data.user_id,
        p_api_key_id: apiKey_data.id,
        p_amount: creditsCharged,
        p_description: `API access: ${endpoint}`,
        p_metadata: { endpoint, limit }
      });

      if (!hasCredits.data) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits" }),
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      const { data: companies, error } = await supabaseClient
        .from("companies")
        .select("*")
        .range(offset, offset + limit - 1);

      if (error) throw error;
      responseData = { companies, total: companies?.length || 0 };

    } else if (path.includes("/providers")) {
      endpoint = "providers";
      creditsCharged = 1;
      
      const limit = parseInt(searchParams.get("limit") || "10");
      const offset = parseInt(searchParams.get("offset") || "0");
      
      const hasCredits = await supabaseClient.rpc("charge_credits", {
        p_user_id: apiKey_data.user_id,
        p_api_key_id: apiKey_data.id,
        p_amount: creditsCharged,
        p_description: `API access: ${endpoint}`,
        p_metadata: { endpoint, limit }
      });

      if (!hasCredits.data) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits" }),
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      const { data: providers, error } = await supabaseClient
        .from("providers")
        .select("*")
        .range(offset, offset + limit - 1);

      if (error) throw error;
      responseData = { providers, total: providers?.length || 0 };

    } else if (path.includes("/schools")) {
      endpoint = "schools";
      creditsCharged = 1;
      
      const limit = parseInt(searchParams.get("limit") || "10");
      const offset = parseInt(searchParams.get("offset") || "0");
      
      const hasCredits = await supabaseClient.rpc("charge_credits", {
        p_user_id: apiKey_data.user_id,
        p_api_key_id: apiKey_data.id,
        p_amount: creditsCharged,
        p_description: `API access: ${endpoint}`,
        p_metadata: { endpoint, limit }
      });

      if (!hasCredits.data) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits" }),
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      const { data: schools, error } = await supabaseClient
        .from("schools")
        .select("*")
        .range(offset, offset + limit - 1);

      if (error) throw error;
      responseData = { schools, total: schools?.length || 0 };

    } else {
      return new Response(
        JSON.stringify({ error: "Endpoint not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Log API usage
    await supabaseClient
      .from("api_usage_logs")
      .insert({
        api_key_id: apiKey_data.id,
        user_id: apiKey_data.user_id,
        endpoint,
        method: req.method,
        credits_charged: creditsCharged,
        request_metadata: {
          path,
          params: Object.fromEntries(searchParams.entries())
        },
        response_status: 200
      });

    // Update API key usage
    await supabaseClient
      .from("api_keys")
      .update({
        usage_count: apiKey_data.usage_count + 1,
        last_used_at: new Date().toISOString()
      })
      .eq("id", apiKey_data.id);

    return new Response(
      JSON.stringify({
        ...responseData,
        credits_used: creditsCharged,
        credits_remaining: "Check /credits endpoint"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in api-data-access function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});