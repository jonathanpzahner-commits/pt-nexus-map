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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const batchSize = body.batch_size || 25;
    
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    if (!mapboxToken) {
      throw new Error("Mapbox token not configured");
    }

    // Get providers without coordinates
    const { data: providers, error: selectError } = await supabase
      .from('providers')
      .select('id, city, state, zip_code')
      .or('latitude.is.null,longitude.is.null')
      .not('city', 'is', null)
      .limit(batchSize);

    if (selectError) {
      throw new Error(`Database error: ${selectError.message}`);
    }

    if (!providers || providers.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: "No providers to geocode", 
          processed: 0,
          failed: 0,
          total: 0,
          completed: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    let failed = 0;

    for (const provider of providers) {
      try {
        const result = await geocodeProvider(provider, mapboxToken);
        
        if (result.success) {
          const { error: updateError } = await supabase
            .from('providers')
            .update({ 
              latitude: result.latitude, 
              longitude: result.longitude 
            })
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

        // Rate limiting
        await sleep(100);
        
      } catch (error) {
        console.error(`Error processing provider ${provider.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Batch completed: ${processed} processed, ${failed} failed`, 
        processed, 
        failed,
        total: providers.length,
        completed: providers.length < batchSize
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Batch geocoding error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function geocodeProvider(provider: any, mapboxToken: string) {
  try {
    const parts = [];
    if (provider.city) parts.push(provider.city);
    if (provider.state) parts.push(provider.state);
    if (provider.zip_code) parts.push(provider.zip_code);
    
    if (parts.length === 0) {
      return { success: false, error: 'No address data' };
    }

    const searchQuery = parts.join(', ');
    console.log(`Geocoding provider ${provider.id}: "${searchQuery}"`);

    const response = await fetchWithTimeout(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=US&limit=1`,
      10000
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return { success: false, error: 'No coordinates found' };
    }

    const [longitude, latitude] = data.features[0].center;
    console.log(`Found coordinates for ${provider.id}: ${latitude}, ${longitude}`);

    return {
      success: true,
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6))
    };

  } catch (error) {
    console.error(`Geocoding failed for provider ${provider.id}:`, error);
    return { success: false, error: error.message };
  }
}

async function fetchWithTimeout(url: string, timeout: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}