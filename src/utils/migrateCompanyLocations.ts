import { supabase } from '@/integrations/supabase/client';

export const migrateCompanyLocations = async () => {
  try {
    console.log('Starting company location migration...');
    
    const { data, error } = await supabase.functions.invoke('migrate-company-locations');
    
    if (error) {
      console.error('Migration error:', error);
      throw error;
    }
    
    console.log('Migration result:', data);
    return data;
  } catch (error) {
    console.error('Failed to migrate company locations:', error);
    throw error;
  }
};