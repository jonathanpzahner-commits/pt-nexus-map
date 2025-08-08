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
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    
    if (!mapboxToken) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Token not configured",
          healthy: false 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Test the token with a simple geocoding request
    const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${mapboxToken}&limit=1`;
    
    const response = await fetch(testUrl);
    
    if (response.status === 401) {
      console.error('Mapbox token is invalid or expired');
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Token is invalid or expired",
          healthy: false,
          tokenPrefix: mapboxToken.substring(0, 10) + "..."
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    if (response.status === 200) {
      // Check if token has expiration info in JWT payload
      const tokenParts = mapboxToken.split('.');
      let expirationWarning = "";
      
      try {
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp) {
            const expirationDate = new Date(payload.exp * 1000);
            const daysUntilExpiration = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilExpiration <= 30) {
              expirationWarning = `⚠️ Token expires in ${daysUntilExpiration} days (${expirationDate.toDateString()})`;
            }
          }
        }
      } catch (e) {
        // Ignore JWT parsing errors
      }

      return new Response(
        JSON.stringify({ 
          status: "healthy", 
          message: "Token is valid and working",
          healthy: true,
          tokenPrefix: mapboxToken.substring(0, 10) + "...",
          expirationWarning
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: `Unexpected response: ${response.status}`,
        healthy: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.status,
      }
    );

  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: error.message,
        healthy: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});