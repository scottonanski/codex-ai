import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { BinderItem } from '../types';

interface DroppableFolderProps {
  item: BinderItem;
  children: React.ReactNode;
}

const DroppableFolder: React.FC<DroppableFolderProps> = ({ item, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      className={
        `transition-all duration-150 rounded-md ${
          isOver ? 'ring-2 ring-codex-primary ring-offset-2 ring-offset-codex-light dark:ring-offset-codex-dark' : ''
        }`
      }
      style={{ background: isOver ? 'rgba(80,180,255,0.07)' : undefined }}
    >
      {children}
    </div>
  );
};

export default DroppableFolder;
