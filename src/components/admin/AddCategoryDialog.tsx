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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export const AddCategoryDialog = ({ open, onOpenChange, clientId }: AddCategoryDialogProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }

    setLoading(true);

    try {
      // Get the highest display_order for this client
      const { data: categories } = await supabase
        .from('menu_categories')
        .select('display_order')
        .eq('client_id', clientId)
        .order('display_order', { ascending: false })
        .limit(1);

      const nextOrder = categories && categories.length > 0 ? categories[0].display_order + 1 : 0;

      await supabase
        .from('menu_categories')
        .insert({
          name: name.trim(),
          client_id: clientId,
          display_order: nextOrder,
          is_active: true
        });

      toast.success('Categoría creada exitosamente');
      setName('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nombre de la categoría</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Entradas, Platos Principales, Postres..."
                autoFocus
              />
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
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creando...' : 'Crear Categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};