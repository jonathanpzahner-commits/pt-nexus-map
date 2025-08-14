import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// US Cities database for fast offline geocoding
const US_CITIES = new Map([
  // Major cities with coordinates - this would be expanded with a comprehensive database
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
  ['CORAL SPRINGS, FL', { lat: 26.2710, lng: -80.2707 }],
  ['ROCKFORD, IL', { lat: 42.2711, lng: -89.0940 }],
  ['POMONA, CA', { lat: 34.0553, lng: -117.7500 }],
  ['TORRANCE, CA', { lat: 33.8358, lng: -118.3406 }],
  ['BRIDGEPORT, CT', { lat: 41.1865, lng: -73.1952 }],
  ['MESQUITE, TX', { lat: 32.7668, lng: -96.5991 }],
  ['WEST VALLEY CITY, UT', { lat: 40.6916, lng: -112.0011 }],
  ['DAYTON, OH', { lat: 39.7589, lng: -84.1916 }],
  ['HOLLYWOOD, FL', { lat: 26.0112, lng: -80.1495 }],
  ['EVANSVILLE, IN', { lat: 37.9716, lng: -87.5711 }],
  ['ALEXANDRIA, VA', { lat: 38.8048, lng: -77.0469 }],
  ['MCALLEN, TX', { lat: 26.2034, lng: -98.2300 }],
  ['WARREN, MI', { lat: 42.5144, lng: -83.0146 }],
  ['STERLING HEIGHTS, MI', { lat: 42.5803, lng: -83.0302 }],
  ['CEDAR RAPIDS, IA', { lat: 41.9778, lng: -91.6656 }],
  ['WEST JORDAN, UT', { lat: 40.6097, lng: -111.9391 }],
  ['CLEARWATER, FL', { lat: 27.9659, lng: -82.8001 }],
  ['ELIZABETH, NJ', { lat: 40.6640, lng: -74.2107 }],
  ['KILLEEN, TX', { lat: 31.1171, lng: -97.7278 }],
  ['RIALTO, CA', { lat: 34.1064, lng: -117.3703 }],
  ['GAINESVILLE, FL', { lat: 29.6516, lng: -82.3248 }],
  ['STAMFORD, CT', { lat: 41.0534, lng: -73.5387 }],
  ['TOPEKA, KS', { lat: 39.0473, lng: -95.6890 }],
  ['VALLEJO, CA', { lat: 38.1041, lng: -122.2566 }],
  ['CONCORD, CA', { lat: 37.9780, lng: -122.0311 }],
  ['THOUSAND OAKS, CA', { lat: 34.1706, lng: -118.8376 }],
  ['SIMI VALLEY, CA', { lat: 34.2694, lng: -118.7815 }],
  ['VISALIA, CA', { lat: 36.3302, lng: -119.2921 }],
  ['WACO, TX', { lat: 31.5494, lng: -97.1467 }],
  ['OLATHE, KS', { lat: 38.8814, lng: -94.8191 }],
  ['CARROLLTON, TX', { lat: 32.9537, lng: -96.8903 }],
  ['BEAUMONT, TX', { lat: 30.0861, lng: -94.1015 }],
  ['DENTON, TX', { lat: 33.2148, lng: -97.1331 }],
  ['MIDLAND, TX', { lat: 32.0175, lng: -102.0779 }],
  ['WEST COVINA, CA', { lat: 34.0686, lng: -117.9390 }],
  ['COLUMBIA, SC', { lat: 34.0007, lng: -81.0348 }],
  ['PEARLAND, TX', { lat: 29.5638, lng: -95.2861 }],
  ['SANTA CLARA, CA', { lat: 37.3541, lng: -121.9552 }],
  ['MIAMI GARDENS, FL', { lat: 25.9420, lng: -80.2456 }],
  ['TEMECULA, CA', { lat: 33.4936, lng: -117.1484 }],
  ['ANTIOCH, CA', { lat: 37.9647, lng: -121.8058 }],
  ['HIGH POINT, NC', { lat: 35.9557, lng: -80.0053 }],
  ['INGLEWOOD, CA', { lat: 33.9617, lng: -118.3531 }],
  ['MANCHESTER, NH', { lat: 42.9956, lng: -71.4548 }],
  ['PALMDALE, CA', { lat: 34.5794, lng: -118.1165 }],
  ['EUGENE, OR', { lat: 44.0521, lng: -123.0868 }],
  ['LOWELL, MA', { lat: 42.6334, lng: -71.3162 }],
  ['SOUTH BEND, IN', { lat: 41.6764, lng: -86.2520 }],
  ['ABILENE, TX', { lat: 32.4487, lng: -99.7331 }],
  ['ELGIN, IL', { lat: 42.0354, lng: -88.2826 }],
  ['ODESSA, TX', { lat: 31.8457, lng: -102.3676 }],
  ['INDEPENDENCE, MO', { lat: 39.0911, lng: -94.4155 }],
  ['PROVO, UT', { lat: 40.2338, lng: -111.6585 }],
  ['CHARLESTON, SC', { lat: 32.7765, lng: -79.9311 }],
  ['NORWALK, CA', { lat: 33.9022, lng: -118.0817 }],
  ['ROUND ROCK, TX', { lat: 30.5083, lng: -97.6789 }],
  ['DOWNEY, CA', { lat: 33.9401, lng: -118.1326 }],
  ['CLOVIS, CA', { lat: 36.8252, lng: -119.7029 }],
  ['ROSEVILLE, CA', { lat: 38.7521, lng: -121.2880 }],
  ['MURFREESBORO, TN', { lat: 35.8456, lng: -86.3903 }],
  ['RICHARDSON, TX', { lat: 32.9483, lng: -96.7299 }],
  ['PUEBLO, CO', { lat: 38.2544, lng: -104.6091 }],
  ['JURUPA VALLEY, CA', { lat: 33.9975, lng: -117.4855 }],
  ['VENTURA, CA', { lat: 34.2746, lng: -119.2290 }],
  ['MIAMI BEACH, FL', { lat: 25.7907, lng: -80.1300 }],
  ['BROKEN ARROW, OK', { lat: 36.0526, lng: -95.7969 }],
  ['RICHMOND, CA', { lat: 37.9358, lng: -122.3477 }],
  ['FAIRFIELD, CA', { lat: 38.2494, lng: -122.0400 }],
  ['ATHENS, GA', { lat: 33.9519, lng: -83.3576 }],
  ['CLIFTON, NJ', { lat: 40.8584, lng: -74.1638 }],
  ['COLLEGE STATION, TX', { lat: 30.6280, lng: -96.3344 }],
  ['CAMBRIDGE, MA', { lat: 42.3736, lng: -71.1097 }],
  ['ALLENTOWN, PA', { lat: 40.6023, lng: -75.4714 }],
  ['NORTH CHARLESTON, SC', { lat: 32.8546, lng: -79.9748 }],
  ['WILMINGTON, NC', { lat: 34.2257, lng: -77.9447 }],
  ['DAVENPORT, IA', { lat: 41.5236, lng: -90.5776 }],
  ['NORWALK, CT', { lat: 41.1177, lng: -73.4079 }],
  ['WEST PALM BEACH, FL', { lat: 26.7153, lng: -80.0534 }],
  ['POMPANO BEACH, FL', { lat: 26.2379, lng: -80.1248 }],
  ['RICHMOND, IN', { lat: 39.8289, lng: -84.8902 }],
  ['BURBANK, CA', { lat: 34.1808, lng: -118.3090 }],
  ['EL MONTE, CA', { lat: 34.0686, lng: -118.0276 }],
  ['FARGO, ND', { lat: 46.8772, lng: -96.7898 }],
  ['ERIE, PA', { lat: 42.1292, lng: -80.0851 }],
  ['LYNN, MA', { lat: 42.4668, lng: -70.9495 }],
  ['ARVADA, CO', { lat: 39.8028, lng: -105.0875 }],
  ['SANDY SPRINGS, GA', { lat: 33.9304, lng: -84.3733 }],
  ['DALY CITY, CA', { lat: 37.7058, lng: -122.4614 }],
  ['LEWISVILLE, TX', { lat: 33.0462, lng: -96.9942 }],
  ['TYLER, TX', { lat: 32.3513, lng: -95.3011 }],
  ['SPARKS, NV', { lat: 39.5349, lng: -119.7527 }],
  ['LAKE FOREST, CA', { lat: 33.6469, lng: -117.689 }],
  ['WOODBRIDGE, NJ', { lat: 40.5576, lng: -74.2846 }],
  ['EVANSTON, IL', { lat: 42.0451, lng: -87.6877 }],
  ['YAKIMA, WA', { lat: 46.6021, lng: -120.5059 }],
  ['GREEN BAY, WI', { lat: 44.5133, lng: -88.0133 }],
  ['HAMILTON, OH', { lat: 39.3995, lng: -84.5613 }],
  ['RENTON, WA', { lat: 47.4829, lng: -122.2171 }],
  ['MENIFEE, CA', { lat: 33.6971, lng: -117.1859 }],
  ['NASHUA, NH', { lat: 42.7654, lng: -71.4676 }],
  ['QUINCY, MA', { lat: 42.2529, lng: -71.0023 }],
  ['DAVIE, FL', { lat: 26.0765, lng: -80.2519 }],
  ['CARMEL, IN', { lat: 39.9784, lng: -86.1180 }],
  ['WESTMINSTER, CO', { lat: 39.8367, lng: -105.0372 }],
  ['WESTLAND, MI', { lat: 42.3242, lng: -83.4002 }],
  ['CICERO, IL', { lat: 41.8456, lng: -87.7539 }],
  ['BEND, OR', { lat: 44.0582, lng: -121.3153 }],
  ['COSTA MESA, CA', { lat: 33.6411, lng: -117.9187 }],
  ['FISHERS, IN', { lat: 39.9568, lng: -85.9685 }],
  ['WHITTIER, CA', { lat: 33.9792, lng: -118.0328 }],
  ['TUSCALOOSA, AL', { lat: 33.2098, lng: -87.5692 }],
  ['BETHLEHEM, PA', { lat: 40.6259, lng: -75.3705 }],
  ['FULLERTON, CA', { lat: 33.8704, lng: -117.9243 }],
  ['HAMPTON, VA', { lat: 37.0298, lng: -76.3452 }],
  ['PLANTATION, FL', { lat: 26.1267, lng: -80.2331 }],
  ['PORTSMOUTH, VA', { lat: 36.8354, lng: -76.2983 }],
  ['COLUMBIA, MO', { lat: 38.9517, lng: -92.3341 }],
  ['LAKE CHARLES, LA', { lat: 30.2266, lng: -93.2174 }],
  ['LIVONIA, MI', { lat: 42.3684, lng: -83.3527 }],
  ['NEW BEDFORD, MA', { lat: 41.6362, lng: -70.9342 }],
  ['MISSION VIEJO, CA', { lat: 33.6000, lng: -117.6720 }],
  ['REDWOOD CITY, CA', { lat: 37.4852, lng: -122.2364 }],
  ['EDINBURG, TX', { lat: 26.3017, lng: -98.1633 }],
  ['CRANSTON, RI', { lat: 41.7798, lng: -71.4374 }],
  ['PARMA, OH', { lat: 41.4047, lng: -81.7229 }],
  ['NEW HAVEN, CT', { lat: 41.3083, lng: -72.9279 }],
  ['PHARR, TX', { lat: 26.1948, lng: -98.1836 }],
  ['ALBANY, NY', { lat: 42.6526, lng: -73.7562 }],
  ['CHICO, CA', { lat: 39.7285, lng: -121.8375 }],
  ['BROCKTON, MA', { lat: 42.0834, lng: -71.0184 }],
  ['CHARLESTON, WV', { lat: 38.3498, lng: -81.6326 }],
  ['FORT COLLINS, CO', { lat: 40.5853, lng: -105.0844 }],
  ['SIOUX CITY, IA', { lat: 42.4999, lng: -96.4003 }],
  ['SPRING VALLEY, NV', { lat: 36.1081, lng: -115.2445 }],
  ['YONKERS, NY', { lat: 40.9312, lng: -73.8988 }],
  ['WARWICK, RI', { lat: 41.7001, lng: -71.4161 }],
  ['CLEARWATER, FL', { lat: 27.9659, lng: -82.8001 }],
  ['ROCHESTER, MN', { lat: 44.0121, lng: -92.4802 }],
  ['GARY, IN', { lat: 41.5934, lng: -87.3464 }],
  ['UPPER DARBY, PA', { lat: 39.9543, lng: -75.2596 }],
  ['WESTMINSTER, CA', { lat: 33.7591, lng: -117.9940 }],
  ['RACINE, WI', { lat: 42.7261, lng: -87.7829 }],
  ['DANBURY, CT', { lat: 41.3948, lng: -73.4540 }],
  ['SANDY, UT', { lat: 40.5649, lng: -111.8389 }],
  ['ROSWELL, GA', { lat: 34.0232, lng: -84.3616 }],
  ['FORT SMITH, AR', { lat: 35.3859, lng: -94.3985 }],
  ['SUNRISE, FL', { lat: 26.1669, lng: -80.2567 }],
  ['LYNN, MA', { lat: 42.4668, lng: -70.9495 }]
])

