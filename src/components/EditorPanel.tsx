
import { BinderItem, DocumentType } from '../types';
import { TEMPLATES } from '../constants';

interface EditorPanelProps {
  selectedItem: BinderItem | null;
  onContentChange: (newContent: string | Record<string, string>) => void;
  onAnalyzeRequest: () => void;
  // Consider passing isEditorAnalyzing if the button's loading state needs to be managed from App.tsx
  // isEditorAnalyzing: boolean; 
}

export const EditorPanel = ({ selectedItem, onContentChange, onAnalyzeRequest }: EditorPanelProps) => {
  if (!selectedItem || selectedItem.type === 'Folder') { // Check for 'Folder' string literal
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-codex-dark-light text-codex-dark-text-dim p-4">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-codex-dark-text dark:text-codex-light-text">No document selected</h3>
          <p className="mt-1 text-xs text-codex-dark-text-dim dark:text-codex-light-text-dim">Please select a document from the Binder to begin editing.</p>
        </div>
      </main>
    );
  }

  const isTemplate = selectedItem.type !== DocumentType.Manuscript && typeof selectedItem.content === 'object';
  
  const handleTemplateFieldChange = (field: string, value: string) => {
    if (typeof selectedItem.content === 'object' && selectedItem.content !== null) { // Ensure content is an object
      const newContent = { ...selectedItem.content, [field]: value };
      onContentChange(newContent);
    }
  };

  const renderTemplateForm = () => {
    const fields = TEMPLATES[selectedItem.type as DocumentType]; // Cast because Folder type is excluded
    if (!fields) {
      return <div className="p-8 text-codex-dark-text-dim">Unsupported template type for "{selectedItem.title}".</div>;
    }
    const content = selectedItem.content as Record<string, string>; // Content is already asserted to be object

    return (
      <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        {fields.map(field => {
          const isTextArea = field.toLowerCase().includes('summary') || 
                             field.toLowerCase().includes('notes') || 
                             field.toLowerCase().includes('backstory') || 
                             field.toLowerCase().includes('description') ||
                             field.toLowerCase().includes('atmosphere') ||
                             field.toLowerCase().includes('history') ||
                             field.toLowerCase().includes('key points of interest') ||
                             field.toLowerCase().includes('rules') ||
                             field.toLowerCase().includes('impact on world') ||
                             field.toLowerCase().includes('key takeaways') ||
                             field.toLowerCase().includes('quotes');
          return (
            <div key={field}>
              <label 
                htmlFor={`${selectedItem.id}-${field}`} 
                className="block text-sm font-medium text-codex-light-text-dim dark:text-codex-dark-text-dim mb-1" // Corrected label color
              >
                {field}
              </label>
              {isTextArea ? (
                 <textarea
                  id={`${selectedItem.id}-${field}`}
                  rows={field.toLowerCase() === 'backstory' || field.toLowerCase() === 'description' ? 5 : 3}
                  value={content[field] || ''}
                  onChange={(e) => handleTemplateFieldChange(field, e.target.value)}
                  className="w-full bg-codex-light-darker dark:bg-codex-dark-lighter border border-codex-light-darker dark:border-codex-dark-lighter rounded-md p-2.5 text-codex-light-text dark:text-codex-dark-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-codex-primary text-base shadow-sm" // Corrected BG and Text colors
                />
              ) : (
                <input
                  id={`${selectedItem.id}-${field}`}
                  type="text"
                  value={content[field] || ''}
                  onChange={(e) => handleTemplateFieldChange(field, e.target.value)}
                  className="w-full bg-codex-light-darker dark:bg-codex-dark-lighter border border-codex-light-darker dark:border-codex-dark-lighter rounded-md p-2.5 text-codex-light-text dark:text-codex-dark-text placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-codex-primary text-base shadow-sm" // Corrected BG and Text colors
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderManuscriptEditor = () => {
    return (
      <textarea
        value={typeof selectedItem.content === 'string' ? selectedItem.content : ''}
        onChange={(e) => onContentChange(e.target.value)}
        className="flex-1 w-full p-6 md:p-8 bg-transparent text-codex-light-text dark:text-codex-dark-text resize-none focus:outline-none font-serif text-lg leading-relaxed" // Corrected Text colors
        placeholder="Start writing your masterpiece..."
      />
    );
  };

  return (
    <main className="flex-1 flex flex-col bg-codex-light-dark dark:bg-codex-dark-light overflow-hidden w-[55%]">
      <div className="p-3 border-b border-codex-light-darker dark:border-codex-dark-lighter flex justify-between items-center flex-shrink-0">
        <h2 className="px-2 text-base font-semibold text-codex-light-text dark:text-codex-dark-text truncate" title={selectedItem.title}> {/* Corrected title text color */}
          {selectedItem.title}
        </h2>
        <button
          onClick={onAnalyzeRequest}
          disabled={typeof selectedItem.content !== 'string' || (selectedItem.content as string).trim().length < 10}
          className="bg-codex-primary hover:bg-codex-primary-dark text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors shadow-sm disabled:bg-slate-500 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-slate-500"
          title={typeof selectedItem.content !== 'string' ? "Analysis is only available for Manuscript documents" : "Analyze this document"}
        >
          Analyze
        </button>
      </div>

      {isTemplate ? renderTemplateForm() : renderManuscriptEditor()}

    </main>
  );
};
