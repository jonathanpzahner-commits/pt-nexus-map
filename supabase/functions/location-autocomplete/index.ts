import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.trim().length < 3) {
      return new Response(
        JSON.stringify({ features: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Mapbox token
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    if (!mapboxToken) {
      throw new Error("Mapbox token not configured");
    }

    // Use Mapbox Search API for autocomplete suggestions
    const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=US&types=place,postcode,locality,neighborhood,address&limit=10&autocomplete=true`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.features) {
      return new Response(
        JSON.stringify({ features: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format suggestions for easier frontend consumption
    const suggestions = data.features.map((feature: any) => ({
      id: feature.id,
      place_name: feature.place_name,
      center: feature.center,
      place_type: feature.place_type,
      context: feature.context,
      text: feature.text,
      properties: feature.properties
    }));

    return new Response(
      JSON.stringify({ features: suggestions }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Autocomplete error:', error);
    return new Response(
      JSON.stringify({ error: error.message, features: [] }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});