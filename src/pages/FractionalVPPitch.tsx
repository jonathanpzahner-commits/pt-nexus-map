import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Users, TrendingUp, Clock, DollarSign, Award, Target, CheckCircle, Mail, Phone, Linkedin } from 'lucide-react';

const FractionalVPPitch = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Fractional VP Talent Solutions",
      subtitle: "Executive Leadership Without the Full-Time Commitment",
      content: (
        <div className="text-center space-y-8">
          <div className="text-6xl mb-8">🎯</div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get VP-level expertise when you need it, how you need it. 
            Strategic leadership for growing companies without the executive salary.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <span>• Strategic Planning</span>
            <span>• Team Leadership</span>
            <span>• Business Development</span>
            <span>• Operational Excellence</span>
          </div>
        </div>
      )
    },
    {
      title: "The Executive Leadership Gap",
      subtitle: "Growing companies face a critical challenge",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <DollarSign className="w-8 h-8 text-destructive mt-1" />
              <div>
                <h3 className="font-semibold mb-2">High Cost of Full-Time VPs</h3>
                <p className="text-muted-foreground">VP salaries range $150K-$300K+ plus benefits, equity, and overhead</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Clock className="w-8 h-8 text-destructive mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Inconsistent Need</h3>
                <p className="text-muted-foreground">Strategic work comes in waves - not always requiring full-time dedication</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="w-8 h-8 text-destructive mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Talent Scarcity</h3>
                <p className="text-muted-foreground">Finding the right VP with industry experience is challenging and time-consuming</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-center">The Result:</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-destructive" />
                <span>Strategic initiatives stall</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-destructive" />
                <span>Teams lack executive guidance</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-destructive" />
                <span>Growth opportunities missed</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-destructive" />
                <span>CEO becomes overwhelmed</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "The Fractional VP Solution",
      subtitle: "Strategic leadership precisely when you need it",
      content: (
        <div className="text-center space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Strategic Focus</h3>
                <p className="text-sm text-muted-foreground">
                  VP-level strategic thinking and execution without the overhead
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Flexible Engagement</h3>
                <p className="text-sm text-muted-foreground">
                  Scale involvement up or down based on business needs
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Cost Effective</h3>
                <p className="text-sm text-muted-foreground">
                  Pay for results, not full-time presence
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Immediate Impact</h3>
            <p className="text-muted-foreground">
              Start contributing to your strategic initiatives from day one with proven frameworks and methodologies
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Service Offerings",
      subtitle: "Comprehensive VP-level expertise across key areas",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">Strategic Planning & Execution</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Business strategy development</li>
                <li>• Market analysis and positioning</li>
                <li>• Strategic initiative management</li>
                <li>• Performance metrics and KPIs</li>
              </ul>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">Team Leadership & Development</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Leadership coaching and mentoring</li>
                <li>• Team structure optimization</li>
                <li>• Talent acquisition strategy</li>
                <li>• Performance management systems</li>
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-secondary pl-4">
              <h3 className="font-semibold mb-2">Business Development</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Partnership strategy</li>
                <li>• Market expansion planning</li>
                <li>• Revenue optimization</li>
                <li>• Client relationship management</li>
              </ul>
            </div>
            <div className="border-l-4 border-secondary pl-4">
              <h3 className="font-semibold mb-2">Operational Excellence</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Process improvement</li>
                <li>• Technology integration</li>
                <li>• Quality management</li>
                <li>• Scalability planning</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Why Choose Fractional VP Services?",
      subtitle: "The strategic advantages for your business",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Financial Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">60-70% cost savings vs full-time VP</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">No benefits, equity, or overhead costs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">Flexible budget allocation</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Strategic Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">Immediate access to senior expertise</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">Fresh perspective from diverse industries</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">Scalable engagement model</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">60%</div>
                <div className="text-sm text-muted-foreground">Average cost savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">30 days</div>
                <div className="text-sm text-muted-foreground">Time to full productivity</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Focus on your success</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Engagement Models",
      subtitle: "Flexible options to fit your business needs",
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="text-center mb-4">
                <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">Project-Based</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Ideal for specific initiatives</p>
                <ul className="space-y-1">
                  <li>• Strategic planning sessions</li>
                  <li>• Market entry strategies</li>
                  <li>• Process optimization</li>
                  <li>• Team restructuring</li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="font-semibold">Duration: 2-6 months</p>
                  <p className="text-primary">Fixed project fee</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-6 border-primary">
            <CardContent className="p-0">
              <div className="text-center mb-4">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">Ongoing Partnership</h3>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">MOST POPULAR</span>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Continuous strategic support</p>
                <ul className="space-y-1">
                  <li>• Monthly strategic reviews</li>
                  <li>• Quarterly planning</li>
                  <li>• Team development</li>
                  <li>• Performance optimization</li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="font-semibold">Duration: 6-12+ months</p>
                  <p className="text-primary">Monthly retainer</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="text-center mb-4">
                <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">Intensive Sprint</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">High-impact, short-term focus</p>
                <ul className="space-y-1">
                  <li>• Crisis management</li>
                  <li>• Rapid strategy development</li>
                  <li>• Due diligence support</li>
                  <li>• Merger integration</li>
                </ul>
                <div className="pt-3 border-t">
                  <p className="font-semibold">Duration: 2-8 weeks</p>
                  <p className="text-primary">Weekly engagement fee</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      title: "Success Stories",
      subtitle: "Real results from fractional VP partnerships",
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">SaaS Startup</h3>
                      <p className="text-sm text-muted-foreground">Series A, 50 employees</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Needed VP of Sales but couldn't justify full-time hire. Fractional VP helped us build our sales process, hire 3 reps, and increase MRR by 200% in 6 months."
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-primary font-semibold">200% MRR growth</span>
                    <span className="text-primary font-semibold">60% cost savings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Manufacturing Company</h3>
                      <p className="text-sm text-muted-foreground">Family business, 150 employees</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Fractional VP of Operations helped us modernize processes, implement new systems, and prepare for succession. Efficiency improved 40% while maintaining quality."
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-primary font-semibold">40% efficiency gain</span>
                    <span className="text-primary font-semibold">Succession ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-center">Typical Results Timeline</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-primary mb-1">Month 1</div>
                <p className="text-muted-foreground">Assessment & Strategy</p>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">Month 2-3</div>
                <p className="text-muted-foreground">Implementation Begins</p>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">Month 4-6</div>
                <p className="text-muted-foreground">Measurable Improvements</p>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">Month 6+</div>
                <p className="text-muted-foreground">Sustained Growth</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Get Started?",
      subtitle: "Let's discuss how fractional VP services can accelerate your growth",
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule a free strategic consultation to explore how fractional VP expertise 
              can help your business achieve its next level of growth.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Free Consultation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    30-minute strategic discussion about your challenges and goals
                  </p>
                  <Button className="w-full">Schedule Call</Button>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Custom Proposal</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tailored engagement plan with specific deliverables and timeline
                  </p>
                  <Button variant="outline" className="w-full">Get Proposal</Button>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="p-0 text-center">
                  <Linkedin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Connect & Learn</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Follow for strategic insights and fractional leadership tips
                  </p>
                  <Button variant="outline" className="w-full">Connect on LinkedIn</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Next Steps:</strong> We'll start with a strategic assessment to understand your specific needs, 
                then create a customized engagement plan that delivers immediate value while building long-term capabilities.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="p-6 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fractional VP Services</h1>
            <p className="text-muted-foreground">Strategic Leadership Solutions</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="min-h-[600px]">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">{slides[currentSlide].title}</h1>
                <p className="text-xl text-muted-foreground">{slides[currentSlide].subtitle}</p>
              </div>
              
              <div className="mb-12">
                {slides[currentSlide].content}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Navigation */}
      <footer className="p-6 border-t bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default FractionalVPPitch;