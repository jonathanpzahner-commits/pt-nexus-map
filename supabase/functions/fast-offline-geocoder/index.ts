import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAPBOX_TOKEN = Deno.env.get('MAPBOX_PUBLIC_TOKEN')

// US Cities database for fast offline geocoding
const US_CITIES = new Map([
  ['NEW YORK, NY', { lat: 40.7128, lng: -74.0060 }],
  ['LOS ANGELES, CA', { lat: 34.0522, lng: -118.2437 }],
  ['CHICAGO, IL', { lat: 41.8781, lng: -87.6298 }],
  ['HOUSTON, TX', { lat: 29.7604, lng: -95.3698 }],
  ['PHOENIX, AZ', { lat: 33.4484, lng: -112.0740 }],
  ['PHILADELPHIA, PA', { lat: 39.9526, lng: -75.1652 }],
  ['SAN ANTONIO, TX', { lat: 29.4241, lng: -98.4936 }],
  ['SAN DIEGO, CA', { lat: 32.7157, lng: -117.1611 }],
  ['DALLAS, TX', { lat: 32.7767, lng: -96.7970 }],
  ['SAN JOSE, CA', { lat: 37.3382, lng: -121.8863 }],
  ['AUSTIN, TX', { lat: 30.2672, lng: -97.7431 }],
  ['JACKSONVILLE, FL', { lat: 30.3322, lng: -81.6557 }],
  ['FORT WORTH, TX', { lat: 32.7555, lng: -97.3308 }],
  ['COLUMBUS, OH', { lat: 39.9612, lng: -82.9988 }],
  ['CHARLOTTE, NC', { lat: 35.2271, lng: -80.8431 }],
  ['SAN FRANCISCO, CA', { lat: 37.7749, lng: -122.4194 }],
  ['INDIANAPOLIS, IN', { lat: 39.7684, lng: -86.1581 }],
  ['SEATTLE, WA', { lat: 47.6062, lng: -122.3321 }],
  ['DENVER, CO', { lat: 39.7392, lng: -104.9903 }],
  ['WASHINGTON, DC', { lat: 38.9072, lng: -77.0369 }],
  ['BOSTON, MA', { lat: 42.3601, lng: -71.0589 }],
  ['EL PASO, TX', { lat: 31.7619, lng: -106.4850 }],
  ['DETROIT, MI', { lat: 42.3314, lng: -83.0458 }],
  ['NASHVILLE, TN', { lat: 36.1627, lng: -86.7816 }],
  ['PORTLAND, OR', { lat: 45.5152, lng: -122.6784 }],
  ['MEMPHIS, TN', { lat: 35.1495, lng: -90.0490 }],
  ['OKLAHOMA CITY, OK', { lat: 35.4676, lng: -97.5164 }],
  ['LAS VEGAS, NV', { lat: 36.1699, lng: -115.1398 }],
  ['LOUISVILLE, KY', { lat: 38.2527, lng: -85.7585 }],
  ['BALTIMORE, MD', { lat: 39.2904, lng: -76.6122 }],
  ['MILWAUKEE, WI', { lat: 43.0389, lng: -87.9065 }],
  ['ALBUQUERQUE, NM', { lat: 35.0844, lng: -106.6504 }],
  ['TUCSON, AZ', { lat: 32.2226, lng: -110.9747 }],
  ['FRESNO, CA', { lat: 36.7378, lng: -119.7871 }],
  ['MESA, AZ', { lat: 33.4152, lng: -111.8315 }],
  ['SACRAMENTO, CA', { lat: 38.5816, lng: -121.4944 }],
  ['ATLANTA, GA', { lat: 33.7490, lng: -84.3880 }],
  ['KANSAS CITY, MO', { lat: 39.0997, lng: -94.5786 }],
  ['COLORADO SPRINGS, CO', { lat: 38.8339, lng: -104.8214 }],
  ['OMAHA, NE', { lat: 41.2565, lng: -95.9345 }],
  ['RALEIGH, NC', { lat: 35.7796, lng: -78.6382 }],
  ['MIAMI, FL', { lat: 25.7617, lng: -80.1918 }],
  ['LONG BEACH, CA', { lat: 33.7701, lng: -118.1937 }],
  ['VIRGINIA BEACH, VA', { lat: 36.8529, lng: -75.9780 }],
  ['OAKLAND, CA', { lat: 37.8044, lng: -122.2711 }],
  ['MINNEAPOLIS, MN', { lat: 44.9778, lng: -93.2650 }],
  ['TULSA, OK', { lat: 36.1540, lng: -95.9928 }],
  ['ARLINGTON, TX', { lat: 32.7357, lng: -97.1081 }],
  ['TAMPA, FL', { lat: 27.9506, lng: -82.4572 }],
  ['NEW ORLEANS, LA', { lat: 29.9511, lng: -90.0715 }],
  ['WICHITA, KS', { lat: 37.6872, lng: -97.3301 }],
  ['CLEVELAND, OH', { lat: 41.4993, lng: -81.6944 }],
  ['BAKERSFIELD, CA', { lat: 35.3733, lng: -119.0187 }],
  ['AURORA, CO', { lat: 39.7294, lng: -104.8319 }],
  ['ANAHEIM, CA', { lat: 33.8366, lng: -117.9143 }],
  ['HONOLULU, HI', { lat: 21.3099, lng: -157.8581 }],
  ['SANTA ANA, CA', { lat: 33.7455, lng: -117.8677 }],
  ['CORPUS CHRISTI, TX', { lat: 27.8006, lng: -97.3964 }],
  ['RIVERSIDE, CA', { lat: 33.9533, lng: -117.3962 }],
  ['LEXINGTON, KY', { lat: 38.0406, lng: -84.5037 }],
  ['STOCKTON, CA', { lat: 37.9577, lng: -121.2908 }],
  ['HENDERSON, NV', { lat: 36.0397, lng: -114.9817 }],
  ['SAINT PAUL, MN', { lat: 44.9537, lng: -93.0900 }],
  ['ST. LOUIS, MO', { lat: 38.6270, lng: -90.1994 }],
  ['CINCINNATI, OH', { lat: 39.1031, lng: -84.5120 }],
  ['PITTSBURGH, PA', { lat: 40.4406, lng: -79.9959 }],
  ['GREENSBORO, NC', { lat: 36.0726, lng: -79.7920 }],
  ['LINCOLN, NE', { lat: 40.8136, lng: -96.7026 }],
  ['PLANO, TX', { lat: 33.0198, lng: -96.6989 }],
  ['ANCHORAGE, AK', { lat: 61.2181, lng: -149.9003 }],
  ['ORLANDO, FL', { lat: 28.5383, lng: -81.3792 }],
  ['IRVINE, CA', { lat: 33.6846, lng: -117.8265 }],
  ['NEWARK, NJ', { lat: 40.7357, lng: -74.1724 }],
  ['DURHAM, NC', { lat: 35.9940, lng: -78.8986 }],
  ['CHULA VISTA, CA', { lat: 32.6401, lng: -117.0842 }],
  ['TOLEDO, OH', { lat: 41.6528, lng: -83.5379 }],
  ['FORT WAYNE, IN', { lat: 41.0793, lng: -85.1394 }],
  ['ST. PETERSBURG, FL', { lat: 27.7676, lng: -82.6403 }],
  ['LAREDO, TX', { lat: 27.5306, lng: -99.4803 }],
  ['JERSEY CITY, NJ', { lat: 40.7178, lng: -74.0431 }],
  ['CHANDLER, AZ', { lat: 33.3062, lng: -111.8413 }],
  ['MADISON, WI', { lat: 43.0642, lng: -89.4012 }],
  ['LUBBOCK, TX', { lat: 33.5779, lng: -101.8552 }],
  ['SCOTTSDALE, AZ', { lat: 33.4942, lng: -111.9261 }],
  ['RENO, NV', { lat: 39.5296, lng: -119.8138 }],
  ['BUFFALO, NY', { lat: 42.8864, lng: -78.8784 }],
  ['GILBERT, AZ', { lat: 33.3528, lng: -111.7890 }],
  ['GLENDALE, AZ', { lat: 33.5387, lng: -112.1860 }],
  ['NORTH LAS VEGAS, NV', { lat: 36.1989, lng: -115.1175 }],
  ['WINSTON-SALEM, NC', { lat: 36.0999, lng: -80.2442 }],
  ['CHESAPEAKE, VA', { lat: 36.7682, lng: -76.2875 }],
  ['NORFOLK, VA', { lat: 36.8468, lng: -76.2852 }],
  ['FREMONT, CA', { lat: 37.5485, lng: -121.9886 }],
  ['GARLAND, TX', { lat: 32.9126, lng: -96.6389 }],
  ['IRVING, TX', { lat: 32.8140, lng: -96.9489 }],
  ['HIALEAH, FL', { lat: 25.8576, lng: -80.2781 }],
  ['RICHMOND, VA', { lat: 37.5407, lng: -77.4360 }],
  ['BOISE, ID', { lat: 43.6150, lng: -116.2023 }],
  ['SPOKANE, WA', { lat: 47.6588, lng: -117.4260 }],
  ['BATON ROUGE, LA', { lat: 30.4515, lng: -91.1871 }],
  ['TACOMA, WA', { lat: 47.2529, lng: -122.4443 }],
  ['SAN BERNARDINO, CA', { lat: 34.1083, lng: -117.2898 }],
  ['MODESTO, CA', { lat: 37.6391, lng: -120.9969 }],
  ['FONTANA, CA', { lat: 34.0922, lng: -117.4350 }],
  ['DES MOINES, IA', { lat: 41.5868, lng: -93.6250 }],
  ['MORENO VALLEY, CA', { lat: 33.9425, lng: -117.2297 }],
  ['SANTA CLARITA, CA', { lat: 34.3917, lng: -118.5426 }],
  ['FAYETTEVILLE, NC', { lat: 35.0527, lng: -78.8784 }],
  ['BIRMINGHAM, AL', { lat: 33.5207, lng: -86.8025 }],
  ['OXNARD, CA', { lat: 34.1975, lng: -119.1771 }],
  ['HUNTINGTON BEACH, CA', { lat: 33.6595, lng: -117.9988 }],
  ['GLENDALE, CA', { lat: 34.1425, lng: -118.2551 }],
  ['AKRON, OH', { lat: 41.0814, lng: -81.5190 }],
  ['AURORA, IL', { lat: 41.7606, lng: -88.3201 }],
  ['LITTLE ROCK, AR', { lat: 34.7465, lng: -92.2896 }],
  ['AMARILLO, TX', { lat: 35.2220, lng: -101.8313 }],
  ['AUGUSTA, GA', { lat: 33.4735, lng: -82.0105 }],
  ['COLUMBUS, GA', { lat: 32.4609, lng: -84.9877 }],
  ['SHREVEPORT, LA', { lat: 32.5252, lng: -93.7502 }],
  ['OVERLAND PARK, KS', { lat: 38.9822, lng: -94.6708 }],
  ['GRAND PRAIRIE, TX', { lat: 32.7460, lng: -96.9978 }],
  ['TALLAHASSEE, FL', { lat: 30.4518, lng: -84.2807 }],
  ['HUNTSVILLE, AL', { lat: 34.7304, lng: -86.5861 }],
  ['GRAND RAPIDS, MI', { lat: 42.9634, lng: -85.6681 }],
  ['SALT LAKE CITY, UT', { lat: 40.7608, lng: -111.8910 }],
  ['KNOXVILLE, TN', { lat: 35.9606, lng: -83.9207 }],
  ['WORCESTER, MA', { lat: 42.2626, lng: -71.8023 }],
  ['NEWPORT NEWS, VA', { lat: 37.0871, lng: -76.4730 }],
  ['BROWNSVILLE, TX', { lat: 25.9018, lng: -97.4975 }],
  ['SANTA ROSA, CA', { lat: 38.4405, lng: -122.7144 }],
  ['PEORIA, AZ', { lat: 33.5806, lng: -112.2374 }],
  ['FORT LAUDERDALE, FL', { lat: 26.1224, lng: -80.1373 }],
  ['CAPE CORAL, FL', { lat: 26.5629, lng: -81.9495 }],
  ['SPRINGFIELD, MO', { lat: 37.2153, lng: -93.2982 }],
  ['SIOUX FALLS, SD', { lat: 43.5446, lng: -96.7311 }],
  ['PEORIA, IL', { lat: 40.6936, lng: -89.5890 }],
  ['LANCASTER, CA', { lat: 34.6868, lng: -118.1542 }],
  ['HAYWARD, CA', { lat: 37.6688, lng: -122.0808 }],
  ['SALINAS, CA', { lat: 36.6777, lng: -121.6555 }],
  ['PATERSON, NJ', { lat: 40.9168, lng: -74.1718 }],
])

