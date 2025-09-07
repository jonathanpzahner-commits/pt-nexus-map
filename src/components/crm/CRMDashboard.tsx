import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactsTab } from "./ContactsTab";
import { DealsTab } from "./DealsTab";
import { ActivitiesTab } from "./ActivitiesTab";
import { CompaniesTab } from "./CompaniesTab";
import { CRMMetrics } from "./CRMMetrics";
import { Users, Building, Target, Activity } from "lucide-react";

export function CRMDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CRM Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your customer relationships and sales pipeline
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Deals
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Companies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CRMMetrics />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Called John Smith</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email sent to ABC Corp</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Meeting scheduled with Jane Doe</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
                <CardDescription>Deals by stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Prospecting</span>
                    <span className="text-sm font-medium">$125,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Qualification</span>
                    <span className="text-sm font-medium">$75,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Proposal</span>
                    <span className="text-sm font-medium">$250,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Negotiation</span>
                    <span className="text-sm font-medium">$180,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsTab />
        </TabsContent>

        <TabsContent value="deals">
          <DealsTab />
        </TabsContent>

        <TabsContent value="activities">
          <ActivitiesTab />
        </TabsContent>

        <TabsContent value="companies">
          <CompaniesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}