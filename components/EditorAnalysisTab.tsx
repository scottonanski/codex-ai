import React from 'react';
import { EditorSuggestion } from '../types';
import Loader from './Loader';
import Alert from './Alert';

interface EditorAnalysisTabProps {
  suggestions: EditorSuggestion[];
  isLoading: boolean;
  error: string | null;
}

const EditorAnalysisTab: React.FC<EditorAnalysisTabProps> = ({ suggestions, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full bg-codex-light dark:bg-codex-dark text-codex-light-text-dim dark:text-codex-dark-text-dim">
        <Loader size="lg" />
        <p className="mt-4 text-lg">Editor AI is analyzing your text...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-codex-light dark:bg-codex-dark h-full">
        <Alert type="error" message={`Analysis Error: ${error}`} />
         <div className="mt-6 text-center text-codex-light-text-dim dark:text-codex-dark-text-dim">
            <PencilSwooshIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Try analyzing a different piece of text or rephrasing your content.</p>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="p-6 text-center text-codex-light-text-dim dark:text-codex-dark-text-dim flex flex-col items-center justify-center h-full bg-codex-light dark:bg-codex-dark">
        <PencilSwooshIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2 text-codex-light-text dark:text-codex-dark-text">Editor Analysis</h3>
        <p className="text-sm">
          No suggestions at the moment.
        </p>
        <p className="text-xs mt-1">
          Select text in the editor and click "Analyze with Editor" to get feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 bg-codex-light dark:bg-codex-dark h-full overflow-y-auto custom-scrollbar">
      <h3 className="text-lg font-semibold mb-3 px-1 text-codex-light-text dark:text-codex-dark-text">
        Editor's Suggestions ({suggestions.length})
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {suggestions.map((item) => (
          <div 
            key={item.id} 
            className="p-3 sm:p-4 rounded-lg shadow-md border border-codex-light-darker dark:border-codex-dark-lighter bg-codex-light-dark dark:bg-codex-dark-light"
          >
            <span 
              className="px-2.5 py-1 text-xs font-semibold rounded-full mb-2 inline-block
                         bg-codex-primary/10 text-codex-primary dark:bg-codex-primary/20 dark:text-codex-primary"
            >
              {item.category || "Suggestion"}
            </span>
            
            <div className="mb-2 sm:mb-3">
              <p className="text-xs text-codex-light-text-dim dark:text-codex-dark-text-dim mb-0.5">Original:</p>
              <p className="text-sm text-red-600 dark:text-red-400 italic bg-red-50 dark:bg-red-900/30 p-1.5 rounded text-opacity-90 dark:text-opacity-90">
                "{item.original}"
              </p>
            </div>

            <div className="mb-2 sm:mb-3">
              <p className="text-xs text-codex-light-text-dim dark:text-codex-dark-text-dim mb-0.5">Suggestion:</p>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 p-1.5 rounded">
                "{item.suggestion}"
              </p>
            </div>
            
            <div>
              <p className="text-xs text-codex-light-text-dim dark:text-codex-dark-text-dim mb-0.5">Reason:</p>
              <p className="text-sm text-codex-light-text dark:text-codex-dark-text">
                {item.reason}
              </p>
            </div>
            {/* Future: Add "Apply Suggestion" button here */}
          </div>
        ))}
      </div>
    </div>
  );
};

const PencilSwooshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export default EditorAnalysisTab;