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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");

    if (!mapboxToken) {
      throw new Error("Mapbox token not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { batch_size = 20, background_mode = false } = await req.json().catch(() => ({}));

    console.log(`Starting company geocoding with batch size: ${batch_size}`);

    // Get companies without coordinates
    const { data: companies, error: fetchError } = await supabase
      .from('companies')
      .select('id, name, address, city, state, zip_code')
      .or('latitude.is.null,longitude.is.null')
      .limit(batch_size);

    if (fetchError) {
      throw new Error(`Failed to fetch companies: ${fetchError.message}`);
    }

    if (!companies || companies.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: "No companies need geocoding",
          processed: 0,
          failed: 0
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${companies.length} companies`);

    let processed = 0;
    let failed = 0;
    const results = [];

    for (const company of companies) {
      try {
        // Build search query
        const parts = [];
        if (company.address) parts.push(company.address);
        if (company.city) parts.push(company.city);
        if (company.state) parts.push(company.state);
        if (company.zip_code) parts.push(company.zip_code);
        
        const searchQuery = parts.join(", ");
        
        if (!searchQuery.trim()) {
          console.log(`Skipping company ${company.name} - no location data`);
          failed++;
          continue;
        }

        // Geocode with Mapbox
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=US&limit=1`;
        
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const [longitude, latitude] = feature.center;

          // Update company with coordinates
          const { error: updateError } = await supabase
            .from('companies')
            .update({
              latitude: latitude,
              longitude: longitude
            })
            .eq('id', company.id);

          if (updateError) {
            console.error(`Failed to update company ${company.name}:`, updateError);
            failed++;
          } else {
            console.log(`Successfully geocoded: ${company.name} -> ${latitude}, ${longitude}`);
            processed++;
            results.push({
              id: company.id,
              name: company.name,
              latitude,
              longitude
            });
          }
        } else {
          console.log(`No geocoding results for: ${company.name} (${searchQuery})`);
          failed++;
        }

        // Rate limiting - wait 200ms between requests for better API compliance
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Error geocoding company ${company.name}:`, error);
        failed++;
      }
    }

    console.log(`Company geocoding batch complete: ${processed} processed, ${failed} failed`);

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} companies, ${failed} failed`,
        processed,
        failed,
        results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Company geocoding error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        processed: 0,
        failed: 0
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});