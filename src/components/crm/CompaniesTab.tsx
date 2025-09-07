import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Building, Globe, Phone, Mail, Users, DollarSign } from "lucide-react";

export function CompaniesTab() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - replace with actual data from Supabase
  const companies = [
    {
      id: "1",
      name: "Tech Solutions Inc",
      industry: "Healthcare Technology",
      companySize: "51-200",
      website: "https://techsolutions.com",
      phone: "(555) 123-4567",
      email: "info@techsolutions.com",
      city: "San Francisco",
      state: "CA",
      annualRevenue: 5000000,
      employeeCount: 125,
      status: "active",
      tags: ["Technology", "Healthcare", "B2B"]
    },
    {
      id: "2",
      name: "HealthTech Corp",
      industry: "Medical Devices",
      companySize: "201-500",
      website: "https://healthtech.com",
      phone: "(555) 987-6543",
      email: "contact@healthtech.com",
      city: "Boston",
      state: "MA",
      annualRevenue: 12000000,
      employeeCount: 350,
      status: "active",
      tags: ["Medical", "Innovation", "B2B"]
    },
    {
      id: "3",
      name: "RehabPlus",
      industry: "Physical Therapy",
      companySize: "11-50",
      website: "https://rehabplus.com",
      phone: "(555) 456-7890",
      email: "hello@rehabplus.com",
      city: "Austin",
      state: "TX",
      annualRevenue: 2500000,
      employeeCount: 35,
      status: "active",
      tags: ["Rehabilitation", "Healthcare", "B2C"]
    }
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "archived": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <a href={company.website} target="_blank" rel="noopener noreferrer" 
                             className="hover:underline">
                            {company.website.replace('https://', '')}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{company.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{company.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{company.employeeCount} employees ({company.companySize})</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(company.annualRevenue)} revenue</span>
                        </div>
                        <div className="text-muted-foreground">
                          📍 {company.city}, {company.state}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {company.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}