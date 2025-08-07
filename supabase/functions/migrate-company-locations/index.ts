import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting company location migration...');

    // Get all companies that have company_locations data but missing individual location fields
    const { data: companies, error: fetchError } = await supabase
      .from('companies')
      .select('id, name, company_locations')
      .or('city.is.null,state.is.null')
      .not('company_locations', 'is', null)
      .neq('company_locations', '{}');

    if (fetchError) {
      console.error('Error fetching companies:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch companies' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${companies?.length || 0} companies to migrate`);

    let successCount = 0;
    let errorCount = 0;
    const batchSize = 50;

    for (let i = 0; i < (companies?.length || 0); i += batchSize) {
      const batch = companies!.slice(i, i + batchSize);
      
      for (const company of batch) {
        try {
          if (!company.company_locations || company.company_locations.length === 0) {
            continue;
          }

          // Take the first location from the array
          const location = company.company_locations[0];
          
          // Parse the location string
          const locationData = parseLocationString(location);
          
          if (locationData.city || locationData.state) {
            const { error: updateError } = await supabase
              .from('companies')
              .update({
                city: locationData.city,
                state: locationData.state,
                zip_code: locationData.zip_code,
                address: locationData.address
              })
              .eq('id', company.id);

            if (updateError) {
              console.error(`Error updating company ${company.id}:`, updateError);
              errorCount++;
            } else {
              console.log(`Updated company: ${company.name} with location: ${location}`);
              successCount++;
            }
          } else {
            console.log(`Could not parse location for company: ${company.name}, location: ${location}`);
            errorCount++;
          }
        } catch (error) {
          console.error(`Error processing company ${company.id}:`, error);
          errorCount++;
        }
      }

      // Add a small delay between batches to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Migration completed: ${successCount} successful, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Migration completed: ${successCount} successful, ${errorCount} errors`,
        migrated: successCount,
        errors: errorCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseLocationString(location: string): { city?: string, state?: string, zip_code?: string, address?: string } {
  const result: { city?: string, state?: string, zip_code?: string, address?: string } = {};
  
  if (!location || typeof location !== 'string') {
    return result;
  }

  const cleanLocation = location.trim();
  
  // Pattern 1: "City, State" or "City, State ZIP"
  const cityStateMatch = cleanLocation.match(/^(.+),\s*([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/);
  if (cityStateMatch) {
    result.city = cityStateMatch[1].trim();
    result.state = cityStateMatch[2].trim();
    if (cityStateMatch[3]) {
      result.zip_code = cityStateMatch[3].trim();
    }
    return result;
  }

  // Pattern 2: "City State" (space separated)
  const cityStateSpaceMatch = cleanLocation.match(/^(.+)\s+([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/);
  if (cityStateSpaceMatch) {
    result.city = cityStateSpaceMatch[1].trim();
    result.state = cityStateSpaceMatch[2].trim();
    if (cityStateSpaceMatch[3]) {
      result.zip_code = cityStateSpaceMatch[3].trim();
    }
    return result;
  }

  // Pattern 3: Just a state abbreviation
  if (cleanLocation.match(/^[A-Z]{2}$/)) {
    result.state = cleanLocation;
    return result;
  }

  // Pattern 4: Full address - try to extract city, state from end
  const addressMatch = cleanLocation.match(/^(.+),?\s+([^,]+),\s*([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/);
  if (addressMatch) {
    result.address = cleanLocation;
    result.city = addressMatch[2].trim();
    result.state = addressMatch[3].trim();
    if (addressMatch[4]) {
      result.zip_code = addressMatch[4].trim();
    }
    return result;
  }

  // Pattern 5: If it contains common address indicators, treat as full address
  if (cleanLocation.match(/\d+.*?(street|st|avenue|ave|road|rd|drive|dr|boulevard|blvd|lane|ln|way|court|ct|place|pl)/i)) {
    result.address = cleanLocation;
    
    // Try to extract state from the end
    const stateMatch = cleanLocation.match(/\b([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?)?\s*$/);
    if (stateMatch) {
      result.state = stateMatch[1];
    }
    
    return result;
  }

  // If we can't parse it, store as address
  result.address = cleanLocation;
  return result;
}