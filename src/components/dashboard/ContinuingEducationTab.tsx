import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { getAdsForPage } from '@/data/sponsoredAds';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  TrendingUp, 
  Clock,
  DollarSign,
  MapPin,
  Star,
  CheckCircle
} from 'lucide-react';

export const ContinuingEducationTab = () => {
  const courseCategories = [
    { name: "Manual Therapy", count: 47, color: "bg-blue-500" },
    { name: "Orthopedic", count: 34, color: "bg-green-500" },
    { name: "Neurological", count: 28, color: "bg-purple-500" },
    { name: "Sports Medicine", count: 22, color: "bg-orange-500" },
    { name: "Geriatrics", count: 19, color: "bg-red-500" },
    { name: "Pediatrics", count: 15, color: "bg-pink-500" }
  ];

  const providers = [
    {
      name: "Summit Professional Education",
      specialties: ["Manual Therapy", "Orthopedic", "Sports Medicine"],
      rating: 4.9,
      courses: 24,
      students: 1247,
      nextCourse: "Advanced Manual Therapy Techniques",
      date: "Mar 15, 2024",
      location: "Online + Hands-on Lab"
    },
    {
      name: "Institute of Physical Art",
      specialties: ["Manual Therapy", "Neurological"],
      rating: 4.8,
      courses: 18,
      students: 892,
      nextCourse: "Myofascial Release Certification",
      date: "Mar 22, 2024",
      location: "Chicago, IL"
    },
    {
      name: "Orthopedic Manual Therapy Institute",
      specialties: ["Orthopedic", "Manual Therapy"],
      rating: 4.7,
      courses: 15,
      students: 634,
      nextCourse: "Spinal Manipulation Techniques",
      date: "Apr 5, 2024",
      location: "Online"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sponsored Ads */}
      <SponsoredBanner ads={getAdsForPage('education')} position="top" />
      
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Continuing Education Hub</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform Status</p>
                <p className="text-2xl font-bold text-foreground">Beta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Launch Target</p>
                <p className="text-2xl font-bold text-foreground">Q2 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Award className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accredited</p>
                <p className="text-2xl font-bold text-foreground">Yes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-foreground">12+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Categories
          </CardTitle>
          <CardDescription>
            Popular continuing education specialties and available courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {courseCategories.map((category) => (
              <div key={category.name} className="p-4 bg-secondary/30 rounded-lg text-center">
                <div className={`w-8 h-8 ${category.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <p className="font-medium text-sm text-foreground">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count} courses</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Featured Education Providers
          </CardTitle>
          <CardDescription>
            Leading continuing education organizations in physical therapy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.name} className="p-6 border border-border rounded-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{provider.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{provider.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {provider.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {provider.courses} courses
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {provider.students.toLocaleString()} students
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Verified Provider
                      </div>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <div className="p-4 bg-secondary/30 rounded-lg mb-3">
                      <p className="text-sm font-medium text-foreground">{provider.nextCourse}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {provider.date}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {provider.location}
                      </div>
                    </div>
                    <Button size="sm" className="w-full lg:w-auto">
                      View Courses
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage continuing education partnerships and enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Users className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Register Students</p>
                <p className="text-xs text-muted-foreground">Bulk enrollment tools</p>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Award className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Track Certifications</p>
                <p className="text-xs text-muted-foreground">Monitor progress</p>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <BookOpen className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Add New Course</p>
                <p className="text-xs text-muted-foreground">Expand catalog</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};