// State capitals for fallback
const STATE_CAPITALS = new Map([
  ['AL', { city: 'MONTGOMERY', lat: 32.3668, lng: -86.3000 }],
  ['AK', { city: 'JUNEAU', lat: 58.3019, lng: -134.4197 }],
  ['AZ', { city: 'PHOENIX', lat: 33.4734, lng: -112.0967 }],
  ['AR', { city: 'LITTLE ROCK', lat: 34.7465, lng: -92.2896 }],
  ['CA', { city: 'SACRAMENTO', lat: 38.5767, lng: -121.4934 }],
  ['CO', { city: 'DENVER', lat: 39.7392, lng: -104.9903 }],
  ['CT', { city: 'HARTFORD', lat: 41.7658, lng: -72.6734 }],
  ['DE', { city: 'DOVER', lat: 39.1612, lng: -75.5264 }],
  ['FL', { city: 'TALLAHASSEE', lat: 30.4518, lng: -84.2807 }],
  ['GA', { city: 'ATLANTA', lat: 33.7490, lng: -84.3880 }],
  ['HI', { city: 'HONOLULU', lat: 21.3099, lng: -157.8581 }],
  ['ID', { city: 'BOISE', lat: 43.6150, lng: -116.2023 }],
  ['IL', { city: 'SPRINGFIELD', lat: 39.7817, lng: -89.6501 }],
  ['IN', { city: 'INDIANAPOLIS', lat: 39.7684, lng: -86.1581 }],
  ['IA', { city: 'DES MOINES', lat: 41.5868, lng: -93.6250 }],
  ['KS', { city: 'TOPEKA', lat: 39.0473, lng: -95.6890 }],
  ['KY', { city: 'FRANKFORT', lat: 38.2009, lng: -84.8733 }],
  ['LA', { city: 'BATON ROUGE', lat: 30.4515, lng: -91.1871 }],
  ['ME', { city: 'AUGUSTA', lat: 44.3106, lng: -69.7795 }],
  ['MD', { city: 'ANNAPOLIS', lat: 38.9517, lng: -76.4951 }],
  ['MA', { city: 'BOSTON', lat: 42.3601, lng: -71.0589 }],
  ['MI', { city: 'LANSING', lat: 42.3540, lng: -84.9551 }],
  ['MN', { city: 'SAINT PAUL', lat: 44.9537, lng: -93.0900 }],
  ['MS', { city: 'JACKSON', lat: 32.3317, lng: -90.2073 }],
  ['MO', { city: 'JEFFERSON CITY', lat: 38.5767, lng: -92.1735 }],
  ['MT', { city: 'HELENA', lat: 46.5958, lng: -112.0362 }],
  ['NE', { city: 'LINCOLN', lat: 40.8136, lng: -96.7026 }],
  ['NV', { city: 'CARSON CITY', lat: 39.1638, lng: -119.7674 }],
  ['NH', { city: 'CONCORD', lat: 43.2081, lng: -71.5376 }],
  ['NJ', { city: 'TRENTON', lat: 40.2206, lng: -74.7565 }],
  ['NM', { city: 'SANTA FE', lat: 35.6870, lng: -105.9378 }],
  ['NY', { city: 'ALBANY', lat: 42.6526, lng: -73.7562 }],
  ['NC', { city: 'RALEIGH', lat: 35.7796, lng: -78.6382 }],
  ['ND', { city: 'BISMARCK', lat: 46.8083, lng: -100.7837 }],
  ['OH', { city: 'COLUMBUS', lat: 39.9612, lng: -82.9988 }],
  ['OK', { city: 'OKLAHOMA CITY', lat: 35.4676, lng: -97.5164 }],
  ['OR', { city: 'SALEM', lat: 44.9429, lng: -123.0351 }],
  ['PA', { city: 'HARRISBURG', lat: 40.2677, lng: -76.8839 }],
  ['RI', { city: 'PROVIDENCE', lat: 41.8240, lng: -71.4128 }],
  ['SC', { city: 'COLUMBIA', lat: 34.0007, lng: -81.0348 }],
  ['SD', { city: 'PIERRE', lat: 44.3683, lng: -100.3510 }],
  ['TN', { city: 'NASHVILLE', lat: 36.1627, lng: -86.7816 }],
  ['TX', { city: 'AUSTIN', lat: 30.2672, lng: -97.7431 }],
  ['UT', { city: 'SALT LAKE CITY', lat: 40.7608, lng: -111.8910 }],
  ['VT', { city: 'MONTPELIER', lat: 44.2601, lng: -72.5806 }],
  ['VA', { city: 'RICHMOND', lat: 37.5407, lng: -77.4360 }],
  ['WA', { city: 'OLYMPIA', lat: 47.0379, lng: -122.9015 }],
  ['WV', { city: 'CHARLESTON', lat: 38.3498, lng: -81.6326 }],
  ['WI', { city: 'MADISON', lat: 43.0642, lng: -89.4012 }],
  ['WY', { city: 'CHEYENNE', lat: 41.1400, lng: -104.8197 }]
])

