import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, X, Plus, Camera, Upload, User, Shield, Eye, EyeOff } from 'lucide-react';

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  location: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  current_employer: z.string().optional(),
  current_position: z.string().optional(),
  years_experience: z.number().min(0).optional(),
  about_me: z.string().min(10, "Please write at least 10 characters about yourself"),
  is_public: z.boolean().default(true),
  available_for_collaboration: z.boolean().default(false),
  available_for_mentoring: z.boolean().default(false),
  preferred_contact_method: z.enum(['email', 'phone', 'linkedin']).default('email'),
});

type PrivacySettings = {
  contact_info: boolean;
  location: boolean;
  professional_info: boolean;
  online_presence: boolean;
  specializations: boolean;
  interests: boolean;
  profile_photo: boolean;
};

type ProfileFormData = z.infer<typeof profileSchema>;

const specialization_options = [
  'Orthopedic Physical Therapy',
  'Neurological Physical Therapy',
  'Cardiovascular & Pulmonary',
  'Sports Physical Therapy',
  'Pediatric Physical Therapy',
  'Geriatric Physical Therapy',
  'Women\'s Health',
  'Hand Therapy',
  'Aquatic Physical Therapy',
  'Wound Care',
  'Pain Management',
  'Manual Therapy',
  'Vestibular Rehabilitation',
  'Oncology Rehabilitation'
];

const interest_options = [
  'Research & Publications',
  'Teaching & Education',
  'Technology & Innovation',
  'Practice Management',
  'Professional Development',
  'Community Outreach',
  'Mentoring',
  'Clinical Excellence',
  'Healthcare Policy'
];

const site_purpose_options = [
  {
    value: 'networking',
    label: 'Professional Networking',
    description: 'Connect with other PT professionals and expand your network'
  },
  {
    value: 'research',
    label: 'Research Collaboration',
    description: 'Find collaborators and participate in research projects'
  },
  {
    value: 'mentoring',
    label: 'Mentoring & Being Mentored',
    description: 'Give or receive guidance in your professional journey'
  },
  {
    value: 'job_seeking',
    label: 'Job Opportunities',
    description: 'Discover new career opportunities and positions'
  },
  {
    value: 'business_development',
    label: 'Business Development',
    description: 'Grow your practice or explore business opportunities'
  },
  {
    value: 'continuing_education',
    label: 'Continuing Education',
    description: 'Learn about courses, certifications, and professional development'
  },
  {
    value: 'industry_insights',
    label: 'Industry Insights',
    description: 'Stay updated on PT industry trends and best practices'
  },
  {
    value: 'equipment_sourcing',
    label: 'Equipment & Suppliers',
    description: 'Find equipment suppliers and compare products'
  }
];

interface EnhancedProfileFormProps {
  onComplete?: () => void;
}

