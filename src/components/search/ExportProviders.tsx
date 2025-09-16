import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const ExportProviders = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    radius: "25"
  });

  const handleExport = async () => {
    if (!location.latitude || !location.longitude || !location.radius) {
      toast({
        title: "Missing Information",
        description: "Please enter latitude, longitude, and radius.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('export-providers', {
        body: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          radius: parseFloat(location.radius)
        }
      });

      if (error) {
        throw error;
      }

      // Create download link for CSV
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `providers_within_${location.radius}mi_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Provider list has been downloaded successfully.",
      });
      
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export provider list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast({
            title: "Location Found",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Providers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="40.7128"
            value={location.latitude}
            onChange={(e) => setLocation(prev => ({ ...prev, latitude: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-74.0060"
            value={location.longitude}
            onChange={(e) => setLocation(prev => ({ ...prev, longitude: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="radius">Radius (miles)</Label>
          <Input
            id="radius"
            type="number"
            placeholder="25"
            value={location.radius}
            onChange={(e) => setLocation(prev => ({ ...prev, radius: e.target.value }))}
          />
        </div>

        <Button
          onClick={getCurrentLocation}
          variant="outline"
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Exports all providers within the specified radius including their work addresses, specializations, and contact information.
        </p>
      </CardContent>
    </Card>
  );
};