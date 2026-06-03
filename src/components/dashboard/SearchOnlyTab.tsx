import React, { useState } from 'react';
import { StreamlinedSearch } from '../search/StreamlinedSearch';
import { SponsoredBanner } from '@/components/ads/SponsoredBanner';
import { getAdsForPage } from '@/data/sponsoredAds';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { Download, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

interface SearchOnlyTabProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const PAGE_SIZE = 1000;

async function fetchAllCompanies() {
  let all: Record<string, unknown>[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;
    all = all.concat(data as Record<string, unknown>[]);
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

function toCSV(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return '';
  const headerSet = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => headerSet.add(key)));
  const headers = Array.from(headerSet);
  const escape = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n');
}

export const SearchOnlyTab = ({ title, description, icon: Icon }: SearchOnlyTabProps) => {
  const [exporting, setExporting] = useState(false);

  // Determine entity types based on title
  const getEntityTypesFromTitle = (title: string): string[] => {
    if (title.includes('Physical Therapists')) return ['providers'];
    if (title.includes('Companies')) return ['companies', 'consultant_companies', 'equipment_companies'];
    if (title.includes('Education')) return ['schools'];
    if (title.includes('Job')) return ['job_listings'];
    return ['companies', 'schools', 'providers', 'job_listings'];
  };

  // Get page key for ads
  const getPageKeyFromTitle = (title: string): string => {
    if (title.includes('Physical Therapists')) return 'providers';
    if (title.includes('Companies')) return 'companies';
    if (title.includes('Education')) return 'education';
    if (title.includes('Job')) return 'jobs';
    return 'overview';
  };

  const entityTypes = getEntityTypesFromTitle(title);
  const pageKey = getPageKeyFromTitle(title);

  const handleCompanyExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true);
      toast.info('Preparing company export...');
      const rows = await fetchAllCompanies();

      if (rows.length === 0) {
        toast.warning('No companies to export');
        return;
      }

      const stamp = new Date().toISOString().split('T')[0];
      if (format === 'csv') {
        downloadBlob(toCSV(rows), `pt-companies-${stamp}.csv`, 'text/csv');
      } else {
        downloadBlob(JSON.stringify(rows, null, 2), `pt-companies-${stamp}.json`, 'application/json');
      }

      toast.success(`Exported ${rows.length} companies`);
    } catch (error: unknown) {
      console.error('Export failed:', error);
      const message = error instanceof Error ? error.message : 'unknown error';
      toast.error(`Export failed: ${message}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sponsored Ads */}
      <SponsoredBanner ads={getAdsForPage(pageKey)} position="top" />
      {/* Clean Header */}
      <div className="flex flex-col gap-3 pb-4 border-b sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        {pageKey === 'companies' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={exporting} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                {exporting ? 'Exporting...' : 'Export Companies'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCompanyExport('csv')}>
                Download as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCompanyExport('json')}>
                Download as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Streamlined Search */}
      <StreamlinedSearch contextTypes={entityTypes} />
    </div>
  );
};