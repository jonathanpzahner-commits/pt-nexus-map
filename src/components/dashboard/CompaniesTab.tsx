import { useState } from 'react';
import { StreamlinedSearch } from '@/components/search/StreamlinedSearch';
import { Button } from '@/components/ui/button';
import { CompanyBulkUpload } from '@/components/upload/CompanyBulkUpload';

export const CompaniesTab = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <Button variant="outline" onClick={() => setOpen(true)}>Import Companies</Button>
      </div>
      <StreamlinedSearch contextTypes={['companies', 'consultant_companies', 'equipment_companies']} />
      <CompanyBulkUpload open={open} onOpenChange={setOpen} />
    </div>
  );
};