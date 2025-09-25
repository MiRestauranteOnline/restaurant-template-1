import LayoutRouter from '@/components/LayoutRouter';
import { useDynamicColors } from '@/hooks/useDynamicColors';

const RestaurantContent = () => {
  // Initialize dynamic colors
  useDynamicColors();
  
  return <LayoutRouter />;
};

const Index = () => {
  return <RestaurantContent />;
};

export default Index;