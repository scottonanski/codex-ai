
import React, { useState, useEffect } from 'react';
import { DocumentType } from '../types';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, type?: DocumentType) => void;
  parentId: string | null;
  mode?: 'document' | 'folder'; // NEW
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({ isOpen, onClose, onCreate, mode = 'document' }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>(DocumentType.Manuscript);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setTitle('');
      setType(DocumentType.Manuscript); // Default to Manuscript
    }
    // If switching to folder mode, no need to set type

  }, [isOpen]);

  if (!isOpen) return null;
  const isFolderMode = mode === 'folder';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (isFolderMode) {
        onCreate(title.trim());
      } else {
        onCreate(title.trim(), type);
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
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md" 
        onClick={e => e.stopPropagation()} // Prevent click inside from closing
      >
        <h2 
          id="create-item-title" 
          className="text-xl font-bold mb-4 text-slate-900 dark:text-white"
        >
          {isFolderMode ? 'Create New Folder' : 'Create New Document'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="item-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              id="item-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              autoFocus
            />
          </div>
          {!isFolderMode && (
            <div className="mb-6">
              <label htmlFor="item-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select
                id="item-type"
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {documentTypeOptions.map((docType: string) => (
                  <option key={docType} value={docType}>{docType}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-md text-white bg-sky-600 hover:bg-sky-500 font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
