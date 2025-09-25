import { 
  Utensils, 
  Truck, 
  Users, 
  Clock, 
  Star, 
  MapPin, 
  Award,
  Heart,
  Coffee,
  Zap
} from 'lucide-react';

export const iconMap = {
  Utensils,
  Truck, 
  Users,
  Clock,
  Star,
  MapPin,
  Award,
  Heart,
  Coffee,
  Zap
};

export type IconName = keyof typeof iconMap;

export const getIcon = (iconName: string) => {
  return iconMap[iconName as IconName] || iconMap.Utensils;
};