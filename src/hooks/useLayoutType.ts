import { useClient } from '@/contexts/ClientContext';

export const useLayoutType = () => {
  const { clientSettings } = useClient();
  
  // Get layout type from client settings, default to 'layout1'
  const layoutType = clientSettings?.layout_type || 'layout1';
  
  return layoutType as 'layout1' | 'layout2' | 'layout3' | 'layout4';
};