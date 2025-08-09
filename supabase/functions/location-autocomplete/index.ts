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
    
    console.log("Received query:", query);
    
    if (!query || query.trim().length < 2) {
      console.log("Query too short or empty");
      return new Response(
        JSON.stringify({ features: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Mapbox token
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    console.log("Mapbox token available:", !!mapboxToken);
    
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

    const cleanQuery = query.trim();
    console.log("Searching for:", cleanQuery);

    // Use Mapbox Geocoding API for location search
    const searchUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cleanQuery)}.json?access_token=${mapboxToken}&country=US&types=place,postcode,locality,neighborhood,address&limit=8&autocomplete=true`;
    
    console.log("Making request to Mapbox...");
    
    const response = await fetch(searchUrl);
    
    console.log("Mapbox response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mapbox API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Mapbox API error: ${response.status}`, features: [] }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 // Return 200 but with error info
        }
      );
    }
    
    const data = await response.json();
    console.log("Mapbox response features count:", data.features?.length || 0);

    if (!data.features || data.features.length === 0) {
      console.log("No features found in Mapbox response");
      return new Response(
        JSON.stringify({ features: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format suggestions for frontend
    const suggestions = data.features.map((feature: any) => ({
      id: feature.id,
      place_name: feature.place_name,
      center: feature.center,
      place_type: feature.place_type || [],
      context: feature.context || [],
      text: feature.text,
      properties: feature.properties || {}
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
        status: 200, // Always return 200 to avoid CORS issues
      }
    );
  }
});