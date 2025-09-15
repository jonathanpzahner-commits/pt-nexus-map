import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONSULTANT_CATEGORIES, CONSULTANT_SPECIALTIES } from '@/data/providerFilters';
import { SearchFilters } from '@/hooks/useServerSearch';

interface ConsultantFiltersProps {
  filters: SearchFilters & {
    consultantCategory?: string;
    consultantSpecialty?: string;
  };
  updateFilters: (newFilters: Partial<SearchFilters & {
    consultantCategory?: string;
    consultantSpecialty?: string;
  }>) => void;
}

export const ConsultantFilters = ({ filters, updateFilters }: ConsultantFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState(filters.consultantCategory || '');

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateFilters({ 
      consultantCategory: value,
      consultantSpecialty: '' // Reset specialty when category changes
    });
  };

  const availableSpecialties = selectedCategory ? CONSULTANT_SPECIALTIES[selectedCategory] || [] : [];

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="consultantCategory" className="text-sm font-medium">Consultant Category</Label>
        <Select value={selectedCategory || 'all'} onValueChange={(value) => handleCategoryChange(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            <SelectItem value="all">All Categories</SelectItem>
            {CONSULTANT_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {availableSpecialties.length > 0 && (
        <div className="space-y-3">
          <Label htmlFor="consultantSpecialty" className="text-sm font-medium">Specialty</Label>
          <Select value={filters.consultantSpecialty || 'all'} onValueChange={(value) => updateFilters({ consultantSpecialty: value === 'all' ? '' : value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              <SelectItem value="all">All Specialties</SelectItem>
              {availableSpecialties.map(specialty => (
                <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};