import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeocodeResult {
  latitude: number;
  longitude: number;
}

async function geocodeLocation(address: string, city: string, state: string): Promise<GeocodeResult | null> {
  const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
  if (!mapboxToken) {
    console.error('Mapbox token not available');
    return null;
  }

  try {
    // Build query string - prefer full address, fallback to city/state
    let query = '';
    if (address && address.trim()) {
      query = encodeURIComponent(address.trim());
    } else if (city && state) {
      query = encodeURIComponent(`${city.trim()}, ${state.trim()}`);
    } else if (state) {
      query = encodeURIComponent(state.trim());
    } else {
      return null;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&limit=1&country=US`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Mapbox API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { table, batch_size = 100, max_batches = 50 } = await req.json();
    
    if (!table || !['companies', 'providers', 'schools', 'job_listings'].includes(table)) {
      return new Response(
        JSON.stringify({ error: 'Invalid table specified' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting batch geocoding for ${table} table`);

    // Get records without coordinates - table-specific queries
    let query;
    
    if (table === 'companies') {
      query = supabase
        .from(table)
        .select('id, city, state, address, name')
        .or('latitude.is.null,longitude.is.null')
        .limit(batch_size * max_batches);
    } else if (table === 'providers') {
      query = supabase
        .from(table)
        .select('id, city, state, name, first_name, last_name')
        .or('latitude.is.null,longitude.is.null')
        .limit(batch_size * max_batches);
    } else if (table === 'schools') {
      // Schools don't have address column, only city and state
      query = supabase
        .from(table)
        .select('id, city, state, name')
        .limit(batch_size * max_batches);
    } else if (table === 'job_listings') {
      query = supabase
        .from(table)
        .select('id, city, state, title')
        .limit(batch_size * max_batches);
    } else {
      query = supabase
        .from(table)
        .select('id, city, state')
        .or('latitude.is.null,longitude.is.null')
        .limit(batch_size * max_batches);
    }

    const { data: records, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching records:', fetchError);
      return new Response(
        JSON.stringify({ error: `Failed to fetch records: ${fetchError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!records || records.length === 0) {
      return new Response(
        JSON.stringify({ message: `No records need geocoding in ${table}`, processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${records.length} records needing geocoding`);

    let processed = 0;
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process in batches to avoid rate limiting
    for (let i = 0; i < records.length; i += batch_size) {
      const batch = records.slice(i, i + batch_size);
      const updates: any[] = [];

      console.log(`Processing batch ${Math.floor(i/batch_size) + 1}/${Math.ceil(records.length/batch_size)}`);

      for (const record of batch) {
        try {
          const coords = await geocodeLocation(
            record.address || '',
            record.city || '',
            record.state || ''
          );

          if (coords) {
            // Only update coordinates, don't touch other fields
            updates.push({
              id: record.id,
              latitude: coords.latitude,
              longitude: coords.longitude
            });
            successful++;
          } else {
            failed++;
            const identifier = record.name || `${record.first_name} ${record.last_name}` || record.id;
            errors.push(`No coordinates found for ${identifier} (${record.city}, ${record.state})`);
          }
          
          processed++;

          // Small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          failed++;
          const identifier = record.name || `${record.first_name} ${record.last_name}` || record.id;
          errors.push(`Error geocoding ${identifier}: ${error.message}`);
          processed++;
        }
      }

      // Update coordinates in batch using individual updates to avoid constraint issues
      if (updates.length > 0) {
        for (const update of updates) {
          const { error: updateError } = await supabase
            .from(table)
            .update({ 
              latitude: update.latitude, 
              longitude: update.longitude 
            })
            .eq('id', update.id);

          if (updateError) {
            console.error('Error updating coordinates:', updateError);
            errors.push(`Update error for ${update.id}: ${updateError.message}`);
            failed++;
            successful--; // Adjust counter since this one failed
          }
        }
        console.log(`Attempted to update ${updates.length} records with coordinates`);
      }

      // Progress update
      console.log(`Progress: ${processed}/${records.length} (${successful} successful, ${failed} failed)`);
    }

    const result = {
      table,
      processed,
      successful,
      failed,
      total_records: records.length,
      errors: errors.slice(0, 10), // Limit error list
      completion_message: `Geocoding complete for ${table}: ${successful}/${processed} records geocoded successfully`
    };

    console.log('Geocoding batch completed:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch geocoding error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});