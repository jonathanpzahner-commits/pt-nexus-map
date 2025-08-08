import { StreamlinedSearch } from './StreamlinedSearch';

interface GlobalSearchProps {
  contextTypes?: string[];
}

export const GlobalSearch = ({ contextTypes }: GlobalSearchProps) => {
  return <StreamlinedSearch contextTypes={contextTypes} />;
};