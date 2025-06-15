import { BinderItem } from './types';

// Moved from App.tsx
export const updateItemInTree = (items: BinderItem[], itemId: string, updates: Partial<BinderItem>): BinderItem[] => {
  return items.map(item => {
    if (item.id === itemId) {
      return { ...item, ...updates };
    }
    if (item.children) {
      return { ...item, children: updateItemInTree(item.children, itemId, updates) };
    }
    return item;
  });
};

export const findItemByIdRecursive = (items: BinderItem[], itemId: string): BinderItem | null => {
  for (const item of items) {
    if (item.id === itemId) return item;
    if (item.children) {
      const foundInChild = findItemByIdRecursive(item.children, itemId);
      if (foundInChild) return foundInChild;
    }
  }
  return null;
};

export const addItemToTree = (
  items: BinderItem[],
  parentId: string | null,
  newItem: BinderItem
): BinderItem[] => {
  if (parentId === null) { // Add to root
    return [...items, newItem];
  }

  // Otherwise, find the parent and add to its children
  return items.map(item => {
    if (item.id === parentId) {
      // Make sure children array exists and folder is open
      const children = item.children ? [...item.children, newItem] : [newItem];
      return { ...item, children, isOpen: true };
    }
    if (item.children) {
      return { ...item, children: addItemToTree(item.children, parentId, newItem) };
    }
    return item;
  });
};