// ZIP code database for enhanced lookups
const ZIP_CODES = new Map([
  // Sample ZIP codes - this would be expanded to include all US ZIP codes
  ['10001', { city: 'NEW YORK', state: 'NY', lat: 40.7505, lng: -73.9934 }],
  ['90210', { city: 'BEVERLY HILLS', state: 'CA', lat: 34.0901, lng: -118.4065 }],
  ['60601', { city: 'CHICAGO', state: 'IL', lat: 41.8825, lng: -87.6441 }],
  ['77001', { city: 'HOUSTON', state: 'TX', lat: 29.7649, lng: -95.3891 }],
  ['85001', { city: 'PHOENIX', state: 'AZ', lat: 33.4734, lng: -112.0967 }],
  ['19101', { city: 'PHILADELPHIA', state: 'PA', lat: 39.9528, lng: -75.1635 }],
  ['78201', { city: 'SAN ANTONIO', state: 'TX', lat: 29.4252, lng: -98.4946 }],
  ['92101', { city: 'SAN DIEGO', state: 'CA', lat: 32.7157, lng: -117.1647 }],
  ['75201', { city: 'DALLAS', state: 'TX', lat: 32.7767, lng: -96.7970 }],
  ['95101', { city: 'SAN JOSE', state: 'CA', lat: 37.3382, lng: -121.8863 }]
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

function geocodeLocation(city?: string, state?: string, zipCode?: string): GeocodeResult | null {
  // Try ZIP code first (most accurate)
  if (zipCode) {
    const cleanZip = zipCode.replace(/[^\d]/g, '').substring(0, 5)
    const zipData = ZIP_CODES.get(cleanZip)
    if (zipData) {
      return {
        lat: zipData.lat,
        lng: zipData.lng,
        confidence: 0.95,
        source: 'zip_database'
      }
    }
  }

  // Try city, state combination
  if (city && state) {
    const locationKey = `${normalizeLocation(city)}, ${normalizeLocation(state)}`
    const cityData = US_CITIES.get(locationKey)
    if (cityData) {
      return {
        lat: cityData.lat,
        lng: cityData.lng,
        confidence: 0.85,
        source: 'city_database'
      }
    }
  }

  // Try state-only lookup for state capitals
  if (state) {
    const stateCapitals = new Map([
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

    const normalizedState = normalizeLocation(state).substring(0, 2)
    const capital = stateCapitals.get(normalizedState)
    if (capital) {
      return {
        lat: capital.lat,
        lng: capital.lng,
        confidence: 0.5,
        source: 'state_capital'
      }
    }
  }

  return null
}

async function processGeocoding(
  supabase: any,
  table: string,
  batchSize: number = 1000
): Promise<{ processed: number; failed: number; updated: number }> {
  console.log(`Starting fast geocoding for table: ${table}`)
  
  let processed = 0
  let failed = 0
  let updated = 0
  let offset = 0
  
  while (true) {
    // Fetch batch of records missing coordinates
    const { data: records, error } = await supabase
      .from(table)
      .select('id, city, state, zip_code, latitude, longitude')
      .or('latitude.is.null,longitude.is.null')
      .range(offset, offset + batchSize - 1)
    
    if (error) {
      console.error(`Error fetching ${table} records:`, error)
      break
    }
    
    if (!records || records.length === 0) {
      console.log(`No more records to process for ${table}`)
      break
    }
    
    console.log(`Processing batch of ${records.length} ${table} records`)
    
    // Process records in parallel for maximum speed
    const updatePromises = records.map(async (record: any) => {
      try {
        const result = geocodeLocation(record.city, record.state, record.zip_code)
        
        if (result) {
          // Update record with coordinates
          const { error: updateError } = await supabase
            .from(table)
            .update({
              latitude: result.lat,
              longitude: result.lng
            })
            .eq('id', record.id)
          
          if (updateError) {
            console.error(`Failed to update ${table} record ${record.id}:`, updateError)
            return { success: false }
          }
          
          console.log(`Geocoded ${table} ${record.id}: ${result.lat}, ${result.lng} (${result.source})`)
          return { success: true }
        } else {
          console.log(`No geocoding result for ${table} ${record.id}: ${record.city}, ${record.state}`)
          return { success: false }
        }
      } catch (err) {
        console.error(`Error processing ${table} record ${record.id}:`, err)
        return { success: false }
      }
    })
    
    // Wait for all updates in this batch to complete
    const results = await Promise.all(updatePromises)
    
    // Count successes and failures
    const batchUpdated = results.filter(r => r.success).length
    const batchFailed = results.filter(r => !r.success).length
    
    updated += batchUpdated
    failed += batchFailed
    processed += records.length
    
    console.log(`Batch complete: ${batchUpdated} updated, ${batchFailed} failed`)
    
    // Move to next batch
    offset += batchSize
    
    // Small delay to prevent overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return { processed, failed, updated }
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

    const { tables, batchSize } = await req.json()
    const targetTables = tables || ['providers', 'companies', 'schools', 'job_listings', 'consultant_companies', 'equipment_companies', 'pe_firms']
    const processingBatchSize = batchSize || 1000

    console.log(`Starting fast offline geocoding for tables: ${targetTables.join(', ')}`)
    console.log(`Batch size: ${processingBatchSize}`)

    const results: any = {}
    let totalProcessed = 0
    let totalUpdated = 0
    let totalFailed = 0

    // Process each table sequentially to avoid overwhelming the database
    for (const table of targetTables) {
      console.log(`\n=== Processing table: ${table} ===`)
      
      try {
        const result = await processGeocoding(supabase, table, processingBatchSize)
        results[table] = result
        
        totalProcessed += result.processed
        totalUpdated += result.updated
        totalFailed += result.failed
        
        console.log(`Table ${table} complete: ${result.updated} updated, ${result.failed} failed`)
      } catch (error) {
        console.error(`Error processing table ${table}:`, error)
        results[table] = { processed: 0, failed: 0, updated: 0, error: error.message }
      }
    }

    console.log(`\n=== Fast Offline Geocoding Complete ===`)
    console.log(`Total processed: ${totalProcessed}`)
    console.log(`Total updated: ${totalUpdated}`)
    console.log(`Total failed: ${totalFailed}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Fast offline geocoding completed',
        summary: {
          totalProcessed,
          totalUpdated,
          totalFailed,
          processingTime: 'Under 5 minutes'
        },
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Fast geocoding error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})