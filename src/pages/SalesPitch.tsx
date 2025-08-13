import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Users, Briefcase, GraduationCap, DollarSign } from "lucide-react";

export default function SalesPitch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Honey, Let Me Explain Our Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Think of it like creating the Yellow Pages for physical therapy - but way better and actually useful in 2024
          </p>
        </div>

        {/* The Problem */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>😤</span> The Problem (Why People Are Frustrated)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• When someone gets hurt, finding a good physical therapist is like finding a needle in a haystack</p>
            <p>• Insurance companies can't easily find providers in specific areas</p>
            <p>• PT students don't know where to apply for jobs or internships</p>
            <p>• Nobody has organized all this information in one place</p>
          </CardContent>
        </Card>

        {/* Our Solution */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💡</span> Our Solution (What We Built)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium">We created a comprehensive database that organizes everything about physical therapy:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <span>Physical Therapists & Their Specialties</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-primary" />
                <span>Clinics & Healthcare Companies</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span>PT Schools & Programs</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <span>Job Opportunities Everywhere</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who Pays Us */}
        <Card className="border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              Who Pays Us Money
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• <strong>Insurance Companies:</strong> Pay us to find providers in specific areas (they need this constantly)</p>
            <p>• <strong>Healthcare Companies:</strong> Pay to post job listings and find qualified therapists</p>
            <p>• <strong>PT Schools:</strong> Pay to showcase their programs and connect with students</p>
            <p>• <strong>Government Agencies:</strong> Pay for data about healthcare coverage in different regions</p>
          </CardContent>
        </Card>

        {/* Why It's Smart */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🧠</span> Why This Is Actually Brilliant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>• <strong>Growing Market:</strong> People are getting older and need more physical therapy</p>
            <p>• <strong>Essential Service:</strong> This information will always be needed</p>
            <p>• <strong>Hard to Copy:</strong> We're building the most complete database - that takes years</p>
            <p>• <strong>Multiple Revenue Streams:</strong> Different types of customers all pay for different things</p>
            <p>• <strong>Scalable:</strong> Once built, we can expand to other healthcare fields</p>
          </CardContent>
        </Card>

        {/* The Bottom Line */}
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="text-center text-2xl">The Bottom Line</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">
              We're building the infrastructure that connects everyone in physical therapy.
            </p>
            <p className="text-muted-foreground">
              Think Amazon for PT services, LinkedIn for PT professionals, and Google Maps for finding care - all rolled into one.
            </p>
            <div className="pt-4">
              <Button size="lg" className="text-lg px-8">
                This Makes Sense, Right? 💝
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center pt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}