const EnhancedProfileForm = ({ onComplete }: EnhancedProfileFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [sitePurposes, setSitePurposes] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    contact_info: true,
    location: true,
    professional_info: true,
    online_presence: true,
    specializations: true,
    interests: true,
    profile_photo: true,
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      about_me: '',
      is_public: true,
      available_for_collaboration: false,
      available_for_mentoring: false,
      preferred_contact_method: 'email',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        location: profile.location || '',
        city: profile.city || '',
        state: profile.state || '',
        phone: profile.phone || '',
        linkedin_url: profile.linkedin_url || '',
        website: profile.website || '',
        current_employer: profile.current_employer || '',
        current_position: profile.current_position || '',
        years_experience: profile.years_experience || 0,
        about_me: profile.about_me || '',
        is_public: profile.is_public ?? true,
        available_for_collaboration: profile.available_for_collaboration ?? false,
        available_for_mentoring: profile.available_for_mentoring ?? false,
        preferred_contact_method: (profile.preferred_contact_method as 'email' | 'phone' | 'linkedin') || 'email',
      });
      setSpecializations(profile.specializations || []);
      setInterests(profile.interests || []);
      setSitePurposes(profile.site_purposes || []);
      setProfilePhoto(profile.profile_photo_url || null);
      setPrivacySettings((profile.privacy_settings as PrivacySettings) || {
        contact_info: true,
        location: true,
        professional_info: true,
        online_presence: true,
        specializations: true,
        interests: true,
        profile_photo: true,
      });
    }
  }, [profile, form]);

  const handlePhotoUpload = async (file: File) => {
    if (!user?.id) return;

    setIsUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setProfilePhoto(data.publicUrl);
      
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const profileData = {
        user_id: user.id,
        email: user.email,
        ...data,
        specializations,
        interests,
        site_purposes: sitePurposes,
        profile_photo_url: profilePhoto,
        privacy_settings: privacySettings,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "Profile Updated",
        description: "Your professional profile has been successfully updated.",
      });
      onComplete?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  const addSpecialization = () => {
    if (newSpecialization && !specializations.includes(newSpecialization)) {
      setSpecializations([...specializations, newSpecialization]);
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setSpecializations(specializations.filter(s => s !== spec));
  };

  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const toggleSitePurpose = (purpose: string) => {
    setSitePurposes(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const getInitials = () => {
    const firstName = form.watch('first_name') || user?.email?.charAt(0) || '';
    const lastName = form.watch('last_name') || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePhoto || undefined} />
              <AvatarFallback className="text-lg">
                {profilePhoto ? <User className="h-8 w-8" /> : getInitials()}
              </AvatarFallback>
            </Avatar>
            {isUploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
            <p className="text-sm text-muted-foreground">
              Upload a professional photo to help others recognize you
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* What brings you here? */}
      <Card>
        <CardHeader>
          <CardTitle>What brings you to our platform?</CardTitle>
          <p className="text-muted-foreground">
            Select all purposes that apply to help us personalize your experience
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {site_purpose_options.map((purpose) => (
            <div
              key={purpose.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                sitePurposes.includes(purpose.value)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleSitePurpose(purpose.value)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={sitePurposes.includes(purpose.value)}
                  onChange={() => {}} // Controlled by parent click
                />
                <div className="space-y-1">
                  <h4 className="font-medium">{purpose.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {purpose.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...form.register('first_name')}
              placeholder="Your first name"
            />
            {form.formState.errors.first_name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...form.register('last_name')}
              placeholder="Your last name"
            />
            {form.formState.errors.last_name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.last_name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="Your phone number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_employer">Current Employer</Label>
              <Input
                id="current_employer"
                {...form.register('current_employer')}
                placeholder="Organization or clinic name"
              />
            </div>
            <div>
              <Label htmlFor="current_position">Current Position</Label>
              <Input
                id="current_position"
                {...form.register('current_position')}
                placeholder="Your job title"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                {...form.register('years_experience', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="preferred_contact_method">Preferred Contact Method</Label>
              <Select 
                value={form.watch('preferred_contact_method')} 
                onValueChange={(value: 'email' | 'phone' | 'linkedin') => 
                  form.setValue('preferred_contact_method', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...form.register('city')}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...form.register('state')}
              placeholder="State"
            />
          </div>
          <div>
            <Label htmlFor="location">Location Description</Label>
            <Input
              id="location"
              {...form.register('location')}
              placeholder="e.g., Greater Boston Area"
            />
          </div>
        </CardContent>
      </Card>

      {/* Online Presence */}
      <Card>
        <CardHeader>
          <CardTitle>Online Presence</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              {...form.register('linkedin_url')}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              {...form.register('website')}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newSpecialization} onValueChange={setNewSpecialization}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a specialization" />
              </SelectTrigger>
              <SelectContent>
                {specialization_options
                  .filter(spec => !specializations.includes(spec))
                  .map(spec => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addSpecialization} disabled={!newSpecialization}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {specializations.map(spec => (
              <Badge key={spec} variant="secondary" className="gap-1">
                {spec}
                <button
                  type="button"
                  onClick={() => removeSpecialization(spec)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newInterest} onValueChange={setNewInterest}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select an interest" />
              </SelectTrigger>
              <SelectContent>
                {interest_options
                  .filter(interest => !interests.includes(interest))
                  .map(interest => (
                  <SelectItem key={interest} value={interest}>
                    {interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addInterest} disabled={!newInterest}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map(interest => (
              <Badge key={interest} variant="outline" className="gap-1">
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About Me */}
      <Card>
        <CardHeader>
          <CardTitle>About Me *</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="about_me">Tell others about yourself</Label>
          <Textarea
            id="about_me"
            {...form.register('about_me')}
            placeholder="Share your professional background, interests, and what makes you passionate about physical therapy..."
            className="min-h-[120px] mt-2"
          />
          {form.formState.errors.about_me && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.about_me.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <p className="text-muted-foreground">
            Control what information is visible to other community members
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Profile Photo</div>
                <div className="text-xs text-muted-foreground">Your profile picture</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrivacySettings(prev => ({ ...prev, profile_photo: !prev.profile_photo }))}
                className="gap-2"
              >
                {privacySettings.profile_photo ? (
                  <><Eye className="h-4 w-4" />Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" />Hidden</>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Contact Information</div>
                <div className="text-xs text-muted-foreground">Email and phone number</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrivacySettings(prev => ({ ...prev, contact_info: !prev.contact_info }))}
                className="gap-2"
              >
                {privacySettings.contact_info ? (
                  <><Eye className="h-4 w-4" />Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" />Hidden</>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Location</div>
                <div className="text-xs text-muted-foreground">City, state, and location details</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrivacySettings(prev => ({ ...prev, location: !prev.location }))}
                className="gap-2"
              >
                {privacySettings.location ? (
                  <><Eye className="h-4 w-4" />Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" />Hidden</>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Professional Information</div>
                <div className="text-xs text-muted-foreground">Current employer, position, experience</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrivacySettings(prev => ({ ...prev, professional_info: !prev.professional_info }))}
                className="gap-2"
              >
                {privacySettings.professional_info ? (
                  <><Eye className="h-4 w-4" />Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" />Hidden</>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Online Presence</div>
                <div className="text-xs text-muted-foreground">LinkedIn and website links</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrivacySettings(prev => ({ ...prev, online_presence: !prev.online_presence }))}
                className="gap-2"
              >
                {privacySettings.online_presence ? (
                  <><Eye className="h-4 w-4" />Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" />Hidden</>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Specializations</div>
                <div className="text-xs text-muted-foreground">Your PT specializations</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrivacySettings(prev => ({ ...prev, specializations: !prev.specializations }))}
                className="gap-2"
              >
                {privacySettings.specializations ? (
                  <><Eye className="h-4 w-4" />Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" />Hidden</>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Professional Interests</div>
                <div className="text-xs text-muted-foreground">Your professional interests and focus areas</div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPrivacySettings(prev => ({ ...prev, interests: !prev.interests }))}
                className="gap-2"
              >
                {privacySettings.interests ? (
                  <><Eye className="h-4 w-4" />Visible</>
                ) : (
                  <><EyeOff className="h-4 w-4" />Hidden</>
                )}
              </Button>
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> These settings control the visibility of specific information sections. 
              Your profile must be set to "public" below for any information to be visible to other members.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Collaboration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Collaboration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_public"
              checked={form.watch('is_public')}
              onCheckedChange={(checked) => form.setValue('is_public', checked as boolean)}
            />
            <Label htmlFor="is_public" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Make my profile public (visible to other community members)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="available_for_collaboration"
              checked={form.watch('available_for_collaboration')}
              onCheckedChange={(checked) => form.setValue('available_for_collaboration', checked as boolean)}
            />
            <Label htmlFor="available_for_collaboration" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Available for research collaboration
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="available_for_mentoring"
              checked={form.watch('available_for_mentoring')}
              onCheckedChange={(checked) => form.setValue('available_for_mentoring', checked as boolean)}
            />
            <Label htmlFor="available_for_mentoring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Available to mentor other professionals
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="min-w-[160px]"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Profile...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedProfileForm;