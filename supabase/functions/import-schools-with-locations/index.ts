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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const schools = [
      "Hawaii Pacific University Honolulu",
      "Neumann University",
      "University of St. Augustine for Health Sciences - St. Augustine, FL",
      "Seton Hill University",
      "University of North Florida",
      "The University of New Mexico",
      "Governors State University",
      "Long Island University - Brooklyn Campus",
      "Mount Saint Mary's University",
      "Murphy Deming College of Health Sciences/Mary Baldwin University",
      "Elon University",
      "Hampton University",
      "Stony Brook University",
      "University of Maryland - Baltimore",
      "Hofstra University",
      "University of Findlay - PTA to DPT Bridge Program",
      "Bowling Green State University",
      "Lebanon Valley College",
      "Tufts University - Phoenix, AZ",
      "Radford University",
      "Old Dominion University",
      "Gannon University - Ruskin",
      "University of Vermont",
      "Manchester University",
      "Chatham University",
      "Gannon University - Erie",
      "Colorado Mesa University",
      "Rockhurst University",
      "Florida Southern College",
      "Loma Linda University",
      "University of Arkansas for Medical Sciences",
      "University of Massachusetts Lowell",
      "University of Maryland - Eastern Shore",
      "Georgia Southern University",
      "University of Oklahoma Health Sciences Center",
      "University of Texas Rio Grande Valley",
      "University of Florida",
      "Seton Hall University",
      "California State University, Long Beach",
      "East Tennessee State University",
      "Phoenix Physical Therapy",
      "Central Michigan University",
      "University of Central Florida",
      "Trine University",
      "Concordia University - Saint Paul",
      "Harding University",
      "University of Wisconsin-Madison",
      "University of Colorado",
      "St. Ambrose University",
      "Hardin-Simmons University",
      "Tarleton State University",
      "Universidad Ana G. Méndez",
      "Graceland University",
      "Moravian University",
      "Emory University",
      "University of Puget Sound",
      "University of California, San Francisco/San Francisco State University",
      "Oregon State University - Cascades",
      "Louisiana State University Health Sciences Center in Shreveport",
      "Bradley University",
      "Medical University of South Carolina Hybrid Program",
      "Medical University of South Carolina",
      "Clarke University",
      "Utica University",
      "Southern California University of Health Sciences",
      "University of Arizona",
      "University of Arizona- Alternative Pathway",
      "University of Alabama at Birmingham",
      "University of Wisconsin-LaCrosse",
      "Quincy University",
      "Rocky Mountain University of Health Professions",
      "University of Mount Union",
      "California State University, Northridge",
      "Allen College",
      "Belmont University",
      "Louisiana State University",
      "University of Illinois at Chicago",
      "University of Washington",
      "Texas State University",
      "Pacific Northwest University of Health Sciences",
      "University of Wisconsin - Stevens Point",
      "Augustana University",
      "St. Catherine University",
      "Arkansas State University",
      "Cleveland State University",
      "Wichita State University",
      "Harrisburg University of Science and Technology",
      "Pacific University",
      "Anderson University",
      "University of Charleston in West Virginia",
      "University of Rhode Island",
      "Creighton University - Omaha",
      "University of Mississippi Medical Center",
      "Oklahoma City University",
      "Wayne State University",
      "South College- Atlanta Campus",
      "Angelo State University",
      "Western University of Health Sciences - Oregon",
      "Quinnipiac University",
      "Jacksonville University",
      "College of Staten Island, (CUNY)",
      "University of Toledo",
      "Marymount University",
      "Marshall University",
      "Touro University (Manhattan/Long Island)",
      "North Central College",
      "University of Dayton",
      "University of Lynchburg",
      "Whitworth University",
      "Mercer University",
      "University of Texas Medical Branch at Galveston",
      "Texas Woman's University",
      "Western University of Health Sciences - California",
      "Eastern Washington University",
      "Creighton University - Phoenix",
      "Northern Illinois University",
      "University of Connecticut",
      "Duke University",
      "Wheeling University",
      "D'Youville University",
      "Oregon Tech-OHSU",
      "Bellin College",
      "University of Wisconsin-Milwaukee",
      "Nova Southeastern University - Fort Lauderdale",
      "Winston-Salem State University",
      "Carlow University",
      "University of Texas at El Paso",
      "Marist University",
      "Nova Southeastern University - Tampa Bay",
      "University of North Texas Health Science Center at Fort Worth",
      "Tennessee State University",
      "MGH Institute of Health Professions",
      "University of Kansas Medical Center",
      "Western Carolina University",
      "New York Medical College",
      "South College – Knoxville",
      "Alvernia University",
      "Concordia University Ann Arbor",
      "University of Saint Mary",
      "Campbell University",
      "University of Jamestown",
      "Briar Cliff University",
      "Oakland University",
      "George Fox University",
      "State University of New York (SUNY) Downstate Health Sciences University",
      "SUNY Binghamton University",
      "Hanover College",
      "Samuel Merritt University",
      "California State University, Fresno",
      "University of Texas Southwestern Medical Center at Dallas",
      "University of Delaware",
      "Methodist University",
      "University of St. Augustine for Health Sciences - Austin, TX",
      "Faulkner University",
      "San Diego State University",
      "Midwestern University - Downers Grove",
      "Emory & Henry University - School of Health Sciences",
      "Mount St. Joseph University",
      "University of South Alabama",
      "West Coast University",
      "University of Miami",
      "Drexel University",
      "South College - Nashville",
      "Columbia University",
      "Hawaii Pacific University Las Vegas",
      "PCOM Georgia",
      "Boston University",
      "Northwestern University",
      "University of the Cumberlands",
      "Russell Sage College",
      "AdventHealth University",
      "University of Louisiana Monroe",
      "University of St. Augustine for Health Sciences - San Marcos, CA",
      "College of Saint Mary",
      "Arkansas College of Health Education",
      "Langston University",
      "University of Memphis",
      "William Carey University Bridge Program",
      "Texas A&M University Texarkana",
      "University of New England",
      "Long Island University - Post Campus",
      "University of Mary",
      "Dominican University New York",
      "Johnson & Wales University",
      "Tufts University - Seattle, WA",
      "University of St. Augustine for Health Sciences - Miami, FL",
      "Samford University",
      "Des Moines University - Osteopathic Medical Center",
      "Touro University Nevada",
      "Virginia Commonwealth University",
      "University of Kentucky",
      "Spalding University",
      "University of St. Augustine for Health Sciences - Dallas, TX",
      "Alabama State University",
      "University of the Incarnate Word",
      "Charleston Southern University",
      "University of Tennessee Health Science Center",
      "College of St Scholastica",
      "Ithaca College",
      "Lincoln Memorial University",
      "Massachusetts College of Pharmacy and Health Sciences",
      "AT Still University of Health Sciences",
      "Army-Baylor University",
      "Concordia University Wisconsin",
      "University of South Carolina",
      "Brenau University",
      "University of Pittsburgh",
      "Clarkson University",
      "Grand Valley State University",
      "University of Utah",
      "University of Iowa",
      "Idaho State University",
      "Northeastern University",
      "Florida International University",
      "Western Michigan University",
      "University of the Pacific",
      "Mercy University",
      "California State University, Sacramento",
      "University of Tennessee at Chattanooga",
      "Howard University",
      "University of North Georgia",
      "Andrews University",
      "Azusa Pacific University",
      "Thomas Jefferson University",
      "New York University",
      "University of Hartford",
      "Florida Gulf Coast University",
      "University of Cincinnati",
      "West Virginia University",
      "Shenandoah University",
      "Southwest Baptist University",
      "Rutgers, The State University of New Jersey",
      "Temple University",
      "Franklin Pierce University",
      "University of Michigan - Flint",
      "DeSales University",
      "Baylor University",
      "Kean University",
      "Indiana State University",
      "Wingate University",
      "Franciscan Missionaries of Our Lady University",
      "Tufts University - Boston, MA",
      "George Washington University",
      "Mayo Clinic College of Medicine and Science",
      "East Carolina University",
      "Simmons University",
      "American International College",
      "Nazareth University",
      "Chapman University",
      "Augusta University",
      "Indiana University",
      "University of Indianapolis",
      "Midwestern University - Glendale",
      "Washington University in St. Louis",
      "New England Institute of Technology",
      "Carroll University",
      "Rosalind Franklin University of Medicine and Science",
      "University of Texas Health Science Center at San Antonio",
      "University of Findlay",
      "Regis University",
      "Arcadia University",
      "Widener University",
      "Slippery Rock University of Pennsylvania",
      "Sacred Heart University",
      "State University of New York Upstate Medical University",
      "Bellarmine University",
      "Duquesne University",
      "Messiah University",
      "High Point University",
      "Lewis University",
      "Saint Francis University",
      "Misericordia University",
      "University of South Dakota",
      "University of Nevada, Las Vegas",
      "University of Nebraska Medical Center",
      "Walsh University",
      "Maryville University of Saint Louis",
      "Missouri State University",
      "Stockton University",
      "Northern Arizona University",
      "Saint Louis University",
      "Plymouth State University",
      "Ohio University",
      "Ohio State University",
      "University of North Dakota",
      "University of Montana - Missoula",
      "University of South Florida",
      "Husson University",
      "Springfield College",
      "University of Evansville",
      "University of Scranton",
      "Texas Tech University Health Sciences Center",
      "University of North Carolina at Chapel Hill",
      "University at Buffalo, State University of New York",
      "Saint Joseph's University",
      "University of Central Arkansas",
      "University of Mary Hardin-Baylor",
      "University of Southern California",
      "William Carey University",
      "Western Kentucky University",
      "New York Institute of Technology",
      "Youngstown State University",
      "Daemen University",
      "Georgia State University",
      "Florida Agricultural and Mechanical University"
    ];

    console.log(`Processing ${schools.length} schools`);
    
    let processed = 0;
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const schoolName of schools) {
      try {
        processed++;
        console.log(`Processing ${processed}/${schools.length}: ${schoolName}`);
        
        // Extract location from school name if available
        let city = "";
        let state = "";
        
        // Look for explicit location indicators
        if (schoolName.includes(" - ")) {
          const parts = schoolName.split(" - ");
          const locationPart = parts[parts.length - 1];
          
          // Extract state from end of location
          const stateMatch = locationPart.match(/,?\s*([A-Z]{2})$/);
          if (stateMatch) {
            state = stateMatch[1];
            city = locationPart.replace(stateMatch[0], "").replace(/,\s*$/, "").trim();
          }
        }
        
        // If no explicit location, infer from university name
        if (!city || !state) {
          const locationInfo = inferLocationFromName(schoolName);
          if (!city) city = locationInfo.city;
          if (!state) state = locationInfo.state;
        }
        
        if (!city || !state) {
          console.log(`Could not determine location for: ${schoolName}`);
          errors.push(`Could not determine location for: ${schoolName}`);
          failed++;
          continue;
        }
        
        // Check if school already exists
        const { data: existingSchool } = await supabaseClient
          .from('schools')
          .select('id')
          .ilike('name', schoolName)
          .single();
          
        if (existingSchool) {
          console.log(`School already exists: ${schoolName}`);
          continue;
        }
        
        // Insert the school
        const { error: insertError } = await supabaseClient
          .from('schools')
          .insert({
            name: schoolName,
            city: city,
            state: state
          });
          
        if (insertError) {
          console.error(`Error inserting ${schoolName}:`, insertError);
          errors.push(`Error inserting ${schoolName}: ${insertError.message}`);
          failed++;
        } else {
          console.log(`Successfully inserted: ${schoolName} - ${city}, ${state}`);
          successful++;
        }
        
        // Add small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error processing ${schoolName}:`, error);
        errors.push(`Error processing ${schoolName}: ${error.message}`);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        successful,
        failed,
        errors
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function inferLocationFromName(schoolName: string): { city: string; state: string } {
  const name = schoolName.toLowerCase();
  
  // State mappings
  const stateMap: { [key: string]: string } = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY'
  };

  // Comprehensive specific mappings for known schools
  const locationMap: { [key: string]: { city: string; state: string } } = {
    // Previously successful mappings
    'hawaii pacific university honolulu': { city: 'Honolulu', state: 'HI' },
    'neumann university': { city: 'Aston', state: 'PA' },
    'seton hill university': { city: 'Greensburg', state: 'PA' },
    'university of north florida': { city: 'Jacksonville', state: 'FL' },
    'the university of new mexico': { city: 'Albuquerque', state: 'NM' },
    'governors state university': { city: 'University Park', state: 'IL' },
    'long island university - brooklyn campus': { city: 'Brooklyn', state: 'NY' },
    'mount saint mary\'s university': { city: 'Los Angeles', state: 'CA' },
    'elon university': { city: 'Elon', state: 'NC' },
    'hampton university': { city: 'Hampton', state: 'VA' },
    'stony brook university': { city: 'Stony Brook', state: 'NY' },
    'hofstra university': { city: 'Hempstead', state: 'NY' },
    'university of findlay - pta to dpt bridge program': { city: 'Findlay', state: 'OH' },
    'bowling green state university': { city: 'Bowling Green', state: 'OH' },
    'lebanon valley college': { city: 'Annville', state: 'PA' },
    'radford university': { city: 'Radford', state: 'VA' },
    'old dominion university': { city: 'Norfolk', state: 'VA' },
    'university of vermont': { city: 'Burlington', state: 'VT' },
    'manchester university': { city: 'Fort Wayne', state: 'IN' },
    'chatham university': { city: 'Pittsburgh', state: 'PA' },
    'colorado mesa university': { city: 'Grand Junction', state: 'CO' },
    'rockhurst university': { city: 'Kansas City', state: 'MO' },
    'florida southern college': { city: 'Lakeland', state: 'FL' },
    'loma linda university': { city: 'Loma Linda', state: 'CA' },

    // Failed schools - adding proper mappings
    'murphy deming college of health sciences/mary baldwin university': { city: 'Fishersville', state: 'VA' },
    'gannon university - ruskin': { city: 'Ruskin', state: 'FL' },
    'gannon university - erie': { city: 'Erie', state: 'PA' },
    'georgia southern university': { city: 'Statesboro', state: 'GA' },
    'seton hall university': { city: 'South Orange', state: 'NJ' },
    'california state university, long beach': { city: 'Long Beach', state: 'CA' },
    'east tennessee state university': { city: 'Johnson City', state: 'TN' },
    'concordia university - saint paul': { city: 'Saint Paul', state: 'MN' },
    'universidad ana g. méndez': { city: 'San Juan', state: 'PR' },
    'oregon state university - cascades': { city: 'Bend', state: 'OR' },
    'louisiana state university health sciences center in shreveport': { city: 'Shreveport', state: 'LA' },
    'southern california university of health sciences': { city: 'Whittier', state: 'CA' },
    'rocky mountain university of health professions': { city: 'Provo', state: 'UT' },
    'california state university, northridge': { city: 'Northridge', state: 'CA' },
    'louisiana state university': { city: 'Baton Rouge', state: 'LA' },
    'pacific northwest university of health sciences': { city: 'Yakima', state: 'WA' },
    'harrisburg university of science and technology': { city: 'Harrisburg', state: 'PA' },
    'university of charleston in west virginia': { city: 'Charleston', state: 'WV' },
    'creighton university - omaha': { city: 'Omaha', state: 'NE' },
    'western university of health sciences - oregon': { city: 'Lebanon', state: 'OR' },
    'college of staten island, (cuny)': { city: 'Staten Island', state: 'NY' },
    'touro university (manhattan/long island)': { city: 'New York', state: 'NY' },
    'western university of health sciences - california': { city: 'Pomona', state: 'CA' },
    'oregon tech-ohsu': { city: 'Portland', state: 'OR' },
    'nova southeastern university - fort lauderdale': { city: 'Fort Lauderdale', state: 'FL' },
    'nova southeastern university - tampa bay': { city: 'Tampa', state: 'FL' },
    'university of north texas health science center at fort worth': { city: 'Fort Worth', state: 'TX' },
    'south college – knoxville': { city: 'Knoxville', state: 'TN' },
    'concordia university ann arbor': { city: 'Ann Arbor', state: 'MI' },
    'suny binghamton university': { city: 'Binghamton', state: 'NY' },
    'california state university, fresno': { city: 'Fresno', state: 'CA' },
    'midwestern university - downers grove': { city: 'Downers Grove', state: 'IL' },
    'emory & henry university - school of health sciences': { city: 'Emory', state: 'VA' },
    'hawaii pacific university las vegas': { city: 'Las Vegas', state: 'NV' },
    'pcom georgia': { city: 'Suwanee', state: 'GA' },
    'arkansas college of health education': { city: 'Fort Smith', state: 'AR' },
    'william carey university bridge program': { city: 'Hattiesburg', state: 'MS' },
    'texas a&m university texarkana': { city: 'Texarkana', state: 'TX' },
    'des moines university - osteopathic medical center': { city: 'Des Moines', state: 'IA' },
    'university of the incarnate word': { city: 'San Antonio', state: 'TX' },
    'massachusetts college of pharmacy and health sciences': { city: 'Boston', state: 'MA' },
    'at still university of health sciences': { city: 'Kirksville', state: 'MO' },
    'concordia university wisconsin': { city: 'Mequon', state: 'WI' },
    'california state university, sacramento': { city: 'Sacramento', state: 'CA' },
    'university of north georgia': { city: 'Dahlonega', state: 'GA' },
    'franklin pierce university': { city: 'Rindge', state: 'NH' },
    'franciscan missionaries of our lady university': { city: 'Baton Rouge', state: 'LA' },
    'mayo clinic college of medicine and science': { city: 'Rochester', state: 'MN' },
    'indiana university': { city: 'Bloomington', state: 'IN' },
    'midwestern university - glendale': { city: 'Glendale', state: 'AZ' },
    'new england institute of technology': { city: 'East Greenwich', state: 'RI' },
    'rosalind franklin university of medicine and science': { city: 'North Chicago', state: 'IL' },
    'maryville university of saint louis': { city: 'St. Louis', state: 'MO' },
    'texas tech university health sciences center': { city: 'Lubbock', state: 'TX' },
    'university of central arkansas': { city: 'Conway', state: 'AR' },
    'university of mary hardin-baylor': { city: 'Belton', state: 'TX' },
    'university of southern california': { city: 'Los Angeles', state: 'CA' },
    'florida agricultural and mechanical university': { city: 'Tallahassee', state: 'FL' },

    // Add more comprehensive mappings
    'central michigan university': { city: 'Mount Pleasant', state: 'MI' },
    'university of central florida': { city: 'Orlando', state: 'FL' },
    'trine university': { city: 'Angola', state: 'IN' },
    'harding university': { city: 'Searcy', state: 'AR' },
    'st. ambrose university': { city: 'Davenport', state: 'IA' },
    'hardin-simmons university': { city: 'Abilene', state: 'TX' },
    'tarleton state university': { city: 'Stephenville', state: 'TX' },
    'graceland university': { city: 'Lamoni', state: 'IA' },
    'moravian university': { city: 'Bethlehem', state: 'PA' },
    'emory university': { city: 'Atlanta', state: 'GA' },
    'university of puget sound': { city: 'Tacoma', state: 'WA' },
    'bradley university': { city: 'Peoria', state: 'IL' },
    'clarke university': { city: 'Dubuque', state: 'IA' },
    'utica university': { city: 'Utica', state: 'NY' },
    'quincy university': { city: 'Quincy', state: 'IL' },
    'university of mount union': { city: 'Alliance', state: 'OH' },
    'allen college': { city: 'Waterloo', state: 'IA' },
    'belmont university': { city: 'Nashville', state: 'TN' },
    'texas state university': { city: 'San Marcos', state: 'TX' },
    'augustana university': { city: 'Sioux Falls', state: 'SD' },
    'st. catherine university': { city: 'Saint Paul', state: 'MN' },
    'arkansas state university': { city: 'Jonesboro', state: 'AR' },
    'cleveland state university': { city: 'Cleveland', state: 'OH' },
    'wichita state university': { city: 'Wichita', state: 'KS' },
    'pacific university': { city: 'Forest Grove', state: 'OR' },
    'anderson university': { city: 'Anderson', state: 'IN' },
    'university of rhode island': { city: 'Kingston', state: 'RI' },
    'oklahoma city university': { city: 'Oklahoma City', state: 'OK' },
    'wayne state university': { city: 'Detroit', state: 'MI' },
    'angelo state university': { city: 'San Angelo', state: 'TX' },
    'quinnipiac university': { city: 'Hamden', state: 'CT' },
    'jacksonville university': { city: 'Jacksonville', state: 'FL' },
    'university of toledo': { city: 'Toledo', state: 'OH' },
    'marymount university': { city: 'Arlington', state: 'VA' },
    'marshall university': { city: 'Huntington', state: 'WV' },
    'north central college': { city: 'Naperville', state: 'IL' },
    'university of dayton': { city: 'Dayton', state: 'OH' },
    'university of lynchburg': { city: 'Lynchburg', state: 'VA' },
    'whitworth university': { city: 'Spokane', state: 'WA' },
    'mercer university': { city: 'Macon', state: 'GA' },
    'texas woman\'s university': { city: 'Denton', state: 'TX' },
    'eastern washington university': { city: 'Cheney', state: 'WA' },
    'northern illinois university': { city: 'DeKalb', state: 'IL' },
    'university of connecticut': { city: 'Storrs', state: 'CT' },
    'duke university': { city: 'Durham', state: 'NC' },
    'wheeling university': { city: 'Wheeling', state: 'WV' },
    'd\'youville university': { city: 'Buffalo', state: 'NY' },
    'bellin college': { city: 'Green Bay', state: 'WI' },
    'winston-salem state university': { city: 'Winston-Salem', state: 'NC' },
    'carlow university': { city: 'Pittsburgh', state: 'PA' },
    'marist university': { city: 'Poughkeepsie', state: 'NY' },
    'tennessee state university': { city: 'Nashville', state: 'TN' },
    'mgh institute of health professions': { city: 'Boston', state: 'MA' },
    'western carolina university': { city: 'Cullowhee', state: 'NC' },
    'new york medical college': { city: 'Valhalla', state: 'NY' },
    'alvernia university': { city: 'Reading', state: 'PA' },
    'university of saint mary': { city: 'Leavenworth', state: 'KS' },
    'campbell university': { city: 'Buies Creek', state: 'NC' },
    'university of jamestown': { city: 'Jamestown', state: 'ND' },
    'briar cliff university': { city: 'Sioux City', state: 'IA' },
    'oakland university': { city: 'Rochester', state: 'MI' },
    'george fox university': { city: 'Newberg', state: 'OR' },
    'hanover college': { city: 'Hanover', state: 'IN' },
    'samuel merritt university': { city: 'Oakland', state: 'CA' },
    'university of delaware': { city: 'Newark', state: 'DE' },
    'methodist university': { city: 'Fayetteville', state: 'NC' },
    'faulkner university': { city: 'Montgomery', state: 'AL' },
    'san diego state university': { city: 'San Diego', state: 'CA' },
    'mount st. joseph university': { city: 'Cincinnati', state: 'OH' },
    'university of south alabama': { city: 'Mobile', state: 'AL' },
    'west coast university': { city: 'Los Angeles', state: 'CA' },
    'university of miami': { city: 'Miami', state: 'FL' },
    'drexel university': { city: 'Philadelphia', state: 'PA' },
    'columbia university': { city: 'New York', state: 'NY' },
    'boston university': { city: 'Boston', state: 'MA' },
    'northwestern university': { city: 'Evanston', state: 'IL' },
    'university of the cumberlands': { city: 'Williamsburg', state: 'KY' },
    'russell sage college': { city: 'Troy', state: 'NY' },
    'adventhealth university': { city: 'Orlando', state: 'FL' },
    'college of saint mary': { city: 'Omaha', state: 'NE' },
    'langston university': { city: 'Langston', state: 'OK' },
    'university of memphis': { city: 'Memphis', state: 'TN' },
    'university of new england': { city: 'Biddeford', state: 'ME' },
    'long island university - post campus': { city: 'Brookville', state: 'NY' },
    'university of mary': { city: 'Bismarck', state: 'ND' },
    'dominican university new york': { city: 'Orangeburg', state: 'NY' },
    'johnson & wales university': { city: 'Providence', state: 'RI' },
    'samford university': { city: 'Birmingham', state: 'AL' },
    'touro university nevada': { city: 'Henderson', state: 'NV' },
    'virginia commonwealth university': { city: 'Richmond', state: 'VA' },
    'university of kentucky': { city: 'Lexington', state: 'KY' },
    'spalding university': { city: 'Louisville', state: 'KY' },
    'alabama state university': { city: 'Montgomery', state: 'AL' },
    'charleston southern university': { city: 'Charleston', state: 'SC' },
    'college of st scholastica': { city: 'Duluth', state: 'MN' },
    'ithaca college': { city: 'Ithaca', state: 'NY' },
    'lincoln memorial university': { city: 'Harrogate', state: 'TN' },
    'army-baylor university': { city: 'San Antonio', state: 'TX' },
    'university of south carolina': { city: 'Columbia', state: 'SC' },
    'brenau university': { city: 'Gainesville', state: 'GA' },
    'university of pittsburgh': { city: 'Pittsburgh', state: 'PA' },
    'clarkson university': { city: 'Potsdam', state: 'NY' },
    'grand valley state university': { city: 'Allendale', state: 'MI' },
    'university of utah': { city: 'Salt Lake City', state: 'UT' },
    'university of iowa': { city: 'Iowa City', state: 'IA' },
    'idaho state university': { city: 'Pocatello', state: 'ID' },
    'northeastern university': { city: 'Boston', state: 'MA' },
    'florida international university': { city: 'Miami', state: 'FL' },
    'western michigan university': { city: 'Kalamazoo', state: 'MI' },
    'university of the pacific': { city: 'Stockton', state: 'CA' },
    'mercy university': { city: 'Dobbs Ferry', state: 'NY' },
    'howard university': { city: 'Washington', state: 'DC' },
    'andrews university': { city: 'Berrien Springs', state: 'MI' },
    'azusa pacific university': { city: 'Azusa', state: 'CA' },
    'thomas jefferson university': { city: 'Philadelphia', state: 'PA' },
    'new york university': { city: 'New York', state: 'NY' },
    'university of hartford': { city: 'West Hartford', state: 'CT' },
    'florida gulf coast university': { city: 'Fort Myers', state: 'FL' },
    'university of cincinnati': { city: 'Cincinnati', state: 'OH' },
    'west virginia university': { city: 'Morgantown', state: 'WV' },
    'shenandoah university': { city: 'Winchester', state: 'VA' },
    'southwest baptist university': { city: 'Bolivar', state: 'MO' },
    'temple university': { city: 'Philadelphia', state: 'PA' },
    'university of michigan - flint': { city: 'Flint', state: 'MI' },
    'desales university': { city: 'Center Valley', state: 'PA' },
    'baylor university': { city: 'Waco', state: 'TX' },
    'kean university': { city: 'Union', state: 'NJ' },
    'indiana state university': { city: 'Terre Haute', state: 'IN' },
    'wingate university': { city: 'Wingate', state: 'NC' },
    'george washington university': { city: 'Washington', state: 'DC' },
    'east carolina university': { city: 'Greenville', state: 'NC' },
    'simmons university': { city: 'Boston', state: 'MA' },
    'american international college': { city: 'Springfield', state: 'MA' },
    'nazareth university': { city: 'Rochester', state: 'NY' },
    'chapman university': { city: 'Orange', state: 'CA' },
    'augusta university': { city: 'Augusta', state: 'GA' },
    'university of indianapolis': { city: 'Indianapolis', state: 'IN' },
    'washington university in st. louis': { city: 'St. Louis', state: 'MO' },
    'carroll university': { city: 'Waukesha', state: 'WI' },
    'university of findlay': { city: 'Findlay', state: 'OH' },
    'regis university': { city: 'Denver', state: 'CO' },
    'arcadia university': { city: 'Glenside', state: 'PA' },
    'widener university': { city: 'Chester', state: 'PA' },
    'slippery rock university of pennsylvania': { city: 'Slippery Rock', state: 'PA' },
    'sacred heart university': { city: 'Fairfield', state: 'CT' },
    'bellarmine university': { city: 'Louisville', state: 'KY' },
    'duquesne university': { city: 'Pittsburgh', state: 'PA' },
    'messiah university': { city: 'Mechanicsburg', state: 'PA' },
    'high point university': { city: 'High Point', state: 'NC' },
    'lewis university': { city: 'Romeoville', state: 'IL' },
    'saint francis university': { city: 'Loretto', state: 'PA' },
    'misericordia university': { city: 'Dallas', state: 'PA' },
    'university of south dakota': { city: 'Vermillion', state: 'SD' },
    'university of nevada, las vegas': { city: 'Las Vegas', state: 'NV' },
    'walsh university': { city: 'North Canton', state: 'OH' },
    'missouri state university': { city: 'Springfield', state: 'MO' },
    'stockton university': { city: 'Galloway', state: 'NJ' },
    'northern arizona university': { city: 'Flagstaff', state: 'AZ' },
    'saint louis university': { city: 'St. Louis', state: 'MO' },
    'plymouth state university': { city: 'Plymouth', state: 'NH' },
    'ohio university': { city: 'Athens', state: 'OH' },
    'ohio state university': { city: 'Columbus', state: 'OH' },
    'university of north dakota': { city: 'Grand Forks', state: 'ND' },
    'university of south florida': { city: 'Tampa', state: 'FL' },
    'husson university': { city: 'Bangor', state: 'ME' },
    'springfield college': { city: 'Springfield', state: 'MA' },
    'university of evansville': { city: 'Evansville', state: 'IN' },
    'university of scranton': { city: 'Scranton', state: 'PA' },
    'saint joseph\'s university': { city: 'Philadelphia', state: 'PA' },
    'william carey university': { city: 'Hattiesburg', state: 'MS' },
    'western kentucky university': { city: 'Bowling Green', state: 'KY' },
    'new york institute of technology': { city: 'Old Westbury', state: 'NY' },
    'youngstown state university': { city: 'Youngstown', state: 'OH' },
    'daemen university': { city: 'Amherst', state: 'NY' },
    'georgia state university': { city: 'Atlanta', state: 'GA' }
  };
  
  // Check specific mappings first
  const lowerName = schoolName.toLowerCase();
  if (locationMap[lowerName]) {
    return locationMap[lowerName];
  }
  
  // Enhanced parsing for location information in school names
  
  // Look for explicit city, state patterns
  const cityStatePattern = /,\s*([A-Z]{2})\s*$/;
  const cityStateMatch = schoolName.match(cityStatePattern);
  if (cityStateMatch) {
    const state = cityStateMatch[1];
    const beforeState = schoolName.replace(cityStateMatch[0], '').trim();
    
    // Extract city from the end of the remaining text
    const cityMatch = beforeState.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*$/);
    if (cityMatch) {
      return { city: cityMatch[1], state };
    }
  }
  
  // Look for "University of [State]" or "State University" patterns
  for (const [stateName, abbrev] of Object.entries(stateMap)) {
    if (name.includes(`university of ${stateName}`)) {
      // State university main campuses
      const stateCapitals: { [key: string]: string } = {
        'AL': 'Tuscaloosa', 'AK': 'Fairbanks', 'AZ': 'Tucson', 'AR': 'Fayetteville',
        'CA': 'Los Angeles', 'CO': 'Boulder', 'CT': 'Storrs', 'DE': 'Newark',
        'FL': 'Gainesville', 'GA': 'Athens', 'HI': 'Honolulu', 'ID': 'Moscow',
        'IL': 'Urbana', 'IN': 'Bloomington', 'IA': 'Iowa City', 'KS': 'Lawrence',
        'KY': 'Lexington', 'LA': 'Baton Rouge', 'ME': 'Orono', 'MD': 'College Park',
        'MA': 'Amherst', 'MI': 'Ann Arbor', 'MN': 'Minneapolis', 'MS': 'Oxford',
        'MO': 'Columbia', 'MT': 'Missoula', 'NE': 'Lincoln', 'NV': 'Reno',
        'NH': 'Durham', 'NJ': 'New Brunswick', 'NM': 'Albuquerque', 'NY': 'Buffalo',
        'NC': 'Chapel Hill', 'ND': 'Grand Forks', 'OH': 'Columbus', 'OK': 'Norman',
        'OR': 'Eugene', 'PA': 'University Park', 'RI': 'Kingston', 'SC': 'Columbia',
        'SD': 'Vermillion', 'TN': 'Knoxville', 'TX': 'Austin', 'UT': 'Salt Lake City',
        'VT': 'Burlington', 'VA': 'Charlottesville', 'WA': 'Seattle', 'WV': 'Morgantown',
        'WI': 'Madison', 'WY': 'Laramie'
      };
      
      return { city: stateCapitals[abbrev] || '', state: abbrev };
    }
    
    if (name.includes(`${stateName} state university`)) {
      const stateCapitals: { [key: string]: string } = {
        'AL': 'Montgomery', 'AZ': 'Tempe', 'AR': 'Jonesboro', 'CA': 'Long Beach',
        'CO': 'Fort Collins', 'FL': 'Tallahassee', 'GA': 'Atlanta', 'ID': 'Pocatello',
        'IL': 'Normal', 'IN': 'Terre Haute', 'IA': 'Ames', 'KS': 'Manhattan',
        'KY': 'Frankfort', 'LA': 'Baton Rouge', 'MI': 'East Lansing', 'MN': 'Mankato',
        'MS': 'Mississippi State', 'MO': 'Springfield', 'MT': 'Bozeman', 'NV': 'Las Vegas',
        'NY': 'Albany', 'NC': 'Raleigh', 'ND': 'Fargo', 'OH': 'Columbus',
        'OK': 'Stillwater', 'OR': 'Corvallis', 'PA': 'University Park', 'SD': 'Brookings',
        'TN': 'Nashville', 'TX': 'College Station', 'UT': 'Logan', 'WA': 'Pullman',
        'WV': 'Morgantown', 'WI': 'Madison'
      };
      
      return { city: stateCapitals[abbrev] || '', state: abbrev };
    }
  }
  
  // Try to extract from common city names in university names
  const cityPatterns = [
    { pattern: /boston/i, city: 'Boston', state: 'MA' },
    { pattern: /chicago/i, city: 'Chicago', state: 'IL' },
    { pattern: /philadelphia/i, city: 'Philadelphia', state: 'PA' },
    { pattern: /atlanta/i, city: 'Atlanta', state: 'GA' },
    { pattern: /houston/i, city: 'Houston', state: 'TX' },
    { pattern: /phoenix/i, city: 'Phoenix', state: 'AZ' },
    { pattern: /san diego/i, city: 'San Diego', state: 'CA' },
    { pattern: /los angeles/i, city: 'Los Angeles', state: 'CA' },
    { pattern: /san francisco/i, city: 'San Francisco', state: 'CA' },
    { pattern: /seattle/i, city: 'Seattle', state: 'WA' },
    { pattern: /denver/i, city: 'Denver', state: 'CO' },
    { pattern: /miami/i, city: 'Miami', state: 'FL' },
    { pattern: /las vegas/i, city: 'Las Vegas', state: 'NV' },
    { pattern: /detroit/i, city: 'Detroit', state: 'MI' },
    { pattern: /memphis/i, city: 'Memphis', state: 'TN' },
    { pattern: /nashville/i, city: 'Nashville', state: 'TN' },
    { pattern: /charlotte/i, city: 'Charlotte', state: 'NC' },
    { pattern: /baltimore/i, city: 'Baltimore', state: 'MD' },
    { pattern: /milwaukee/i, city: 'Milwaukee', state: 'WI' },
    { pattern: /kansas city/i, city: 'Kansas City', state: 'MO' },
    { pattern: /fort worth/i, city: 'Fort Worth', state: 'TX' },
    { pattern: /san antonio/i, city: 'San Antonio', state: 'TX' },
    { pattern: /columbus/i, city: 'Columbus', state: 'OH' },
    { pattern: /charlotte/i, city: 'Charlotte', state: 'NC' },
    { pattern: /indianapolis/i, city: 'Indianapolis', state: 'IN' },
    { pattern: /jacksonville/i, city: 'Jacksonville', state: 'FL' },
    { pattern: /oklahoma city/i, city: 'Oklahoma City', state: 'OK' },
    { pattern: /richmond/i, city: 'Richmond', state: 'VA' },
    { pattern: /new orleans/i, city: 'New Orleans', state: 'LA' },
    { pattern: /raleigh/i, city: 'Raleigh', state: 'NC' },
    { pattern: /omaha/i, city: 'Omaha', state: 'NE' },
    { pattern: /fresno/i, city: 'Fresno', state: 'CA' },
    { pattern: /long beach/i, city: 'Long Beach', state: 'CA' },
    { pattern: /sacramento/i, city: 'Sacramento', state: 'CA' },
    { pattern: /mesa/i, city: 'Mesa', state: 'AZ' },
    { pattern: /virginia beach/i, city: 'Virginia Beach', state: 'VA' },
    { pattern: /colorado springs/i, city: 'Colorado Springs', state: 'CO' },
    { pattern: /fort lauderdale/i, city: 'Fort Lauderdale', state: 'FL' },
    { pattern: /tampa/i, city: 'Tampa', state: 'FL' },
    { pattern: /aurora/i, city: 'Aurora', state: 'CO' },
    { pattern: /anaheim/i, city: 'Anaheim', state: 'CA' },
    { pattern: /santa ana/i, city: 'Santa Ana', state: 'CA' },
    { pattern: /st\. louis/i, city: 'St. Louis', state: 'MO' },
    { pattern: /saint louis/i, city: 'St. Louis', state: 'MO' },
    { pattern: /riverside/i, city: 'Riverside', state: 'CA' },
    { pattern: /corpus christi/i, city: 'Corpus Christi', state: 'TX' },
    { pattern: /lexington/i, city: 'Lexington', state: 'KY' },
    { pattern: /pittsburgh/i, city: 'Pittsburgh', state: 'PA' },
    { pattern: /anchorage/i, city: 'Anchorage', state: 'AK' },
    { pattern: /stockton/i, city: 'Stockton', state: 'CA' },
    { pattern: /cincinnati/i, city: 'Cincinnati', state: 'OH' },
    { pattern: /st\. paul/i, city: 'St. Paul', state: 'MN' },
    { pattern: /saint paul/i, city: 'St. Paul', state: 'MN' },
    { pattern: /toledo/i, city: 'Toledo', state: 'OH' },
    { pattern: /newark/i, city: 'Newark', state: 'NJ' },
    { pattern: /greensboro/i, city: 'Greensboro', state: 'NC' },
    { pattern: /plano/i, city: 'Plano', state: 'TX' },
    { pattern: /henderson/i, city: 'Henderson', state: 'NV' },
    { pattern: /lincoln/i, city: 'Lincoln', state: 'NE' },
    { pattern: /buffalo/i, city: 'Buffalo', state: 'NY' },
    { pattern: /jersey city/i, city: 'Jersey City', state: 'NJ' },
    { pattern: /chula vista/i, city: 'Chula Vista', state: 'CA' },
    { pattern: /fort wayne/i, city: 'Fort Wayne', state: 'IN' },
    { pattern: /orlando/i, city: 'Orlando', state: 'FL' },
    { pattern: /chandler/i, city: 'Chandler', state: 'AZ' },
    { pattern: /laredo/i, city: 'Laredo', state: 'TX' },
    { pattern: /madison/i, city: 'Madison', state: 'WI' },
    { pattern: /durham/i, city: 'Durham', state: 'NC' },
    { pattern: /lubbock/i, city: 'Lubbock', state: 'TX' },
    { pattern: /winston-salem/i, city: 'Winston-Salem', state: 'NC' },
    { pattern: /garland/i, city: 'Garland', state: 'TX' },
    { pattern: /glendale/i, city: 'Glendale', state: 'AZ' },
    { pattern: /hialeah/i, city: 'Hialeah', state: 'FL' },
    { pattern: /reno/i, city: 'Reno', state: 'NV' },
    { pattern: /baton rouge/i, city: 'Baton Rouge', state: 'LA' },
    { pattern: /irvine/i, city: 'Irvine', state: 'CA' },
    { pattern: /chesapeake/i, city: 'Chesapeake', state: 'VA' },
    { pattern: /irving/i, city: 'Irving', state: 'TX' },
    { pattern: /scottsdale/i, city: 'Scottsdale', state: 'AZ' },
    { pattern: /north las vegas/i, city: 'North Las Vegas', state: 'NV' },
    { pattern: /fremont/i, city: 'Fremont', state: 'CA' },
    { pattern: /gilbert/i, city: 'Gilbert', state: 'AZ' },
    { pattern: /san bernardino/i, city: 'San Bernardino', state: 'CA' },
    { pattern: /boise/i, city: 'Boise', state: 'ID' },
    { pattern: /birmingham/i, city: 'Birmingham', state: 'AL' }
  ];
  
  for (const { pattern, city, state } of cityPatterns) {
    if (pattern.test(name)) {
      return { city, state };
    }
  }
  
  // Try to extract state from name and use known pattern
  for (const [stateName, abbrev] of Object.entries(stateMap)) {
    if (name.includes(stateName)) {
      // Return empty city but correct state so we can try other logic
      return { city: "", state: abbrev };
    }
  }
  
  return { city: "", state: "" };
}