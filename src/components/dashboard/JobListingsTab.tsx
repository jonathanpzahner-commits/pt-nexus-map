import { StreamlinedSearch } from '@/components/search/StreamlinedSearch';

export const JobListingsTab = () => {
  return (
    <StreamlinedSearch contextTypes={['job_listings']} />
  );
};