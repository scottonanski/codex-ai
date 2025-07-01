import React from 'react';

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
  itemType: 'file' | 'folder';
}

export const DeleteItemModal: React.FC<DeleteItemModalProps> = ({ isOpen, onClose, onDelete, itemName, itemType }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" 
      onClick={onClose} // Click outside to close
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-item-title"
    >
      <div 
        className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md" 
        onClick={e => e.stopPropagation()} // Prevent click inside from closing
      >
        <h3 id="delete-item-title" className="text-lg font-semibold mb-4 text-error">
          Delete {itemType === 'folder' ? 'Folder' : 'File'}
        </h3>
        <p className="mb-6 text-base-content">
          Are you sure you want to delete <span className="font-bold">{itemName}</span>?
          <br/>
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={onDelete}
            aria-label="Confirm delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
