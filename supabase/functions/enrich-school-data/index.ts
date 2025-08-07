import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SchoolData {
  id: string;
  name: string;
  city: string;
  state: string;
  description?: string;
  accreditation?: string;
  tuition_per_year?: number;
  program_length_months?: number;
  faculty_count?: number;
  average_class_size?: number;
  programs_offered?: string[];
  specializations?: string[];
  website?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { schoolIds } = await req.json()
    
    if (!schoolIds || !Array.isArray(schoolIds)) {
      return new Response(
        JSON.stringify({ error: 'schoolIds array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Starting data enrichment for ${schoolIds.length} schools`)

    // Get schools that need enrichment
    const { data: schools, error: fetchError } = await supabaseClient
      .from('schools')
      .select('*')
      .in('id', schoolIds)
      .is('description', null)

    if (fetchError) {
      throw new Error(`Failed to fetch schools: ${fetchError.message}`)
    }

    const enrichedSchools: SchoolData[] = []
    const errors: any[] = []

    for (const school of schools || []) {
      try {
        console.log(`Enriching data for: ${school.name}`)
        
        // Search for school information
        const searchQuery = `${school.name} physical therapy school ${school.city} ${school.state} accreditation tuition`
        const searchResults = await searchForSchoolInfo(searchQuery)
        
        if (searchResults) {
          const enrichedData = await enrichSchoolData(school, searchResults)
          
          // Update the school in database
          const { error: updateError } = await supabaseClient
            .from('schools')
            .update(enrichedData)
            .eq('id', school.id)

          if (updateError) {
            console.error(`Failed to update school ${school.id}:`, updateError)
            errors.push({ schoolId: school.id, error: updateError.message })
          } else {
            enrichedSchools.push({ ...school, ...enrichedData })
            console.log(`Successfully enriched: ${school.name}`)
          }
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.error(`Error enriching school ${school.id}:`, error)
        errors.push({ schoolId: school.id, error: error.message })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        enriched: enrichedSchools.length,
        errors: errors,
        schools: enrichedSchools
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in school enrichment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function searchForSchoolInfo(query: string) {
  try {
    // Use DuckDuckGo search (free alternative)
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    
    const response = await fetch(searchUrl)
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }
    
    const data = await response.json()
    return data
    
  } catch (error) {
    console.error('Search failed:', error)
    return null
  }
}

async function enrichSchoolData(school: any, searchData: any): Promise<Partial<SchoolData>> {
  const enriched: Partial<SchoolData> = {}
  
  // Extract information from search results
  if (searchData.AbstractText) {
    enriched.description = searchData.AbstractText.substring(0, 500)
  }
  
  // Look for common PT program indicators
  const abstractText = (searchData.AbstractText || '').toLowerCase()
  
  if (abstractText.includes('capte') || abstractText.includes('accredited')) {
    enriched.accreditation = 'CAPTE'
  }
  
  if (abstractText.includes('dpt') || abstractText.includes('doctor of physical therapy')) {
    enriched.programs_offered = ['DPT']
  }
  
  // Set reasonable defaults for PT programs
  enriched.program_length_months = 36 // Standard DPT program length
  
  // Common PT specializations
  if (abstractText.includes('orthopedic') || abstractText.includes('sports') || abstractText.includes('neurologic')) {
    const specializations = []
    if (abstractText.includes('orthopedic')) specializations.push('Orthopedic')
    if (abstractText.includes('sports')) specializations.push('Sports Medicine')
    if (abstractText.includes('neurologic')) specializations.push('Neurologic')
    enriched.specializations = specializations
  }
  
  return enriched
}