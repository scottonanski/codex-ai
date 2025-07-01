
import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { BinderItem, DocumentType, Theme, EditorSuggestion } from './types';
import { INITIAL_BINDER_ITEMS, TEMPLATES, getIconForItemType, FolderIcon } from './constants';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import BinderPanel from './components/BinderPanel';
import { EditorPanel } from './components/EditorPanel';
import AIPanel from './components/AIPanel';
import ThemeToggle from './components/ThemeToggle';
import Logo from './components/Logo';
import { getEditorAnalysis } from './services/geminiService';
import { CreateItemModal } from './components/CreateItemModal';
import { addItemToTree, findItemByIdRecursive, updateItemInTree } from './utils';


const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [binderItems, setBinderItems] = useState<BinderItem[]>(INITIAL_BINDER_ITEMS);
  const [createItemMode, setCreateItemMode] = useState<'document' | 'folder'>('document');
  
  const findFirstDocumentRecursive = (items: BinderItem[]): BinderItem | null => {
    for (const item of items) {
      if (item.type !== 'Folder') return item;
      if (item.children && item.isOpen) {
        const childDoc = findFirstDocumentRecursive(item.children);
        if (childDoc) return childDoc;
      }
    }
    return null;
  };

  const getInitialSelectedItem = () => {
    return findFirstDocumentRecursive(INITIAL_BINDER_ITEMS) || 
           (INITIAL_BINDER_ITEMS.length > 0 && INITIAL_BINDER_ITEMS[0].type !== 'Folder' ? INITIAL_BINDER_ITEMS[0] : null);
  };
  
  const [selectedItem, setSelectedItem] = useState<BinderItem | null>(getInitialSelectedItem());
  const [editorSuggestions, setEditorSuggestions] = useState<EditorSuggestion[]>([]);
  const [isEditorAnalyzing, setIsEditorAnalyzing] = useState<boolean>(false);
  const [editorAnalysisError, setEditorAnalysisError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem('codex-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('codex-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  }, []);

  const handleSelectItem = useCallback((item: BinderItem) => {
    if (item.type !== 'Folder') {
      setSelectedItem(item);
      setEditorSuggestions([]);
      setEditorAnalysisError(null);
    } else {
      setBinderItems(prevItems => updateItemInTree(prevItems, item.id, { isOpen: !item.isOpen }));
       // If a folder is selected, we might want to "deselect" any active document editor
      // For now, it keeps the last selected document active, which is fine.
      // setSelectedItem(null); // Or some other logic if needed
    }
  }, []);
  
  const handleContentChange = (newContent: string | Record<string, string>) => {
    if (!selectedItem) return;

    setBinderItems(prevItems => updateItemInTree(prevItems, selectedItem.id, { content: newContent }));
    setSelectedItem(prev => prev ? { ...prev, content: newContent } : null);
  };

  const handleAddToManuscriptFromChat = useCallback((textToAdd: string) => {
    if (selectedItem && typeof selectedItem.content === 'string' && selectedItem.type === DocumentType.Manuscript) {
      const currentContent = selectedItem.content;
      const newContent = currentContent.trim() === '' ? textToAdd : `${currentContent}\n\n${textToAdd}`;
      handleContentChange(newContent);
    } else {
      toast.error("Select a Manuscript document to add text.", { duration: 3000 });
    }
  }, [selectedItem]); 

  const handleRequestEditorAnalysis = useCallback(async () => {
    if (!selectedItem || typeof selectedItem.content !== 'string') {
      setEditorAnalysisError("Please select a manuscript chapter to analyze.");
      setEditorSuggestions([]);
      return;
    }
    const textToAnalyze = selectedItem.content;

    if (!textToAnalyze.trim() || textToAnalyze.trim().length < 10) { 
      setEditorAnalysisError("Please select at least 10 characters of text to analyze.");
      setEditorSuggestions([]);
      return;
    }

    setIsEditorAnalyzing(true);
    setEditorSuggestions([]);
    setEditorAnalysisError(null);
    try {
      const suggestions = await getEditorAnalysis(textToAnalyze);
      setEditorSuggestions(suggestions);
      if (suggestions.length === 0) {
        // setEditorAnalysisError("No specific suggestions found for the provided text. It looks good!");
        toast.success("Editor AI found no specific issues. Looks good!", { duration: 3000 });
      } else {
        toast.success(`Editor AI found ${suggestions.length} suggestion(s).`, { duration: 3000 });
      }
    } catch (error) {
      console.error("Error fetching Editor Analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
      setEditorAnalysisError(errorMessage);
      toast.error(`Analysis failed: ${errorMessage}`, {duration: 4000});
    } finally {
      setIsEditorAnalyzing(false);
    }
  }, [selectedItem]);

  // Utility to flatten all folders in the binder tree
  function flattenFolders(items: BinderItem[]): { id: string; name: string }[] {
    let result: { id: string; name: string }[] = [];
    for (const item of items) {
      if (item.type === 'Folder') {
        result.push({ id: item.id, name: item.title });
        if (item.children) result = result.concat(flattenFolders(item.children));
      }
    }
    return result;
  }

  // Updated handleCreateItem to accept parentId
  const handleCreateItem = (title: string, type?: DocumentType, parentId?: string | null) => {
    let newLevel = 0;
    const docType = type ?? DocumentType.Manuscript;

    if (parentId) {
        const parentFolder = findItemByIdRecursive(binderItems, parentId);
        if (parentFolder) {
            newLevel = parentFolder.level + 1;
        } else {
          console.error("Parent folder not found for new item, defaulting to root.");
        }
    }

    const newItem: BinderItem = {
      id: `item-${Date.now().toString()}`,
      title,
      type: docType, // This is DocumentType, not 'Folder'
      content: docType === DocumentType.Manuscript ? '' : Object.fromEntries(TEMPLATES[docType]?.map(field => [field, '']) || []),
      level: newLevel,
      icon: getIconForItemType(docType),
      children: undefined, // Documents don't have children
    };
    setBinderItems(prevItems => addItemToTree(prevItems, parentId ?? null, newItem));
    toast.success(`'${title}' (${type}) created successfully!`);
    setIsCreateModalOpen(false); // Close the modal
    handleSelectItem(newItem); // Automatically select the new item for editing
  };

  // Handler for creating a new folder at the root
  const handleCreateFolder = (title: string) => {
    if (!title || !title.trim()) {
      toast.error('Folder name cannot be empty.');
      return;
    }
    const parentId = selectedItem && selectedItem.type === 'Folder' ? selectedItem.id : null;
    let newLevel = 0;
    if (parentId) {
      const parentFolder = findItemByIdRecursive(binderItems, parentId);
      if (parentFolder) {
        newLevel = parentFolder.level + 1;
      }
    }
    const newFolder: BinderItem = {
      id: `folder-${Date.now().toString()}`,
      title: title.trim(),
      type: 'Folder',
      icon: <FolderIcon />,
      content: '',
      level: newLevel,
      children: [],
      isOpen: true
    };
    setBinderItems(prevItems => addItemToTree(prevItems, parentId, newFolder));
    toast.success(`Folder '${title.trim()}' created successfully!`);
    setIsCreateFolderModalOpen(false);
    handleSelectItem(newFolder);
  };

  // Move item in tree utility
  function moveItemInTree(
    items: BinderItem[],
    itemId: string,
    newParentId: string | null,
    newIndex: number
  ): BinderItem[] {
    // Remove the item from its current location
    let removed: BinderItem | null = null;
    function remove(items: BinderItem[] = []): BinderItem[] {
      return (items || []).filter(item => {
        if (item.id === itemId) {
          removed = item;
          return false;
        }
        if (item.children) {
          item.children = remove(item.children || []);
        }
        return true;
      });
    }
    let treeWithout = remove(JSON.parse(JSON.stringify(items)));
    if (!removed) return items; // Not found
    // Insert at new location
    function insert(items: BinderItem[] = []): BinderItem[] {
      if (newParentId === null) {
        const arr = [...(items || [])];
        // Ensure icon is correct for folders after move
        if (removed && removed.type === 'Folder') {
          removed = { ...removed, icon: <FolderIcon /> };
        }
        arr.splice(newIndex, 0, removed!);
        return arr;
      }
      return (items || []).map(item => {
        if (item.id === newParentId) {
          let children = item.children ? [...item.children] : [];
          // Ensure icon is correct for folders after move
          if (removed && removed.type === 'Folder') {
            removed = { ...removed, icon: <FolderIcon /> };
          }
          children.splice(newIndex, 0, removed!);
          return { ...item, children, isOpen: true };
        }
        if (item.children) {
          return { ...item, children: insert(item.children || []) };
        }
        return item;
      });
    }
    return insert(treeWithout);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Find the dragged item and the drop target
    const findItemAndParent = (items: BinderItem[], id: string, parentId: string | null = null): { item: BinderItem | null, parentId: string | null } => {
      for (const item of items) {
        if (item.id === id) return { item, parentId };
        if (item.children) {
          const found = findItemAndParent(item.children, id, item.id);
          if (found.item) return found;
        }
      }
      return { item: null, parentId: null };
    };
    const activeId = String(active.id);
    const overId = String(over.id);
    const { item: draggedItem } = findItemAndParent(binderItems, activeId);
    const { item: dropTarget } = findItemAndParent(binderItems, overId);
    if (!draggedItem || !dropTarget) return;

    // If dropping on a folder, add as first child
    if (dropTarget.type === 'Folder') {
      setBinderItems(prev => moveItemInTree(prev, activeId, dropTarget.id, 0));
      return;
    }
    // Otherwise, insert before the drop target at the same level
    const findParentAndIndex = (items: BinderItem[], id: string, parentId: string | null = null): { parentId: string | null, index: number } | null => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) return { parentId, index: i };
        if (items[i].children) {
          const found = findParentAndIndex(items[i].children || [], id, items[i].id);
          if (found) return found;
        }
      }
      return null;
    };
    const dropInfo = findParentAndIndex(binderItems, overId);
    if (!dropInfo) return;
    setBinderItems(prev => moveItemInTree(prev, activeId, dropInfo.parentId, dropInfo.index));
  };

  return (
    <div className="flex flex-col h-screen antialiased bg-base-100 dark:bg-base-900 text-base-content dark:text-base-content">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#2d3748' : '#ffffff', 
            color: theme === 'dark' ? '#e2e8f0' : '#1a202c', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          },
           success: {
            duration: 3000,
            iconTheme: {
              primary: theme === 'dark' ? '#4299e1' : '#2b6cb0', // codex-primary colors
              secondary: theme === 'dark' ? '#1a202c' : '#ffffff',
            },
          },
          error: {
            duration: 4000,
             iconTheme: {
              primary: theme === 'dark' ? '#F56565' : '#C53030', // Red colors
              secondary: theme === 'dark' ? '#1a202c' : '#ffffff',
            },
          },
        }}
      />
      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateItem}
        parentId={selectedItem?.id ?? null}
        folders={flattenFolders(binderItems)}
        mode={createItemMode}
      />
      <CreateItemModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreate={handleCreateFolder}
        parentId={null}
        folders={flattenFolders(binderItems)}
        mode="folder"
      />
      <header className="px-4 py-2 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Logo className="h-8 w-8" />
        </div>
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <BinderPanel
            items={binderItems}
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            onOpenCreateModal={() => {
             setCreateItemMode('document');
             setIsCreateModalOpen(true);
           }}
           onCreateFolder={() => {
             setIsCreateFolderModalOpen(true);
           }}
          />
        </DndContext>
        <EditorPanel
          key={selectedItem?.id} 
          selectedItem={selectedItem}
          onContentChange={handleContentChange}
          onAnalyzeRequest={handleRequestEditorAnalysis}
        />
        <AIPanel
          onAddToManuscript={handleAddToManuscriptFromChat}
          editorSuggestions={editorSuggestions}
          isEditorAnalyzing={isEditorAnalyzing}
          editorAnalysisError={editorAnalysisError}
          binderItems={binderItems}
        />
      </div>
       <footer className="px-4 py-4 bg-base-300 border-t border-white/10 text-center text-xs text-base-content/50 flex-shrink-0">
        Codex AI - Your Creative Ai Writing Partner.
      </footer>
    </div>
  );
};

export default App;