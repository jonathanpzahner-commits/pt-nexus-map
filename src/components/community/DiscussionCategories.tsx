
import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const categories = [
  { name: "Orthopedics", count: 156, color: "from-blue-500 to-cyan-500" },
  { name: "Neurology", count: 89, color: "from-purple-500 to-violet-500" },
  { name: "Sports Medicine", count: 134, color: "from-green-500 to-emerald-500" },
  { name: "Pediatrics", count: 67, color: "from-orange-500 to-amber-500" },
  { name: "Geriatrics", count: 78, color: "from-pink-500 to-rose-500" },
  { name: "Practice Management", count: 45, color: "from-teal-500 to-cyan-500" }
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
      <CardContent className="space-y-3">
        {categories.map((category) => (
          <div 
            key={category.name}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`}></div>
              <span className="font-medium text-foreground">{category.name}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {category.count}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
