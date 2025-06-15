import React from 'react';
import { BinderItem } from '../types';
import DraggableItem from './DraggableItem';
import DroppableFolder from './DroppableFolder';

interface BinderPanelProps {
  items: BinderItem[];
  selectedItem: BinderItem | null;
  onSelectItem: (item: BinderItem) => void;
  onOpenCreateModal: () => void;
  onCreateFolder: () => void;
}

const BinderPanel: React.FC<BinderPanelProps> = ({ items, selectedItem, onSelectItem, onOpenCreateModal, onCreateFolder }) => {
  
  const renderItem = (item: BinderItem) => {
    const isFolder = item.type === 'Folder';
    const currentLevel = typeof item.level === 'number' ? item.level : 0;
    const paddingLeft = `${currentLevel * 1.25 + 0.75}rem`; 

    const content = (
      <button
        onClick={() => onSelectItem(item)}
        style={{ paddingLeft }}
        className={`w-full text-left py-2 pr-3 rounded-md flex items-center space-x-2 transition-colors duration-150
          ${!isFolder && selectedItem?.id === item.id 
            ? 'bg-codex-primary text-white shadow-sm' 
            : 'hover:bg-codex-light-darker dark:hover:bg-codex-dark-lighter text-codex-light-text-dim dark:text-codex-dark-text-dim hover:text-codex-light-text dark:hover:text-codex-dark-text'
          }
          ${isFolder ? 'font-medium text-codex-light-text dark:text-codex-dark-text' : ''}
        `}
        title={item.title}
        aria-current={!isFolder && selectedItem?.id === item.id ? "page" : undefined}
      >
        {isFolder && (
          <ChevronIcon className={`w-4 h-4 transform transition-transform duration-150 flex-shrink-0 ${item.isOpen ? 'rotate-90' : 'rotate-0'}`} />
        )}
        <span className={`flex-shrink-0 w-5 h-5 ${isFolder ? '' : 'ml-1'}`}>
           {item.icon}
        </span>
        <span className="truncate text-sm flex-1">{item.title}</span>
      </button>
    );

    let wrapped = <DraggableItem item={item}>{content}</DraggableItem>;
    if (isFolder) {
      wrapped = (
        <DroppableFolder item={item}>
          {wrapped}
          {item.isOpen && item.children && (
            <div className="space-y-0.5">
              {item.children.map(child => renderItem(child))}
            </div>
          )}
        </DroppableFolder>
      );
    }
    return <React.Fragment key={item.id}>{wrapped}</React.Fragment>;
  };

  return (
    <aside className="w-[20%] min-w-[250px] max-w-[350px] flex-shrink-0 bg-codex-light-dark dark:bg-codex-dark-light border-r border-codex-light-darker dark:border-codex-dark-lighter p-3 flex flex-col shadow-md">
      <h2 className="text-lg font-semibold mb-2 px-1 text-codex-light-text dark:text-codex-dark-text flex-shrink-0">The Binder</h2>
      
      <div className="my-2 flex gap-2 flex-shrink-0">
          <button 
            onClick={onOpenCreateModal} 
            className="flex-1 text-sm bg-codex-primary/80 hover:bg-codex-primary text-white dark:bg-codex-primary/70 dark:hover:bg-codex-primary px-3 py-1.5 rounded-md shadow-sm transition-colors"
            title="Create a new document"
          >
            New Doc
          </button>
          <button
            onClick={onCreateFolder}
            className="flex-1 text-sm bg-codex-primary/70 hover:bg-codex-primary text-white dark:bg-codex-primary/60 dark:hover:bg-codex-primary px-3 py-1.5 rounded-md shadow-sm transition-colors"
            title="Create a new folder"
          >
            New Folder
          </button>
      </div>

      <div className="overflow-y-auto space-y-1 flex-grow custom-scrollbar">
        {items.map(item => renderItem(item))}
      </div>
    </aside>
  );
};

const ChevronIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);


export default BinderPanel;