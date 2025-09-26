import { useState, useEffect } from 'react';
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import type { MenuItem, MenuCategory } from '@/hooks/useClientData';

interface EditMenuItemDialogProps {
  item: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MenuCategory[];
}

export const EditMenuItemDialog = ({ 
  item,
  open, 
  onOpenChange, 
  categories
}: EditMenuItemDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    show_on_homepage: false,
    show_image_home: false,
    show_image_menu: true,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category: item.category,
        image_url: item.image_url || '',
        show_on_homepage: item.show_on_homepage,
        show_image_home: item.show_image_home,
        show_image_menu: item.show_image_menu,
        is_active: item.is_active
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre del plato es requerido');
      return;
    }

    if (!formData.category) {
      toast.error('Selecciona una categoría');
      return;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      toast.error('Ingresa un precio válido');
      return;
    }

    setLoading(true);

    try {
      await supabase
        .from('menu_items')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: Number(formData.price),
          category: formData.category,
          image_url: formData.image_url.trim() || null,
          show_on_homepage: formData.show_on_homepage,
          show_image_home: formData.show_image_home,
          show_image_menu: formData.show_image_menu,
          is_active: formData.is_active
        })
        .eq('id', item.id);

      toast.success('Plato actualizado exitosamente');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Error al actualizar el plato');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      await supabase
        .from('menu_items')
        .delete()
        .eq('id', item.id);

      toast.success('Plato eliminado exitosamente');
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Error al eliminar el plato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Editar Plato</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-item-name">Nombre del plato *</Label>
                  <Input
                    id="edit-item-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ej. Lomo Saltado"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-item-price">Precio *</Label>
                  <Input
                    id="edit-item-price"
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
                <Label htmlFor="edit-item-category">Categoría *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-item-description">Descripción</Label>
                <Textarea
                  id="edit-item-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe los ingredientes y preparación del plato..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-item-image">URL de la imagen</Label>
                <Input
                  id="edit-item-image"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-base font-semibold">Opciones de visualización</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="edit-is-active">Plato activo</Label>
                    <p className="text-sm text-foreground/70">
                      Mostrar u ocultar este plato del menú
                    </p>
                  </div>
                  <Switch
                    id="edit-is-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="edit-show-homepage">Mostrar en página principal</Label>
                    <p className="text-sm text-foreground/70">
                      Aparecerá en la sección destacada de la homepage
                    </p>
                  </div>
                  <Switch
                    id="edit-show-homepage"
                    checked={formData.show_on_homepage}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, show_on_homepage: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="edit-show-image-menu">Mostrar imagen en menú</Label>
                    <p className="text-sm text-foreground/70">
                      La imagen aparecerá en la página del menú
                    </p>
                  </div>
                  <Switch
                    id="edit-show-image-menu"
                    checked={formData.show_image_menu}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, show_image_menu: checked }))
                    }
                  />
                </div>

                {formData.show_on_homepage && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="edit-show-image-home">Mostrar imagen en homepage</Label>
                      <p className="text-sm text-foreground/70">
                        La imagen aparecerá también en la homepage
                      </p>
                    </div>
                    <Switch
                      id="edit-show-image-home"
                      checked={formData.show_image_home}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, show_image_home: checked }))
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="mr-auto flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !formData.name.trim() || !formData.category || !formData.price}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El plato "{item.name}" será eliminado permanentemente del menú.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};