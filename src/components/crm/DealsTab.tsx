import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, DollarSign, Calendar, User } from "lucide-react";

export function DealsTab() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - replace with actual data from Supabase
  const deals = [
    {
      id: "1",
      title: "PT Equipment Purchase",
      value: 125000,
      stage: "proposal",
      probability: 75,
      expectedCloseDate: "2024-02-15",
      contactName: "John Smith",
      company: "Tech Solutions Inc"
    },
    {
      id: "2",
      title: "Software Implementation",
      value: 85000,
      stage: "negotiation",
      probability: 60,
      expectedCloseDate: "2024-02-28",
      contactName: "Sarah Johnson",
      company: "HealthTech Corp"
    },
    {
      id: "3",
      title: "Training Program",
      value: 45000,
      stage: "qualification",
      probability: 40,
      expectedCloseDate: "2024-03-10",
      contactName: "Michael Brown",
      company: "RehabPlus"
    },
    {
      id: "4",
      title: "Consultation Services",
      value: 25000,
      stage: "closed_won",
      probability: 100,
      expectedCloseDate: "2024-01-30",
      contactName: "Lisa Davis",
      company: "PT Clinic Network"
    }
  ];

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "prospecting": return "bg-gray-100 text-gray-800";
      case "qualification": return "bg-blue-100 text-blue-800";
      case "proposal": return "bg-yellow-100 text-yellow-800";
      case "negotiation": return "bg-orange-100 text-orange-800";
      case "closed_won": return "bg-green-100 text-green-800";
      case "closed_lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredDeals.map((deal) => (
          <Card key={deal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{deal.title}</h3>
                    <Badge className={getStageColor(deal.stage)}>
                      {deal.stage.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-foreground">
                        {formatCurrency(deal.value)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{deal.contactName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Probability</span>
                      <span className="font-medium">{deal.probability}%</span>
                    </div>
                    <Progress value={deal.probability} className="h-2" />
                  </div>

                  <p className="text-sm text-muted-foreground">{deal.company}</p>
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