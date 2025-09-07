import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const url = new URL(req.url);
    const endpoint = url.pathname.split("/").pop();

    if (method === "GET" && endpoint === "balance") {
      // Get user's credit balance
      const { data: credits, error } = await supabaseClient
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw error;
      }

      const balance = credits?.balance || 0;
      const total_purchased = credits?.total_purchased || 0;
      const total_spent = credits?.total_spent || 0;

      return new Response(
        JSON.stringify({
          balance,
          total_purchased,
          total_spent,
          created_at: credits?.created_at || null
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else if (method === "GET" && endpoint === "transactions") {
      // Get user's credit transactions
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const offset = parseInt(url.searchParams.get("offset") || "0");

      const { data: transactions, error } = await supabaseClient
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ transactions }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else if (method === "POST" && endpoint === "purchase") {
      // Purchase credits
      const { amount, payment_method } = await req.json();

      if (!amount || amount <= 0) {
        return new Response(
          JSON.stringify({ error: "Valid amount is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // In a real implementation, you would integrate with a payment processor here
      // For now, we'll simulate a successful purchase
      const success = await supabaseService.rpc("add_credits", {
        p_user_id: user.id,
        p_amount: amount,
        p_description: `Credit purchase - ${amount} credits`,
        p_metadata: { payment_method: payment_method || "demo" }
      });

      if (!success.data) {
        return new Response(
          JSON.stringify({ error: "Failed to add credits" }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Get updated balance
      const { data: credits } = await supabaseClient
        .from("user_credits")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      return new Response(
        JSON.stringify({
          message: "Credits purchased successfully",
          amount_purchased: amount,
          new_balance: credits?.balance || amount
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );

    } else if (method === "GET" && endpoint === "usage") {
      // Get API usage statistics
      const { data: usage, error } = await supabaseClient
        .from("api_usage_logs")
        .select("endpoint, credits_charged, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Group by endpoint
      const usageStats: any = {};
      let totalCreditsUsed = 0;

      usage?.forEach((log: any) => {
        const endpoint = log.endpoint;
        if (!usageStats[endpoint]) {
          usageStats[endpoint] = {
            total_calls: 0,
            total_credits: 0,
            last_used: null
          };
        }
        usageStats[endpoint].total_calls++;
        usageStats[endpoint].total_credits += log.credits_charged;
        usageStats[endpoint].last_used = log.created_at;
        totalCreditsUsed += log.credits_charged;
      });

      return new Response(
        JSON.stringify({
          total_credits_used: totalCreditsUsed,
          usage_by_endpoint: usageStats,
          recent_usage: usage?.slice(0, 10) || []
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { 
        status: 404, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in credit-management function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});