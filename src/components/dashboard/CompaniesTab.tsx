import { StreamlinedSearch } from '@/components/search/StreamlinedSearch';

export const CompaniesTab = () => {
  return (
    <StreamlinedSearch contextTypes={['companies', 'consultant_companies', 'equipment_companies']} />
  );
};