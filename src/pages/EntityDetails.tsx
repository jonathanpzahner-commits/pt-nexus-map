import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Globe, Phone, Mail, Star, Building2, TrendingUp, Calendar } from 'lucide-react';
import { NotesSection } from '@/components/notes/NotesSection';

const EntityDetails = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  const { data: entity, isLoading } = useQuery({
    queryKey: [type, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type! as any)
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!type && !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Entity not found</h2>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const renderEntityDetails = () => {
    switch (type) {
      case 'providers':
        return (
          <div className="space-y-6">
            {/* Name and Basic Info */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold">
                    {(entity as any).first_name && (entity as any).last_name 
                      ? `${(entity as any).first_name} ${(entity as any).last_name}`
                      : (entity as any).name || "Unknown Name"}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {(entity as any).current_job_title || "Physical Therapist"}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {(entity as any).source && (
                    <Badge variant="outline">Source: {(entity as any).source}</Badge>
                  )}
                  <Badge variant="secondary">Provider</Badge>
                </div>
              </div>
              
              {/* Specializations */}
              {(entity as any).specializations?.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {(entity as any).specializations.map((spec: string) => (
                      <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No specializations listed</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base border-b pb-1">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="space-y-2">
                    {(entity as any).email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${(entity as any).email}`} className="text-primary hover:underline">
                          {(entity as any).email}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">No email available</span>
                      </div>
                    )}
                    
                    {(entity as any).phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${(entity as any).phone}`} className="hover:underline">
                          {(entity as any).phone}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">No phone available</span>
                      </div>
                    )}
                    
                    {(entity as any).website ? (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={(entity as any).website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Website
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">No website available</span>
                      </div>
                    )}
                    
                    {(entity as any).linkedin_url && (entity as any).linkedin_url !== 'N/A' ? (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={(entity as any).linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">No LinkedIn profile</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Address */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base border-b pb-1">Location</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      {(entity as any).city || (entity as any).state ? (
                        <>
                          <div className="font-medium">
                            {(entity as any).city ? (entity as any).city : "Unknown City"}
                            {(entity as any).state ? `, ${(entity as any).state}` : ""}
                          </div>
                          {(entity as any).zip_code && (
                            <div className="text-muted-foreground">{(entity as any).zip_code}</div>
                          )}
                        </>
                      ) : (
                        <div className="text-muted-foreground">No location data</div>
                      )}
                      
                      {(entity as any).latitude && (entity as any).longitude && (
                        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                          <div className="font-medium">Coordinates:</div>
                          <div>Lat: {parseFloat((entity as any).latitude).toFixed(6)}</div>
                          <div>Lng: {parseFloat((entity as any).longitude).toFixed(6)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base border-b pb-1">Professional Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">License:</span> 
                    {(entity as any).license_number ? (
                      <span> {(entity as any).license_number}
                        {(entity as any).license_state && (
                          <span className="text-muted-foreground"> ({(entity as any).license_state})</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground"> Not available</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="font-medium">Experience:</span> 
                    {(entity as any).years_experience ? (
                      <span> {(entity as any).years_experience} years</span>
                    ) : (
                      <span className="text-muted-foreground"> Not specified</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="font-medium">Current Employer:</span> 
                    {(entity as any).current_employer ? (
                      <span> {(entity as any).current_employer}</span>
                    ) : (
                      <span className="text-muted-foreground"> Not available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base border-b pb-1">Biography</h3>
              {(entity as any).bio && (entity as any).bio !== 'N/A' ? (
                <p className="text-sm leading-relaxed">{(entity as any).bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No biography available</p>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base border-b pb-1">Additional Information</h3>
              {(entity as any).additional_info && (entity as any).additional_info !== 'N/A' ? (
                <p className="text-sm leading-relaxed">{(entity as any).additional_info}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No additional information available</p>
              )}
            </div>

            {/* Data Source & Technical Info */}
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold text-base">Data Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div><span className="font-medium">Provider ID:</span> <code className="bg-muted px-1 py-0.5 rounded">{(entity as any).id}</code></div>
                  <div><span className="font-medium">Data Source:</span> {(entity as any).source || "Unknown"}</div>
                </div>
                <div className="space-y-1">
                  <div><span className="font-medium">Added:</span> {new Date((entity as any).created_at).toLocaleDateString()}</div>
                  <div><span className="font-medium">Updated:</span> {new Date((entity as any).updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Data Completeness Warning */}
            {(!((entity as any).email) && !((entity as any).license_number) && !((entity as any).bio)) && (
              <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Limited Data Available</h4>
                <p className="text-sm text-yellow-700">
                  This provider record has limited information available. The data source "{(entity as any).source || "Unknown"}" 
                  may not include comprehensive professional details. Consider updating this record with additional information if available.
                </p>
              </div>
            )}
          </div>
        );
        
      case 'companies':
        return (
          <div className="space-y-6">
            {/* Key Company Facts - Hero Section */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(entity as any).founded_year && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{(entity as any).founded_year}</div>
                    <div className="text-sm text-muted-foreground">Founded</div>
                  </div>
                )}
                {(entity as any).number_of_clinics && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{(entity as any).number_of_clinics}</div>
                    <div className="text-sm text-muted-foreground">Total Clinics</div>
                  </div>
                )}
                {(entity as any).company_size_range && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{(entity as any).company_size_range}</div>
                    <div className="text-sm text-muted-foreground">Employees</div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{(entity as any).company_type}</Badge>
              {(entity as any).pe_backed && (
                <Badge variant="destructive">PE Backed</Badge>
              )}
              {(entity as any).parent_company && (
                <Badge variant="secondary">Subsidiary</Badge>
              )}
              {(entity as any).glassdoor_rating && (
                <Badge variant="outline">⭐ {(entity as any).glassdoor_rating}/5 Glassdoor</Badge>
              )}
            </div>
            
            {/* Leadership & Ownership */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Leadership Team */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Leadership Team</h3>
                {(entity as any).leadership && Object.keys((entity as any).leadership).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries((entity as any).leadership).map(([key, value]) => {
                      if (!value) return null;
                      const leadershipLabels = {
                        owner_ceo: 'Owner/CEO',
                        current_ceo: 'Current CEO',
                        founder: 'Founder',
                        president: 'President',
                        cfo: 'CFO',
                        operations: 'Head of Operations',
                        clinical_excellence: 'Clinical Director',
                        clinical_director: 'Clinical Director',
                        technology: 'CTO',
                        hr_recruitment: 'Head of HR',
                        sales_marketing: 'Head of Sales/Marketing',
                        facilities: 'Facilities Director',
                        current_leadership: 'Current Leadership',
                        acquisition_date: 'Acquired',
                        acquisition_details: 'Acquisition Details'
                      };
                      
                      if (key === 'acquisition_date' || key === 'acquisition_details') {
                        return null; // Handle these separately in the ownership section
                      }
                      
                      return (
                        <div key={key} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <div className="text-sm">
                            <span className="font-medium text-primary">{leadershipLabels[key as keyof typeof leadershipLabels] || key}:</span>
                            <div className="text-foreground">{String(value)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Leadership information not available</p>
                )}
              </div>

              {/* Ownership & Corporate Structure */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Ownership & Structure</h3>
                <div className="space-y-3">
                  {(entity as any).parent_company ? (
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="font-medium">Parent Company</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">{(entity as any).parent_company}</p>
                      
                      {/* Show acquisition details if available */}
                      {(entity as any).leadership?.acquisition_date && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div>Acquired: {new Date((entity as any).leadership.acquisition_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
                          {(entity as any).leadership?.acquisition_details && (
                            <div className="mt-1">{(entity as any).leadership.acquisition_details}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Independent company</div>
                  )}
                  
                  {(entity as any).pe_backed && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Private Equity Backed</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        {(entity as any).pe_firm_name && (
                          <p><span className="font-medium">PE Firm:</span> {(entity as any).pe_firm_name}</p>
                        )}
                        {(entity as any).pe_relationship_start_date && (
                          <p><span className="font-medium">Relationship Started:</span> {new Date((entity as any).pe_relationship_start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Company Description */}
            {(entity as any).description && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Company Overview</h3>
                <p className="text-sm leading-relaxed">{(entity as any).description}</p>
              </div>
            )}
            
            {/* Services Offered */}
            {(entity as any).services?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {(entity as any).services.map((service: string) => (
                    <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Geographic Presence & Locations */}
            {(entity as any).company_locations?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Geographic Presence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(entity as any).company_locations.map((location: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{location}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <MapPin className="h-4 w-4 mr-2" />
                    View All Locations on Map
                  </Button>
                </div>
              </div>
            )}

            {/* Employee Reviews */}
            {((entity as any).glassdoor_rating || (entity as any).glassdoor_url) && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Employee Reviews</h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(entity as any).glassdoor_rating && (
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-semibold">{(entity as any).glassdoor_rating}/5</span>
                          <span className="text-sm text-muted-foreground">on Glassdoor</span>
                        </div>
                      )}
                    </div>
                    {(entity as any).glassdoor_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={(entity as any).glassdoor_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Reviews
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Facts */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">Quick Facts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {(entity as any).founded_year && (
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="font-medium text-muted-foreground">Founded</div>
                    <div className="text-lg font-bold">{(entity as any).founded_year}</div>
                  </div>
                )}
                {(entity as any).number_of_clinics && (
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="font-medium text-muted-foreground">Clinics</div>
                    <div className="text-lg font-bold">{(entity as any).number_of_clinics}</div>
                  </div>
                )}
                {(entity as any).company_size_range && (
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="font-medium text-muted-foreground">Employees</div>
                    <div className="text-lg font-bold">{(entity as any).company_size_range}</div>
                  </div>
                )}
                {(entity as any).city && (entity as any).state && (
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <div className="font-medium text-muted-foreground">Headquarters</div>
                    <div className="text-sm font-bold">{(entity as any).city}, {(entity as any).state}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'schools':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {(entity as any).accreditation && (
                <Badge variant="secondary">{(entity as any).accreditation}</Badge>
              )}
              {(entity as any).dce_info && (
                <Badge variant="outline">DCE: {(entity as any).dce_info}</Badge>
              )}
              {(entity as any).faculty_count && (
                <Badge variant="outline">{(entity as any).faculty_count} faculty</Badge>
              )}
              {(entity as any).average_class_size && (
                <Badge variant="outline">Class size: {(entity as any).average_class_size}</Badge>
              )}
            </div>
            {(entity as any).dce_info && (
              <div className="mt-2">
                <div className="font-medium text-sm">Director of Clinical Education (DCE)</div>
                <p className="text-sm text-muted-foreground">{(entity as any).dce_info}</p>
              </div>
            )}
            
            {/* Academic Calendar & Important Dates */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Academic Calendar & Key Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(entity as any).graduation_season && (
                  <div className="text-center p-3 bg-background/50 rounded">
                    <div className="font-medium text-muted-foreground text-sm">Graduation Season</div>
                    <div className="text-lg font-bold text-primary">{(entity as any).graduation_season}</div>
                  </div>
                )}
                {(entity as any).boards_timing && (
                  <div className="text-center p-3 bg-background/50 rounded">
                    <div className="font-medium text-muted-foreground text-sm">Board Exam Schedule</div>
                    <div className="text-lg font-bold text-primary">{(entity as any).boards_timing}</div>
                  </div>
                )}
              </div>
              
              {(entity as any).career_fair_dates?.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium text-sm mb-2">Career Fair Dates</div>
                  <div className="flex flex-wrap gap-2">
                    {(entity as any).career_fair_dates.map((date: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {date}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Program Information</h3>
                <div className="space-y-3 text-sm">
                  {(entity as any).program_length_months && (
                    <div className="flex justify-between">
                      <span className="font-medium">Program Duration:</span> 
                      <span>{(entity as any).program_length_months} months</span>
                    </div>
                  )}
                  {(entity as any).tuition_per_year && (
                    <div className="flex justify-between">
                      <span className="font-medium">Annual Tuition:</span> 
                      <span>${(entity as any).tuition_per_year.toLocaleString()}</span>
                    </div>
                  )}
                  {(entity as any).average_class_size && (
                    <div className="flex justify-between">
                      <span className="font-medium">Average Class Size:</span> 
                      <span>{(entity as any).average_class_size} students</span>
                    </div>
                  )}
                  {(entity as any).faculty_count && (
                    <div className="flex justify-between">
                      <span className="font-medium">Faculty Members:</span> 
                      <span>{(entity as any).faculty_count}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Location</h3>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{(entity as any).city}, {(entity as any).state}</span>
                </div>
                
              </div>
            </div>
            
            {(entity as any).description && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">About the Program</h3>
                <p className="text-sm leading-relaxed">{(entity as any).description}</p>
              </div>
            )}
            
            {(entity as any).programs_offered?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Programs Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {(entity as any).programs_offered.map((program: string) => (
                    <Badge key={program} variant="secondary">{program}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {(entity as any).specializations?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Areas of Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {(entity as any).specializations.map((spec: string) => (
                    <Badge key={spec} variant="outline">{spec}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'job_listings':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{(entity as any).employment_type}</Badge>
              {(entity as any).experience_level && (
                <Badge variant="outline">{(entity as any).experience_level}</Badge>
              )}
              {(entity as any).is_remote && (
                <Badge variant="secondary">Remote</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Compensation</h3>
                <div className="text-sm">
                  {(entity as any).salary_min && (entity as any).salary_max ? (
                    <p>${(entity as any).salary_min.toLocaleString()} - ${(entity as any).salary_max.toLocaleString()}</p>
                  ) : (entity as any).salary_min ? (
                    <p>${(entity as any).salary_min.toLocaleString()}+</p>
                  ) : (
                    <p>Not specified</p>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{(entity as any).city}, {(entity as any).state}</span>
                </div>
              </div>
            </div>
            
            {(entity as any).description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm whitespace-pre-line">{(entity as any).description}</p>
              </div>
            )}
            
            {(entity as any).requirements && (
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p className="text-sm whitespace-pre-line">{(entity as any).requirements}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return <p>Unknown entity type</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Map
          </Button>
          <h1 className="text-2xl font-bold">
            {(entity as any).name || (entity as any).title}
          </h1>
        </div>
      </header>
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                {renderEntityDetails()}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <NotesSection 
              entityId={id!} 
              entityType={type! as "company" | "school" | "job_listing" | "provider"}
              entityName={(entity as any).name || (entity as any).title}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDetails;