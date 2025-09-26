import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryCard } from './CategoryCard';
import { AddCategoryDialog } from './AddCategoryDialog';
import { AddMenuItemDialog } from './AddMenuItemDialog';
import { EditMenuItemDialog } from './EditMenuItemDialog';
import { useClient } from '@/contexts/ClientContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Utensils } from 'lucide-react';
import type { MenuItem, MenuCategory } from '@/hooks/useClientData';

export const MenuManagement = () => {
  const { menuItems, menuCategories, client } = useClient();
  const [localCategories, setLocalCategories] = useState<MenuCategory[]>([]);
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>([]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryForNewItem, setSelectedCategoryForNewItem] = useState<string>('');

  // Sync with global state
  useEffect(() => {
    setLocalCategories([...menuCategories].sort((a, b) => a.display_order - b.display_order));
    setLocalMenuItems([...menuItems]);
  }, [menuCategories, menuItems]);

  // Group items by category
  const groupedItems = localCategories.reduce((acc, category) => {
    const categoryItems = localMenuItems
      .filter(item => item.category === category.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    acc[category.name] = categoryItems;
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'CATEGORY') {
      // Reorder categories
      const newCategories = Array.from(localCategories);
      const [reorderedCategory] = newCategories.splice(source.index, 1);
      newCategories.splice(destination.index, 0, reorderedCategory);

      // Update display_order for all categories
      const updatedCategories = newCategories.map((cat, index) => ({
        ...cat,
        display_order: index
      }));

      setLocalCategories(updatedCategories);

      // Update in database
      try {
        for (const category of updatedCategories) {
          await supabase
            .from('menu_categories')
            .update({ display_order: category.display_order })
            .eq('id', category.id);
        }
        toast.success('Orden de categorías actualizado');
      } catch (error) {
        console.error('Error updating category order:', error);
        toast.error('Error al actualizar el orden');
        setLocalCategories(menuCategories);
      }
    }
  };

  const handleCategoryRename = async (categoryId: string, newName: string) => {
    try {
      // Update category name
      await supabase
        .from('menu_categories')
        .update({ name: newName })
        .eq('id', categoryId);

      // Update all menu items in this category
      const oldCategory = localCategories.find(cat => cat.id === categoryId);
      if (oldCategory) {
        await supabase
          .from('menu_items')
          .update({ category: newName })
          .eq('category', oldCategory.name)
          .eq('client_id', client?.id);
      }

      toast.success('Categoría renombrada exitosamente');
    } catch (error) {
      console.error('Error renaming category:', error);
      toast.error('Error al renombrar la categoría');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = localCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const itemsInCategory = groupedItems[category.name] || [];
    
    if (itemsInCategory.length > 0) {
      toast.error('No se puede eliminar una categoría que contiene platos');
      return;
    }

    try {
      await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);

      toast.success('Categoría eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar la categoría');
    }
  };

  const handleAddItemToCategory = (categoryName: string) => {
    setSelectedCategoryForNewItem(categoryName);
    setIsAddItemOpen(true);
  };

  if (!client) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-foreground/70">Cargando información del restaurante...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-foreground">
            Gestión de Menú
          </h2>
          <p className="text-foreground/70">
            Administra las categorías y platos de tu menú arrastrando para reordenar
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddCategoryOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Categoría
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedCategoryForNewItem('');
              setIsAddItemOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Utensils className="h-4 w-4" />
            Nuevo Plato
          </Button>
        </div>
      </div>

      {localCategories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Utensils className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No hay categorías en el menú
            </h3>
            <p className="text-foreground/70 mb-4">
              Comienza creando tu primera categoría de platos
            </p>
            <Button onClick={() => setIsAddCategoryOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Categoría
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories" type="CATEGORY">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {localCategories.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${
                          snapshot.isDragging ? 'opacity-75' : ''
                        }`}
                      >
                        <CategoryCard
                          category={category}
                          items={groupedItems[category.name] || []}
                          onRename={handleCategoryRename}
                          onDelete={handleDeleteCategory}
                          onAddItem={handleAddItemToCategory}
                          onEditItem={setEditingItem}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <AddCategoryDialog
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        clientId={client.id}
      />

      <AddMenuItemDialog
        open={isAddItemOpen}
        onOpenChange={setIsAddItemOpen}
        clientId={client.id}
        categories={localCategories}
        selectedCategory={selectedCategoryForNewItem}
      />

      {editingItem && (
        <EditMenuItemDialog
          item={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          categories={localCategories}
        />
      )}
    </div>
  );
};