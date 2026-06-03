import { useState } from 'react';
import { StreamlinedSearch } from '@/components/search/StreamlinedSearch';
import { Button } from '@/components/ui/button';
import { CompanyBulkUpload } from '@/components/upload/CompanyBulkUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PAGE_SIZE = 1000;

async function fetchAllCompanies() {
  let all: any[] = [];
  let from = 0;
  // Paginate past Supabase's 1000-row default limit
  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toCSV(rows: any[]): string {
  if (rows.length === 0) return '';
  const headerSet = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);
  const escape = (val: any) => {
    if (val === null || val === undefined) return '';
    const str =
      typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

export const CompaniesTab = () => {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true);
      toast.info('Preparing export...');
      const rows = await fetchAllCompanies();
      if (rows.length === 0) {
        toast.warning('No companies to export');
        return;
      }
      const stamp = new Date().toISOString().split('T')[0];
      if (format === 'csv') {
        downloadBlob(toCSV(rows), `pt-companies-${stamp}.csv`, 'text/csv');
      } else {
        downloadBlob(
          JSON.stringify(rows, null, 2),
          `pt-companies-${stamp}.json`,
          'application/json'
        );
      }
      toast.success(`Exported ${rows.length} companies`);
    } catch (err: any) {
      console.error('Export failed:', err);
      toast.error(`Export failed: ${err?.message ?? 'unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export Companies'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Download as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              Download as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Import Companies
        </Button>
      </div>
      <StreamlinedSearch contextTypes={['companies', 'consultant_companies', 'equipment_companies']} />
      <CompanyBulkUpload open={open} onOpenChange={setOpen} />
    </div>
  );
};