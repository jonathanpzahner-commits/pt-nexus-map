import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface CompanyBulkUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export function CompanyBulkUpload({ open, onOpenChange, onUploadComplete }: CompanyBulkUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<{ successful: number; failed: number; errors: string[] } | null>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const headers = [
      "name",
      "parent_company",
      "pe_backed",
      "pe_relationship_start_date",
      "pe_firm_name",
      "number_of_clinics",
      "website",
      "glassdoor_url",
      "glassdoor_rating",
      "ceo",
      "description",
      "address",
      "city",
      "state",
      "zip_code",
      "full_address"
    ];
    const sample = [
      'Acme PT Clinic',
      'Acme Health Holdings',
      'Yes',
      '2021-06-15',
      'Summit Capital',
      '12',
      'https://acmept.example.com',
      'https://www.glassdoor.com/Overview/Working-at-Acme-PT-EI_IE12345.11,18.htm',
      '4.2',
      'Jane Doe',
      'Outpatient clinic group specializing in sports medicine.',
      '569 West 4th Street',
      'Benson',
      'AZ',
      '85602',
      ''
    ];
    const csvContent = `${headers.join(",")}\n${sample.map(v => `"${String(v).replace(/\"/g, '"')}"`).join(",")}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "companies_template.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResults(null);
    setStatus("idle");
    setProgress(0);
    setProcessed(0);
    setTotal(0);
  };

  function parseBoolean(val: any): boolean | null {
    if (val === undefined || val === null || String(val).trim() === "") return null;
    const s = String(val).toLowerCase();
    return ["y", "yes", "true", "1"].includes(s) ? true : ["n", "no", "false", "0"].includes(s) ? false : null;
  }

  function parseNumber(val: any): number | null {
    if (val === undefined || val === null || String(val).trim() === "") return null;
    const n = Number(val);
    return isFinite(n) ? n : null;
    }

  function parseLocation(full?: string): { address?: string; city?: string; state?: string; zip_code?: string } {
    if (!full) return {};
    // Handles formats like: "569 West 4th Street, Benson, AZ 85602, USA" or without country
    const cleaned = full.replace(/,?\s*USA$/i, "").trim();
    const parts = cleaned.split(",").map(p => p.trim());
    if (parts.length >= 3) {
      const addr = parts.slice(0, parts.length - 2).join(", ");
      const city = parts[parts.length - 2];
      const stateZip = parts[parts.length - 1];
      const m = stateZip.match(/([A-Z]{2})\s*(\d{5})?/i);
      if (m) {
        return { address: addr, city, state: m[1].toUpperCase(), zip_code: m[2] || undefined };
      }
      return { address: addr, city };
    }
    // Fallback: just return as address
    return { address: cleaned };
  }

  function mapRecord(r: any) {
    // Accept both split fields and a single full_address
    const fullAddr = r.full_address || r["Full Address"] || r["address_full"]; 
    const parsed = fullAddr ? parseLocation(fullAddr) : {};

    const name = r.name || r.company || r["company_name"]; 

    // Leadership: store CEO if provided
    const leadership = r.ceo ? { CEO: String(r.ceo) } : undefined;

    return {
      name,
      company_type: r.company_type || 'Clinic',
      parent_company: r.parent_company || null,
      pe_backed: parseBoolean(r.pe_backed) ?? false,
      pe_relationship_start_date: r.pe_relationship_start_date || null,
      pe_firm_name: r.pe_firm_name || null,
      number_of_clinics: parseNumber(r.number_of_clinics),
      website: r.website || null,
      glassdoor_url: r.glassdoor_url || null,
      glassdoor_rating: parseNumber(r.glassdoor_rating),
      description: r.description || null,
      address: r.address || parsed.address || null,
      city: r.city || parsed.city || null,
      state: r.state || parsed.state || null,
      zip_code: r.zip_code || parsed.zip_code || null,
      leadership: leadership ? leadership as any : undefined,
    } as const;
  }

  function readCSV(text: string) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const headers = lines[0].split(",").map(h => h.trim().replace(/\"/g, ''));
    return lines.slice(1).map(line => {
      const values = line.split(",").map(v => v.trim().replace(/\"/g, ''));
      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = values[i]; });
      return obj;
    });
  }

  async function parseFile(f: File): Promise<any[]> {
    if (f.name.endsWith(".csv")) {
      const text = await f.text();
      return readCSV(text);
    }
    const buf = await f.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws, { defval: "" });
  }

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus("processing");
    setProgress(0);
    setProcessed(0);
    setResults(null);

    try {
      const rows = await parseFile(file);
      setTotal(rows.length);
      if (rows.length === 0) throw new Error("No rows found in file");

      const mapped = rows.map(mapRecord).filter(r => r.name && String(r.name).trim().length > 0);
      const batchSize = 100;
      let successful = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < mapped.length; i += batchSize) {
        const batch = mapped.slice(i, i + batchSize).map(({ leadership, ...row }) => ({ ...row, leadership: leadership ?? {} }));
        const { error } = await supabase.from("companies").insert(batch);
        if (error) {
          failed += batch.length;
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        } else {
          successful += batch.length;
        }
        setProcessed(Math.min(mapped.length, i + batchSize));
        setProgress(Math.round(((i + batchSize) / mapped.length) * 100));
      }

      setResults({ successful, failed, errors });
      setStatus(successful > 0 ? "completed" : "failed");

      toast({ title: "Companies imported", description: `${successful} inserted${failed ? `, ${failed} failed` : ""}.` });
      onUploadComplete?.();

      // Fire-and-forget: start fast offline geocoding just for companies to avoid UI blocking
      supabase.functions.invoke("fast-offline-geocoder", {
        body: { tables: ["companies"], batchSize: 200 }
      }).then(({ data, error }) => {
        if (error) {
          console.error("Geocoder error", error);
        } else {
          console.log("Geocoder summary", data);
        }
      });
    } catch (err: any) {
      console.error(err);
      setStatus("failed");
      setResults({ successful: 0, failed: 0, errors: [err.message || "Upload failed"] });
      toast({ title: "Upload failed", description: err.message || "An error occurred", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      setStatus("idle");
      setProgress(0);
      setProcessed(0);
      setTotal(0);
      setResults(null);
      onOpenChange(false);
    }
  };

  const StatusIcon = () => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload - Companies</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>

            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" />

            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full" disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>

          {file && (
            <Alert>
              <AlertDescription>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}

          {status !== "idle" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <StatusIcon />
                <span className="font-medium">
                  {status === "processing" && `Processing... (${processed}/${total} records)`}
                  {status === "completed" && "Upload Completed"}
                  {status === "failed" && "Upload Failed"}
                </span>
              </div>
              {(uploading || status === "processing") && <Progress value={progress} className="w-full" />}
            </div>
          )}

          {results && (
            <Alert>
              <AlertDescription>
                <div className="space-y-1">
                  <div>Successful: {results.successful}</div>
                  <div>Failed: {results.failed}</div>
                  {results.errors.length > 0 && (
                    <div className="text-xs opacity-80">First error: {results.errors[0]}</div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
              Start Upload
            </Button>
            <Button variant="outline" onClick={handleClose} disabled={uploading}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
