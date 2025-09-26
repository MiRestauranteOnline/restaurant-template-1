// Utility to manually trigger fast-load data generation
import { supabase } from '@/integrations/supabase/client';

export const triggerFastLoadGeneration = async (domain: string = 'demos') => {
  try {
    const { data, error } = await supabase.functions.invoke('prebuild-client-data', {
      body: { domain }
    });

    if (error) {
      console.error('Failed to trigger fast-load generation:', error);
      return false;
    }

    console.log('Fast-load data generation triggered successfully:', data);
    return true;
  } catch (error) {
    console.error('Error triggering fast-load generation:', error);
    return false;
  }
};

// Auto-trigger on load if no fast-load data exists
export const ensureFastLoadDataExists = async () => {
  try {
    // Check if fast-load data exists
    const { error } = await supabase.storage
      .from('client-assets')
      .download('fast-load/demos.json');

    if (error && error.message.includes('not found')) {
      console.log('No fast-load data found, generating...');
      await triggerFastLoadGeneration('demos');
    }
  } catch (error) {
    console.warn('Error checking fast-load data:', error);
  }
};