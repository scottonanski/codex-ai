import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BinderItem } from '../types';

interface DraggableItemProps {
  item: BinderItem;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : undefined,
    transition: isDragging ? 'none' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default DraggableItem;
