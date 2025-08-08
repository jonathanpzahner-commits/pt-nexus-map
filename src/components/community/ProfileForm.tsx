import { useState, useEffect } from 'react';
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
import { Loader2, X, Plus } from 'lucide-react';

const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  current_employer: z.string().optional(),
  current_position: z.string().optional(),
  years_experience: z.number().min(0).optional(),
  about_me: z.string().optional(),
  is_public: z.boolean().default(true),
  available_for_collaboration: z.boolean().default(false),
  available_for_mentoring: z.boolean().default(false),
  preferred_contact_method: z.enum(['email', 'phone', 'linkedin']).default('email'),
});

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

const ProfileForm = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newInterest, setNewInterest] = useState('');

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
    }
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const profileData = {
        user_id: user.id,
        email: user.email,
        ...data,
        specializations,
        interests,
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
        description: "Your profile has been successfully updated.",
      });
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
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              {...form.register('first_name')}
              placeholder="Your first name"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              {...form.register('last_name')}
              placeholder="Your last name"
            />
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
                {specialization_options.map(spec => (
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
                {interest_options.map(interest => (
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
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="about_me">Tell others about yourself</Label>
          <Textarea
            id="about_me"
            {...form.register('about_me')}
            placeholder="Share your professional background, interests, and what makes you passionate about physical therapy..."
            className="min-h-[120px] mt-2"
          />
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
          className="bg-gradient-primary text-white"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;