interface GeocodeResult {
  lat: number
  lng: number
  confidence: number
  source: string
}

function normalizeLocation(text: string): string {
  return text.toUpperCase().replace(/[^\w\s,]/g, '').trim()
}

function fastGeocode(city?: string, state?: string): GeocodeResult | null {
  // Try city, state combination first
  if (city && state) {
    const locationKey = `${normalizeLocation(city)}, ${normalizeLocation(state)}`
    const cityData = US_CITIES.get(locationKey)
    if (cityData) {
      return {
        lat: cityData.lat,
        lng: cityData.lng,
        confidence: 0.95,
        source: 'city_database'
      }
    }
  }

  // Fallback to state capital
  if (state) {
    const normalizedState = normalizeLocation(state).substring(0, 2)
    const capital = STATE_CAPITALS.get(normalizedState)
    if (capital) {
      return {
        lat: capital.lat,
        lng: capital.lng,
        confidence: 0.7,
        source: 'state_capital'
      }
    }
  }

  return null
}

async function enhancedGeocode(city?: string, state?: string, address?: string): Promise<GeocodeResult | null> {
  // Try local database first
  const localResult = fastGeocode(city, state)
  if (localResult) {
    return localResult
  }

  // Fallback to Mapbox API for better coverage
  if (MAPBOX_TOKEN && (city || address)) {
    try {
      const query = address || `${city || ''}, ${state || ''}`.trim()
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=US&limit=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          const feature = data.features[0]
          return {
            lat: feature.center[1],
            lng: feature.center[0],
            confidence: 0.9,
            source: 'mapbox_api'
          }
        }
      }
    } catch (error) {
      console.error('Mapbox geocoding error:', error)
    }
  }

  return null
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { tables = [], batchSize = 500 } = await req.json()
    console.log(`Starting fast geocoding for tables: ${tables.join(', ')}`)

    const results: Record<string, any> = {}
    let totalProcessed = 0
    let totalUpdated = 0
    let totalFailed = 0
    const startTime = Date.now()

    for (const tableName of tables) {
      console.log(`Processing table: ${tableName}`)
      
      try {
        // Get records that need geocoding
        const { data: records, error } = await supabase
          .from(tableName)
          .select('id, city, state, zip_code, address')
          .or('latitude.is.null,longitude.is.null')
          .limit(batchSize)
        
        if (error) {
          console.error(`Error fetching from ${tableName}:`, error)
          results[tableName] = { error: error.message, updated: 0, failed: 0 }
          continue
        }

        if (!records || records.length === 0) {
          console.log(`No records to geocode in ${tableName}`)
          results[tableName] = { updated: 0, failed: 0, message: 'No records need geocoding' }
          continue
        }

        console.log(`Found ${records.length} records to geocode in ${tableName}`)
        
        let updated = 0
        let failed = 0

        // Process in small batches for efficiency
        const chunkSize = 25
        
        for (let i = 0; i < records.length; i += chunkSize) {
          const chunk = records.slice(i, i + chunkSize)
          
          // Process chunk records in parallel for speed
          const promises = chunk.map(async (record) => {
            try {
              const location = await enhancedGeocode(record.city, record.state, record.address)
              
              if (location) {
                const { error: updateError } = await supabase
                  .from(tableName)
                  .update({
                    latitude: location.lat,
                    longitude: location.lng
                  })
                  .eq('id', record.id)
                
                if (updateError) {
                  console.error(`Update error for ${tableName} ${record.id}:`, updateError)
                  return { success: false }
                } else {
                  console.log(`Geocoded ${tableName} ${record.id}: ${location.lat}, ${location.lng} (${location.source})`)
                  return { success: true }
                }
              } else {
                return { success: false }
              }
            } catch (error) {
              console.error(`Geocoding error for ${tableName} ${record.id}:`, error)
              return { success: false }
            }
          })

          const chunkResults = await Promise.all(promises)
          updated += chunkResults.filter(r => r.success).length
          failed += chunkResults.filter(r => !r.success).length

          // Brief pause between chunks
          if (i + chunkSize < records.length) {
            await new Promise(resolve => setTimeout(resolve, 50))
          }
        }

        results[tableName] = { updated, failed }
        totalProcessed += records.length
        totalUpdated += updated
        totalFailed += failed

      } catch (error) {
        console.error(`Error processing table ${tableName}:`, error)
        results[tableName] = { error: error.message, updated: 0, failed: 0 }
      }
    }

    const endTime = Date.now()
    const processingTime = `${((endTime - startTime) / 1000).toFixed(2)}s`

    console.log(`Fast geocoding completed in ${processingTime}`)
    console.log(`Total: ${totalProcessed} processed, ${totalUpdated} updated, ${totalFailed} failed`)

    return new Response(JSON.stringify({
      summary: {
        totalProcessed,
        totalUpdated,
        totalFailed,
        processingTime
      },
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Fast geocoding error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      summary: { totalProcessed: 0, totalUpdated: 0, totalFailed: 0, processingTime: '0s' },
      results: {}
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})