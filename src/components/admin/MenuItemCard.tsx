import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, EyeOff } from 'lucide-react';
import type { MenuItem } from '@/hooks/useClientData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
}

export const MenuItemCard = ({ item, onEdit }: MenuItemCardProps) => {
  const currency = 'S/'; // You might want to get this from context

  const handleToggleActive = async () => {
    try {
      await supabase
        .from('menu_items')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);
      
      toast.success(
        item.is_active ? 'Plato ocultado del menú' : 'Plato mostrado en el menú'
      );
    } catch (error) {
      console.error('Error toggling item active state:', error);
      toast.error('Error al cambiar estado del plato');
    }
  };

  const handleToggleHomepage = async () => {
    try {
      await supabase
        .from('menu_items')
        .update({ show_on_homepage: !item.show_on_homepage })
        .eq('id', item.id);
      
      toast.success(
        item.show_on_homepage 
          ? 'Plato removido de la página principal' 
          : 'Plato agregado a la página principal'
      );
    } catch (error) {
      console.error('Error toggling homepage display:', error);
      toast.error('Error al cambiar visibilidad en página principal');
    }
  };

  return (
    <Card className={`transition-all ${!item.is_active ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        {item.image_url && (
          <div className="relative mb-3">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-24 object-cover rounded-md"
            />
            {!item.is_active && (
              <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                <EyeOff className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-sm leading-tight">
              {item.name}
            </h4>
            <span className="text-sm font-bold text-accent whitespace-nowrap ml-2">
              {currency}{item.price}
            </span>
          </div>
          
          {item.description && (
            <p className="text-xs text-foreground/70 line-clamp-2">
              {item.description}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1 flex-wrap">
              <Badge 
                variant={item.is_active ? "default" : "secondary"} 
                className="text-xs px-1.5 py-0.5"
              >
                {item.is_active ? 'Visible' : 'Oculto'}
              </Badge>
              {item.show_on_homepage && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  En portada
                </Badge>
              )}
            </div>
            
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleActive}
                className="h-6 w-6 p-0"
                title={item.is_active ? 'Ocultar del menú' : 'Mostrar en menú'}
              >
                {item.is_active ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-6 w-6 p-0"
                title="Editar plato"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};