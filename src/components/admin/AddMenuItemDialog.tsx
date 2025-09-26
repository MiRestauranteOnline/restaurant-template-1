import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { MenuCategory } from '@/hooks/useClientData';

interface AddMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  categories: MenuCategory[];
  selectedCategory?: string;
}

export const AddMenuItemDialog = ({ 
  open, 
  onOpenChange, 
  clientId, 
  categories,
  selectedCategory 
}: AddMenuItemDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: selectedCategory || '',
    image_url: '',
    show_on_homepage: false,
    show_image_home: false,
    show_image_menu: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre del plato es requerido');
      return;
    }

    if (!formData.category_id) {
      toast.error('Selecciona una categoría');
      return;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      toast.error('Ingresa un precio válido');
      return;
    }

    setLoading(true);

    try {
      const selectedCat = categories.find(cat => cat.id === formData.category_id);
      await supabase
        .from('menu_items')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: Number(formData.price),
          category: selectedCat?.name || '',
          category_id: formData.category_id,
          image_url: formData.image_url.trim() || null,
          client_id: clientId,
          is_active: true,
          show_on_homepage: formData.show_on_homepage,
          show_image_home: formData.show_image_home,
          show_image_menu: formData.show_image_menu
        });

      toast.success('Plato creado exitosamente');
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: selectedCategory || '',
        image_url: '',
        show_on_homepage: false,
        show_image_home: false,
        show_image_menu: true
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast.error('Error al crear el plato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Plato</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Nombre del plato *</Label>
                <Input
                  id="item-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ej. Lomo Saltado"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-price">Precio *</Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-category">Categoría *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-description">Descripción</Label>
              <Textarea
                id="item-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe los ingredientes y preparación del plato..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-image">URL de la imagen</Label>
              <Input
                id="item-image"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-base font-semibold">Opciones de visualización</Label>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-homepage">Mostrar en página principal</Label>
                  <p className="text-sm text-foreground/70">
                    Aparecerá en la sección destacada de la homepage
                  </p>
                </div>
                <Switch
                  id="show-homepage"
                  checked={formData.show_on_homepage}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, show_on_homepage: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-image-menu">Mostrar imagen en menú</Label>
                  <p className="text-sm text-foreground/70">
                    La imagen aparecerá en la página del menú
                  </p>
                </div>
                <Switch
                  id="show-image-menu"
                  checked={formData.show_image_menu}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, show_image_menu: checked }))
                  }
                />
              </div>

              {formData.show_on_homepage && (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-image-home">Mostrar imagen en homepage</Label>
                    <p className="text-sm text-foreground/70">
                      La imagen aparecerá también en la homepage
                    </p>
                  </div>
                  <Switch
                    id="show-image-home"
                    checked={formData.show_image_home}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, show_image_home: checked }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim() || !formData.category_id || !formData.price}>
              {loading ? 'Creando...' : 'Crear Plato'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};