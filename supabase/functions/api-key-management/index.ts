import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate a secure API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `pk_live_${result}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { method } = req;

    if (method === "POST") {
      // Create new API key
      const { name, permissions, rate_limit } = await req.json();

      if (!name) {
        return new Response(
          JSON.stringify({ error: "Name is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Generate API key
      const apiKey = generateApiKey();
      const keyPrefix = apiKey.substring(0, 12) + "...";
      
      // Hash the key for storage
      const keyHash = await sha256Hex(apiKey);

      // Insert API key
      const { data: newApiKey, error } = await supabaseService
        .from("api_keys")
        .insert({
          user_id: user.id,
          name,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          permissions: permissions || { read: true, export: false },
          rate_limit: rate_limit || 1000
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          ...newApiKey,
          api_key: apiKey, // Only returned once on creation
          key_hash: undefined // Don't return hash
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        }
      );

    } else if (method === "GET") {
      // Get user's API keys
      const { data: apiKeys, error } = await supabaseClient
        .from("api_keys")
        .select("id, name, key_prefix, is_active, permissions, rate_limit, created_at, last_used_at, usage_count")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({ api_keys: apiKeys }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else if (method === "PUT") {
      // Update API key
      const { id, ...updates } = await req.json();

      if (!id) {
        return new Response(
          JSON.stringify({ error: "API key ID is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      const { data: updatedKey, error } = await supabaseClient
        .from("api_keys")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(updatedKey),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else if (method === "DELETE") {
      // Delete API key
      const url = new URL(req.url);
      const id = url.pathname.split("/").pop();

      if (!id) {
        return new Response(
          JSON.stringify({ error: "API key ID is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      const { error } = await supabaseClient
        .from("api_keys")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: "API key deleted successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in api-key-management function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});