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
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {(entity as any).specializations?.map((spec: string) => (
                <Badge key={spec} variant="secondary">{spec}</Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  {(entity as any).email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{(entity as any).email}</span>
                    </div>
                  )}
                  {(entity as any).phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{(entity as any).phone}</span>
                    </div>
                  )}
                  {(entity as any).website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a href={(entity as any).website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{(entity as any).city}, {(entity as any).state} {(entity as any).zip_code}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Professional Details</h3>
                <div className="space-y-2 text-sm">
                  {(entity as any).license_number && (
                    <p><span className="font-medium">License:</span> {(entity as any).license_number} ({(entity as any).license_state})</p>
                  )}
                  {(entity as any).years_experience && (
                    <p><span className="font-medium">Experience:</span> {(entity as any).years_experience} years</p>
                  )}
                  {(entity as any).current_employer && (
                    <p><span className="font-medium">Employer:</span> {(entity as any).current_employer}</p>
                  )}
                  {(entity as any).current_job_title && (
                    <p><span className="font-medium">Title:</span> {(entity as any).current_job_title}</p>
                  )}
                </div>
              </div>
            </div>
            
            {(entity as any).bio && (
              <div>
                <h3 className="font-semibold mb-2">Biography</h3>
                <p className="text-sm">{(entity as any).bio}</p>
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