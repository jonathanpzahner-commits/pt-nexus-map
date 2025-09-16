import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderExportData {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  current_employer: string;
  current_job_title: string;
  city: string;
  state: string;
  zip_code: string;
  specializations: string[];
  years_experience: number;
  license_number: string;
  license_state: string;
  linkedin_url: string;
  website: string;
  bio: string;
  distance_miles: number;
}

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

    const { latitude, longitude, radius } = await req.json();

    if (!latitude || !longitude || !radius) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: latitude, longitude, radius' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Exporting providers within ${radius} miles of ${latitude}, ${longitude}`);

    // Get providers within radius using existing function
    const { data: providers, error } = await supabase
      .rpc('providers_within_radius', {
        user_lat: latitude,
        user_lng: longitude,
        radius_miles: radius
      });

    if (error) {
      console.error('Error fetching providers:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch providers' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get full provider data for export
    const providerIds = providers.map((p: any) => p.id);
    
    const { data: fullProviders, error: fullError } = await supabase
      .from('providers')
      .select(`
        id,
        name,
        first_name,
        last_name,
        current_employer,
        current_job_title,
        city,
        state,
        zip_code,
        specializations,
        years_experience,
        license_number,
        license_state,
        linkedin_url,
        website,
        bio
      `)
      .in('id', providerIds);

    if (fullError) {
      console.error('Error fetching full provider data:', fullError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch provider details' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Merge with distance data
    const exportData: ProviderExportData[] = fullProviders.map(provider => {
      const distanceData = providers.find((p: any) => p.id === provider.id);
      return {
        ...provider,
        distance_miles: distanceData?.distance_miles || 0
      };
    });

    // Generate CSV content (simpler than Excel for edge functions)
    const headers = [
      'Name',
      'First Name',
      'Last Name',
      'Current Employer',
      'Job Title',
      'City',
      'State',
      'Zip Code',
      'Distance (miles)',
      'Specializations',
      'Years Experience',
      'License Number',
      'License State',
      'LinkedIn URL',
      'Website',
      'Bio'
    ];

    const csvRows = [
      headers.join(','),
      ...exportData.map(provider => [
        `"${provider.name || ''}"`,
        `"${provider.first_name || ''}"`,
        `"${provider.last_name || ''}"`,
        `"${provider.current_employer || ''}"`,
        `"${provider.current_job_title || ''}"`,
        `"${provider.city || ''}"`,
        `"${provider.state || ''}"`,
        `"${provider.zip_code || ''}"`,
        provider.distance_miles?.toFixed(2) || '0',
        `"${provider.specializations?.join('; ') || ''}"`,
        provider.years_experience || '',
        `"${provider.license_number || ''}"`,
        `"${provider.license_state || ''}"`,
        `"${provider.linkedin_url || ''}"`,
        `"${provider.website || ''}"`,
        `"${provider.bio?.replace(/"/g, '""') || ''}"` // Escape quotes in bio
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `providers_within_${radius}mi_${timestamp}.csv`;

    console.log(`Generated export with ${exportData.length} providers`);

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});