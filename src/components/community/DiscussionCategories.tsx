
import { Lightbulb, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const discussionCategories = [
  {
    name: "Clinical Discussions",
    sections: [
      {
        name: "Acute Care",
        subcategories: [
          { name: "ICU/Critical Care", count: 89 },
          { name: "Emergency Medicine", count: 67 },
          { name: "Cardiology", count: 134 },
          { name: "Pulmonary", count: 78 },
          { name: "Neurology", count: 156 },
          { name: "Trauma", count: 92 }
        ]
      },
      {
        name: "Outpatient",
        subcategories: [
          { name: "Orthopedics", count: 234 },
          { name: "Sports Medicine", count: 189 },
          { name: "General PT", count: 156 },
          { name: "Women's Health", count: 87 },
          { name: "Vestibular", count: 65 },
          { name: "Hand Therapy", count: 91 }
        ]
      },
      {
        name: "SNF/Long-Term Care",
        subcategories: [
          { name: "Geriatrics", count: 123 },
          { name: "Post-Acute Rehab", count: 87 },
          { name: "Memory Care", count: 56 },
          { name: "Wound Care", count: 43 }
        ]
      },
      {
        name: "Home Health",
        subcategories: [
          { name: "Community Mobility", count: 67 },
          { name: "Home Safety", count: 89 },
          { name: "Equipment/DME", count: 54 },
          { name: "Caregiver Training", count: 76 }
        ]
      },
      {
        name: "Telehealth",
        subcategories: [
          { name: "Virtual PT", count: 98 },
          { name: "Remote Monitoring", count: 45 },
          { name: "Digital Exercise Programs", count: 72 },
          { name: "Compliance/Regulations", count: 34 }
        ]
      },
      {
        name: "School-Based",
        subcategories: [
          { name: "Pediatric Development", count: 87 },
          { name: "IEP/504 Plans", count: 65 },
          { name: "Sensory Integration", count: 78 },
          { name: "Adaptive Equipment", count: 43 }
        ]
      },
      {
        name: "Education/Academic",
        subcategories: [
          { name: "Clinical Education", count: 54 },
          { name: "Research Methods", count: 67 },
          { name: "Evidence-Based Practice", count: 89 },
          { name: "Student Supervision", count: 45 }
        ]
      },
      {
        name: "Physician-Owned Practices",
        subcategories: [
          { name: "Business Operations", count: 78 },
          { name: "Billing/Coding", count: 92 },
          { name: "Staff Management", count: 56 },
          { name: "Quality Measures", count: 67 }
        ]
      }
    ]
  }
];

export const DiscussionCategories = () => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Discussion Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {discussionCategories.map((category) => (
            <AccordionItem key={category.name} value={category.name} className="border-0">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline hover:bg-secondary/50">
                {category.name}
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <Accordion type="single" collapsible className="w-full">
                  {category.sections.map((section) => (
                    <AccordionItem key={section.name} value={section.name} className="border-0">
                      <AccordionTrigger className="px-8 py-3 text-sm font-medium text-muted-foreground hover:no-underline hover:bg-secondary/30">
                        {section.name}
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="space-y-1">
                          {section.subcategories.map((subcategory) => (
                            <div 
                              key={subcategory.name}
                              className="flex items-center justify-between px-10 py-2 hover:bg-secondary/20 cursor-pointer transition-colors rounded-sm"
                            >
                              <span className="text-sm text-foreground">{subcategory.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {subcategory.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
