import React from 'react';
import { BinderItem } from '../types';
import { ChevronRight, ChevronDown, FilePlus, FolderPlus, Trash2 } from 'lucide-react';
import DeleteItemModal from './DeleteItemModal';


interface BinderPanelProps {
  items: BinderItem[];
  selectedItem: BinderItem | null;
  onSelectItem: (item: BinderItem) => void;
  onOpenCreateModal: () => void;
  onCreateFolder: () => void;
}

const BinderPanel: React.FC<BinderPanelProps> = ({ items, selectedItem, onSelectItem, onOpenCreateModal, onCreateFolder }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentItems, setCurrentItems] = React.useState(items);

  React.useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  const handleOpenDeleteModal = () => {
    if (selectedItem) setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  // Helper to recursively remove item by id
  const removeItemById = (items: BinderItem[], id: string): BinderItem[] => {
    return items
      .filter(item => item.id !== id)
      .map(item =>
        item.children ? { ...item, children: removeItemById(item.children, id) } : item
      );
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    const updatedItems = removeItemById(currentItems, selectedItem.id);
    setCurrentItems(updatedItems);
    setIsDeleteModalOpen(false);
    // Optionally: notify parent to update items in memory/storage
  };

  const renderItem = (item: BinderItem) => {
    const isFolder = item.type === 'Folder';
    const currentLevel = typeof item.level === 'number' ? item.level : 0;
    const paddingLeft = `${currentLevel * 1.25 + 0.75}rem`; 

    return (
      <React.Fragment key={item.id}>
        <button
          onClick={() => onSelectItem(item)}
          style={{ paddingLeft }}
          className={`w-full btn btn-ghost btn-sm text-left py-2 pr-3 rounded-sm flex items-center space-x-1 transition-colors duration-150
            ${!isFolder && selectedItem?.id === item.id 
              ? 'bg-primary text-primary-content' 
              : 'hover:bg-success/40 hover:text-primary-content'
            }
            ${isFolder ? 'font-medium text-base-content' : ''}
          `}
          title={item.title}
          aria-current={!isFolder && selectedItem?.id === item.id ? "page" : undefined}
        >
          {isFolder && (
            item.isOpen ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )
          )}
          <span className={`flex-shrink-0 w-5 h-5 ${isFolder ? '' : 'ml-1'}`}>
            {item.icon}
          </span>
          <span className="truncate text-sm flex-1">{item.title}</span>
        </button>

        {isFolder && item.isOpen && item.children && (
          <div className="space-y-0.5">
            {item.children.map(child => (
              <React.Fragment key={child.id}>
                {renderItem(child)}
              </React.Fragment>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col h-full w-[10%] min-w-[250px] max-w-[350px] border-r border-white/10">
      <div className="bg-base-300 px-3 py-2">
        <h2 className="text-md font-semibold text-base-content flex-shrink-0">Project Binder</h2>
      </div>
    <aside className="flex flex-col px-2 bg-base-100 h-full">
      
    
      
      <div className="m-4 flex gap-4 flex-shrink-0">
        <button 
          onClick={onOpenCreateModal} 
          className="text-sm btn btn-primary btn-xs shadow-sm transition-colors"
          title="Create a new document"
          aria-label="Create a new document"
          role="button"
        >
          <FilePlus className="w-4 h-4" />
        </button>
        <button
          onClick={onCreateFolder}
          className="text-sm btn btn-primary btn-xs shadow-sm transition-colors"
          title="Create a new folder"
          aria-label="Create a new folder"
          role="button"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
        <button
          onClick={handleOpenDeleteModal}
          className="text-sm btn btn-error btn-xs shadow-sm transition-colors"
          title="Delete selected item"
          aria-label="Delete selected item"
          role="button"
          disabled={!selectedItem}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <DeleteItemModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDelete}
          itemName={selectedItem?.title || ''}
          itemType={selectedItem?.type === 'Folder' ? 'folder' : 'file'}
        />
      </div>

      <div className="overflow-y-auto space-y-1 flex-grow custom-scrollbar">
        {items.map(item => renderItem(item))}
      </div>
    </aside>
    </div>
  );
};



export default BinderPanel;
