import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Key, Copy, Trash2, Plus, CreditCard, Activity, Eye, EyeOff } from "lucide-react";
import { WorkingSearchDemo } from '@/components/search/WorkingSearchDemo';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  permissions: any;
  rate_limit: number;
  created_at: string;
  last_used_at: string | null;
  usage_count: number;
}

interface CreditTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export const ApiManagementTab = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [credits, setCredits] = useState<any>({});
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState(100);
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-key-management');

      if (error) throw error;
      setApiKeys(data.api_keys || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    }
  };

  const fetchCredits = async () => {
    try {
      // Call the balance endpoint
      const response = await fetch(`https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/credit-management/balance`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setCredits(data);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      // Call the transactions endpoint
      const response = await fetch(`https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/credit-management/transactions`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchApiKeys(), fetchCredits(), fetchTransactions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('api-key-management', {
        body: {
          name: newKeyName,
          permissions: { read: true, export: true },
          rate_limit: 1000
        }
      });

      if (error) throw error;

      setShowNewKey(data.api_key);
      setNewKeyName("");
      setIsCreateDialogOpen(false);
      await fetchApiKeys();

      toast({
        title: "Success",
        description: "API key created successfully",
      });
    } catch (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.functions.invoke(`api-key-management/${id}`, {
        method: 'DELETE'
      });

      if (error) throw error;

      await fetchApiKeys();
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const purchaseCredits = async () => {
    try {
      // Call the purchase endpoint
      const response = await fetch(`https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/credit-management/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: purchaseAmount,
          payment_method: "demo"
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await Promise.all([fetchCredits(), fetchTransactions()]);
      setIsPurchaseDialogOpen(false);

      toast({
        title: "Success",
        description: `Successfully purchased ${purchaseAmount} credits`,
      });
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast({
        title: "Error",
        description: "Failed to purchase credits",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Management</h2>
          <p className="text-muted-foreground">
            Manage your API keys and credits for external integrations
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WorkingSearchDemo />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apiKeys.filter(k => k.is_active).length}</div>
                <p className="text-xs text-muted-foreground">
                  {apiKeys.length} total keys
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{credits.balance || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {credits.total_spent || 0} used this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {apiKeys.reduce((sum, key) => sum + key.usage_count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total API calls made
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">API Keys</h3>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key to access your data programmatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">API Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production CRM Integration"
                    />
                  </div>
                  <Button onClick={createApiKey} className="w-full">
                    Create API Key
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {showNewKey && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">New API Key Created</CardTitle>
                <CardDescription className="text-green-600">
                  Copy this key now - it won't be shown again!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input value={showNewKey} readOnly className="font-mono text-sm" />
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(showNewKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewKey(null)}
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{key.name}</h4>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {key.key_prefix}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Rate limit: {key.rate_limit}/hour</span>
                        <span>Usage: {key.usage_count} calls</span>
                        <span>
                          Last used: {key.last_used_at 
                            ? new Date(key.last_used_at).toLocaleDateString()
                            : "Never"
                          }
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteApiKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="credits" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Credits & Usage</h3>
            <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase Credits
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Purchase Credits</DialogTitle>
                  <DialogDescription>
                    Buy credits to access API data. Each record costs 1 credit.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Number of Credits</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(parseInt(e.target.value) || 0)}
                      min="1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Cost: ${(purchaseAmount * 0.01).toFixed(2)} USD
                    </p>
                  </div>
                  <Button onClick={purchaseCredits} className="w-full">
                    Purchase {purchaseAmount} Credits
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Credit Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">{credits.balance || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Purchased</p>
                  <p className="text-2xl font-bold">{credits.total_purchased || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Used</p>
                  <p className="text-2xl font-bold">{credits.total_spent || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Balance: {transaction.balance_after}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                How to integrate with the platform's API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Base URL</h4>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/api-data-access
                </code>
              </div>

              <div>
                <h4 className="font-medium mb-2">Authentication</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Include your API key in the request header:
                </p>
                <code className="bg-muted px-2 py-1 rounded text-sm block">
                  X-API-Key: your_api_key_here
                </code>
              </div>

              <div>
                <h4 className="font-medium mb-2">Available Endpoints</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <code>GET /companies</code>
                    <span className="text-muted-foreground">1 credit per record</span>
                  </div>
                  <div className="flex justify-between">
                    <code>GET /providers</code>
                    <span className="text-muted-foreground">1 credit per record</span>
                  </div>
                  <div className="flex justify-between">
                    <code>GET /schools</code>
                    <span className="text-muted-foreground">1 credit per record</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Example Request</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`curl -X GET \\
  "https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/api-data-access/companies?limit=10" \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};