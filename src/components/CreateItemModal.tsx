
import React, { useState, useEffect } from 'react';
import { DocumentType } from '../types';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, type?: DocumentType | undefined, parentId?: string | null) => void;
  parentId: string | null;
  folders: { id: string; name: string }[]; // <-- Changed to array
  mode?: 'document' | 'folder'; // NEW
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  parentId,
  folders = [],
  mode = 'document',
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>(DocumentType.Manuscript);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    parentId || (folders && folders[0] ? folders[0].id : null)
  );

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setTitle('');
      setType(DocumentType.Manuscript); // Default to Manuscript
      setSelectedFolderId(parentId || (folders && folders[0] ? folders[0].id : null)); // Reset folder selection
    }
    // If switching to folder mode, no need to set type

  }, [isOpen, parentId, folders]);

  if (!isOpen) return null;
  const isFolderMode = mode === 'folder';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (isFolderMode) {
        onCreate(title.trim(), undefined, selectedFolderId);
      } else {
        onCreate(title.trim(), type, selectedFolderId);
      }
      // onClose(); // App.tsx's handleCreateItem will call onClose via setIsCreateModalOpen(false)
    }
  };
  
  // Filter available document types for the dropdown.
  // Note: `t !== DocumentType.Folder` is a no-op as DocumentType enum does not contain 'Folder'.
  // This list will contain all defined DocumentTypes. If specific types need exclusion, list them explicitly.
  const documentTypeOptions = Object.values(DocumentType);
  // Example if you wanted to exclude Research:
  // const documentTypeOptions = Object.values(DocumentType).filter(t => t !== DocumentType.Research);


  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" 
      onClick={onClose} // Click outside to close
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-item-title"
    >
      <div 
        className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md" 
        onClick={e => e.stopPropagation()} // Prevent click inside from closing
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="item-title" className="block text-sm font-medium text-base-content/70 mb-1">Title</label>
            <input
              type="text"
              id="item-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border bg-base-200 border-base-300 rounded-md bg-base-100 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm disabled:opacity-70" aria-label="Create item title input"
              required
              autoFocus
            />
          </div>
          {!isFolderMode && (
            <div className="mb-6">
              <label htmlFor="item-type" className="block text-sm font-medium text-base-content/70 mb-1">Type</label>
              <select
                id="item-type"
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="w-full flex-1 p-2.5 border border-base-300 rounded-md bg-base-100 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm disabled:opacity-70"
              >
                {documentTypeOptions.map((docType: string) => (
                  <option key={docType} value={docType}>{docType}</option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="folder-select" className="block text-sm font-medium text-base-content/70 mb-1">
              Destination Folder
            </label>
            <select
              id="folder-select"
              value={selectedFolderId ?? ''}
              onChange={e => setSelectedFolderId(e.target.value)}
              className="w-full p-2.5 border border-base-300 rounded-md bg-base-100 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm"
            >
              <option value="">(Root)</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-ghost btn-error px-4 py-2 font-semibold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary px-4 py-2 font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
