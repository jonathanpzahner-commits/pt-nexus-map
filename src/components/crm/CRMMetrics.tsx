import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, DollarSign, TrendingUp } from "lucide-react";

export function CRMMetrics() {
  const metrics = [
    {
      title: "Total Contacts",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Deals",
      value: "45",
      change: "+8%",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Pipeline Value",
      value: "$630K",
      change: "+22%",
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Conversion Rate",
      value: "24%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{metric.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}