import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Batch geocoding function started");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    if (!mapboxToken) {
      throw new Error("Mapbox token not configured");
    }

    // Get providers without coordinates
    const { data: providers, error: selectError } = await supabaseAdmin
      .from('providers')
      .select('id, city, state, zip_code')
      .is('latitude', null)
      .limit(50); // Process in batches

    if (selectError) throw selectError;

    if (!providers || providers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No providers to geocode", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    let failed = 0;

    for (const provider of providers) {
      try {
        // Build address string
        const parts = [];
        if (provider.city) parts.push(provider.city);
        if (provider.state) parts.push(provider.state);
        if (provider.zip_code) parts.push(provider.zip_code);
        
        const searchQuery = parts.join(", ");
        
        if (!searchQuery.trim()) {
          failed++;
          continue;
        }

        // Geocode the address
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=US&limit=1`;
        
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;

          // Update provider with coordinates
          const { error: updateError } = await supabaseAdmin
            .from('providers')
            .update({ latitude, longitude })
            .eq('id', provider.id);

          if (updateError) {
            console.error(`Failed to update provider ${provider.id}:`, updateError);
            failed++;
          } else {
            processed++;
          }
        } else {
          failed++;
        }

        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error processing provider ${provider.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Geocoding batch completed`, 
        processed, 
        failed,
        total: providers.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});