import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MenuItemCard } from './MenuItemCard';
import { 
  GripVertical, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Plus,
  Utensils 
} from 'lucide-react';
import type { MenuCategory, MenuItem } from '@/hooks/useClientData';
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface CategoryCardProps {
  category: MenuCategory;
  items: MenuItem[];
  onRename: (categoryId: string, newName: string) => void;
  onDelete: (categoryId: string) => void;
  onAddItem: (categoryName: string) => void;
  onEditItem: (item: MenuItem) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export const CategoryCard = ({
  category,
  items,
  onRename,
  onDelete,
  onAddItem,
  onEditItem,
  dragHandleProps
}: CategoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const handleSaveRename = () => {
    if (editName.trim() && editName !== category.name) {
      onRename(category.id, editName.trim());
    }
    setIsEditing(false);
    setEditName(category.name);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(category.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <Card className="border-2 border-dashed border-border hover:border-primary/30 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...dragHandleProps}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-foreground/50" />
            </div>
            
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-lg font-semibold"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveRename}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  {category.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {items.length} {items.length === 1 ? 'plato' : 'platos'}
                </Badge>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(category.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                disabled={items.length > 0}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <Utensils className="h-8 w-8 text-foreground/30 mx-auto mb-3" />
            <p className="text-foreground/70 mb-3">
              No hay platos en esta categoría
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddItem(category.name)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Primer Plato
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => onEditItem(item)}
                />
              ))}
            </div>
            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItem(category.name)}
                className="w-full flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Plato a {category.name}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};