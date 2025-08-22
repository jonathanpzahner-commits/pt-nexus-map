
import { Newspaper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const newsItems = [
  {
    id: 1,
    title: "New APTA Guidelines Released for Telehealth PT Services",
    source: "APTA News",
    time: "3 hours ago",
    category: "Regulation"
  },
  {
    id: 2,
    title: "AI-Powered Gait Analysis Shows Promise in Clinical Trials",
    source: "PT Research Journal",
    time: "6 hours ago",
    category: "Technology"
  },
  {
    id: 3,
    title: "Medicare Changes Affect PT Reimbursement Rates",
    source: "Healthcare Finance",
    time: "1 day ago",
    category: "Finance"
  }
];

export const IndustryNews = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Latest Industry News</h3>
      {newsItems.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-15 bg-muted rounded-lg flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{item.category}</Badge>
                  <span className="text-sm text-muted-foreground">{item.time}</span>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Source: {item.source}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
