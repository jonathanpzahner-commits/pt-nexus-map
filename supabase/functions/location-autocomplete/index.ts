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
    
    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ features: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Mapbox token
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    if (!mapboxToken) {
      console.error("Mapbox token not configured");
      return new Response(
        JSON.stringify({ error: "Mapbox token not configured", features: [] }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    console.log("Searching for:", query);

    // Use Mapbox Search API for autocomplete suggestions
    const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=US&types=place,postcode,locality,neighborhood,address&limit=10&autocomplete=true`;
    
    console.log("Making request to Mapbox:", searchUrl.replace(mapboxToken, '[TOKEN]'));
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.error("Mapbox API error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Mapbox API response:", errorText);
      return new Response(
        JSON.stringify({ error: `Mapbox API error: ${response.status}`, features: [] }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status
        }
      );
    }
    
    const data = await response.json();
    console.log("Mapbox response:", JSON.stringify(data, null, 2));

    if (!data.features) {
      console.log("No features in response");
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

    console.log(`Returning ${suggestions.length} suggestions`);

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
        status: 500,
      }
    );
  }
});