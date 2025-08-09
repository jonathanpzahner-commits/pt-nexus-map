import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Globe, Phone, Mail } from 'lucide-react';
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
          <Button onClick={() => navigate(-1)}>Go Back</Button>
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
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{(entity as any).company_type}</Badge>
              {(entity as any).employee_count && (
                <Badge variant="secondary">{(entity as any).employee_count} employees</Badge>
              )}
              {(entity as any).founded_year && (
                <Badge variant="secondary">Founded {(entity as any).founded_year}</Badge>
              )}
            </div>
            
            {(entity as any).description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm">{(entity as any).description}</p>
              </div>
            )}
            
            {(entity as any).services?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {(entity as any).services.map((service: string) => (
                    <Badge key={service} variant="secondary">{service}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {(entity as any).company_locations?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Locations</h3>
                <div className="space-y-1">
                  {(entity as any).company_locations.map((location: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'schools':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {(entity as any).accreditation && (
                <Badge variant="secondary">{(entity as any).accreditation}</Badge>
              )}
              {(entity as any).faculty_count && (
                <Badge variant="outline">{(entity as any).faculty_count} faculty</Badge>
              )}
              {(entity as any).average_class_size && (
                <Badge variant="outline">Class size: {(entity as any).average_class_size}</Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Program Information</h3>
                <div className="space-y-2 text-sm">
                  {(entity as any).program_length_months && (
                    <p><span className="font-medium">Duration:</span> {(entity as any).program_length_months} months</p>
                  )}
                  {(entity as any).tuition_per_year && (
                    <p><span className="font-medium">Tuition:</span> ${(entity as any).tuition_per_year.toLocaleString()}/year</p>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{(entity as any).city}, {(entity as any).state}</span>
                </div>
              </div>
            </div>
            
            {(entity as any).description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm">{(entity as any).description}</p>
              </div>
            )}
            
            {(entity as any).programs_offered?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Programs Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {(entity as any).programs_offered.map((program: string) => (
                    <Badge key={program} variant="secondary">{program}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {(entity as any).specializations?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Specializations</h3>
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
          <Button variant="ghost" onClick={() => navigate(-1)}>
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