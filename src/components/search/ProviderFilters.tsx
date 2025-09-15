import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PRIMARY_SETTINGS, SUB_SETTINGS, SPECIALTIES, CERTIFICATIONS } from '@/data/providerFilters';
import { SearchFilters } from '@/types/search';

interface ProviderFiltersProps {
  filters: SearchFilters & {
    primarySetting?: string;
    subSetting?: string;
    specialty?: string;
    certification?: string;
  };
  updateFilters: (newFilters: Partial<SearchFilters & {
    primarySetting?: string;
    subSetting?: string;
    specialty?: string;
    certification?: string;
  }>) => void;
}

export const ProviderFilters = ({ filters, updateFilters }: ProviderFiltersProps) => {
  const [selectedPrimarySetting, setSelectedPrimarySetting] = useState(filters.primarySetting || '');

  const handlePrimarySettingChange = (value: string) => {
    setSelectedPrimarySetting(value);
    updateFilters({ 
      primarySetting: value,
      subSetting: '' // Reset sub-setting when primary changes
    });
  };

  const availableSubSettings = selectedPrimarySetting ? SUB_SETTINGS[selectedPrimarySetting] || [] : [];

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="primarySetting" className="text-sm font-medium">Setting (Primary)</Label>
        <Select value={selectedPrimarySetting || 'all'} onValueChange={(value) => handlePrimarySettingChange(value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select primary setting" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            <SelectItem value="all">All Settings</SelectItem>
            {PRIMARY_SETTINGS.map(setting => (
              <SelectItem key={setting} value={setting}>{setting}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {availableSubSettings.length > 0 && (
        <div className="space-y-3">
          <Label htmlFor="subSetting" className="text-sm font-medium">Sub-Setting</Label>
          <Select value={filters.subSetting || 'all'} onValueChange={(value) => updateFilters({ subSetting: value === 'all' ? '' : value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-setting" />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              <SelectItem value="all">All Sub-Settings</SelectItem>
              {availableSubSettings.map(subSetting => (
                <SelectItem key={subSetting} value={subSetting}>{subSetting}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-3">
        <Label htmlFor="specialty" className="text-sm font-medium">Specialty / Focus Area</Label>
        <Select value={filters.specialty || 'all'} onValueChange={(value) => updateFilters({ specialty: value === 'all' ? '' : value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select specialty" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            <SelectItem value="all">All Specialties</SelectItem>
            {SPECIALTIES.map(specialty => (
              <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="certification" className="text-sm font-medium">Advanced Certification</Label>
        <Select value={filters.certification || 'all'} onValueChange={(value) => updateFilters({ certification: value === 'all' ? '' : value })}>
          <SelectTrigger>  
            <SelectValue placeholder="Select certification" />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            <SelectItem value="all">All Certifications</SelectItem>
            {CERTIFICATIONS.map(cert => (
              <SelectItem key={cert} value={cert}>{cert}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};