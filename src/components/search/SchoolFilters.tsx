import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFilters } from '@/types/search';

interface SchoolFiltersProps {
  filters: SearchFilters & {
    costCategory?: string;
    programLength?: string;
    programType?: string;
    accreditation?: string;
  };
  updateFilters: (filters: Partial<SearchFilters>) => void;
}

export const SchoolFilters: React.FC<SchoolFiltersProps> = ({ filters, updateFilters }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-sm font-medium">Cost Category</Label>
        <Select value={filters.costCategory || 'all'} onValueChange={(value) => updateFilters({ costCategory: value === 'all' ? '' : value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Any cost range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any cost range</SelectItem>
            <SelectItem value="Under $10,000">Under $10,000</SelectItem>
            <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
            <SelectItem value="$25,000 - $50,000">$25,000 - $50,000</SelectItem>
            <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
            <SelectItem value="Over $100,000">Over $100,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Program Length</Label>
        <Select value={filters.programLength || 'all'} onValueChange={(value) => updateFilters({ programLength: value === 'all' ? '' : value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Any length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any length</SelectItem>
            <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
            <SelectItem value="1-2 years">1-2 years</SelectItem>
            <SelectItem value="2-3 years">2-3 years</SelectItem>
            <SelectItem value="3-4 years">3-4 years</SelectItem>
            <SelectItem value="More than 4 years">More than 4 years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Program Type</Label>
        <Select value={filters.programType || 'all'} onValueChange={(value) => updateFilters({ programType: value === 'all' ? '' : value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Any program type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any program type</SelectItem>
            <SelectItem value="Doctor of Physical Therapy (DPT)">Doctor of Physical Therapy (DPT)</SelectItem>
            <SelectItem value="Physical Therapist Assistant (PTA)">Physical Therapist Assistant (PTA)</SelectItem>
            <SelectItem value="Continuing Education">Continuing Education</SelectItem>
            <SelectItem value="Residency Program">Residency Program</SelectItem>
            <SelectItem value="Fellowship Program">Fellowship Program</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Accreditation</Label>
        <Select value={filters.accreditation || 'all'} onValueChange={(value) => updateFilters({ accreditation: value === 'all' ? '' : value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Any accreditation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any accreditation</SelectItem>
            <SelectItem value="CAPTE Accredited">CAPTE Accredited</SelectItem>
            <SelectItem value="Regional Accreditation">Regional Accreditation</SelectItem>
            <SelectItem value="National Accreditation">National Accreditation</SelectItem>
            <SelectItem value="Specialized Accreditation">Specialized Accreditation</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};