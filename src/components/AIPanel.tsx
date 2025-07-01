import React, { useState, useCallback, useEffect } from 'react';
import { BinderItem, AIPanelTab, ChatMessage, EditorSuggestion } from '../types';
import MuseChatTab from './MuseChatTab';
import EditorAnalysisTab from './EditorAnalysisTab';
import { getMuseChatResponse } from '../services/geminiService';
import { buildContextString } from '../services/contextService';

interface AIPanelProps {
  onAddToManuscript: (text: string) => void;
  editorSuggestions: EditorSuggestion[];
  isEditorAnalyzing: boolean;
  editorAnalysisError: string | null;
  binderItems: BinderItem[];
}

const AIPanel: React.FC<AIPanelProps> = ({ 
  onAddToManuscript,
  editorSuggestions,
  isEditorAnalyzing,
  editorAnalysisError,
  binderItems, 
}) => {
  const [activeTab, setActiveTab] = useState<AIPanelTab>('museChat'); 
  const [hasAutoSwitchedToEditor, setHasAutoSwitchedToEditor] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'muse-initial-greeting', sender: 'ai', text: "Hello! I'm your Muse. How can I help you brainstorm today?", showAddButton: true },
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isMuseChatLoading, setIsMuseChatLoading] = useState<boolean>(false);
  const [injectedContextMessage, setInjectedContextMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditorAnalyzing || editorSuggestions.length === 0) {
      setHasAutoSwitchedToEditor(false);
    }
  }, [isEditorAnalyzing, editorSuggestions.length]);

  useEffect(() => {
    if (
      editorSuggestions.length > 0 &&
      !isEditorAnalyzing &&
      !editorAnalysisError &&
      !hasAutoSwitchedToEditor 
    ) {
      setActiveTab('editorAnalysis');
      setHasAutoSwitchedToEditor(true); 
    }
  }, [editorSuggestions, isEditorAnalyzing, editorAnalysisError, hasAutoSwitchedToEditor, setActiveTab, setHasAutoSwitchedToEditor]);

  const handleUserInputChange = (text: string) => {
    setUserInput(text);
  };

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = userInput.trim();
    if (trimmedInput === '') return;

    const { contextString, mentionedItemTitles } = buildContextString(trimmedInput, binderItems);

    if (mentionedItemTitles.length > 0) {
      setInjectedContextMessage(`✨ Context injected: ${mentionedItemTitles.join(', ')}`);
      setTimeout(() => setInjectedContextMessage(null), 4000); 
    }

    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: trimmedInput,
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserInput('');
    setIsMuseChatLoading(true);

    const historyForAI = [...messages, newUserMessage];

    try {
      const aiResponseText = await getMuseChatResponse(historyForAI, contextString);
      
      const newAiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}-ai`,
        sender: 'ai',
        text: aiResponseText,
        showAddButton: true,
      };
      setMessages(prevMessages => [...prevMessages, newAiMessage]);
    } catch (error) { 
      console.error("Error in handleSendMessage:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred contacting Muse Chat.";
      const errorAiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}-ai-error`,
        sender: 'ai',
        text: `Sorry, something went wrong with Muse Chat: ${errorMessage}`,
        showAddButton: false,
      };
      setMessages(prevMessages => [...prevMessages, errorAiMessage]);
    } finally {
      setIsMuseChatLoading(false);
    }
  }, [userInput, messages, binderItems]); 

  return (
    <aside className="w-[25%] min-w-[300px] max-w-[450px] flex-shrink-0 bg-base-200 border-l border-base-300 p-0 flex flex-col shadow-md text-base-content">
      <div className="flex border-b border-base-300 flex-shrink-0" role="tablist" aria-label="AI Tools">
        <TabButton
          label="Muse Chat"
          isActive={activeTab === 'museChat'}
          onClick={() => setActiveTab('museChat')}
          aria-controls="muse-chat-panel"
          id="muse-chat-tab"
        />
        <TabButton
          label="Editor Analysis"
          isActive={activeTab === 'editorAnalysis'}
          onClick={() => setActiveTab('editorAnalysis')}
          aria-controls="editor-analysis-panel"
          id="editor-analysis-tab"
          // Add a visual cue if analysis is happening or has results and tab is not active
          showIndicator={(isEditorAnalyzing || (editorSuggestions.length > 0 || editorAnalysisError !== null)) && activeTab !== 'editorAnalysis'}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'museChat' && (
          <div id="muse-chat-panel" role="tabpanel" aria-labelledby="muse-chat-tab" className="h-full">
            <MuseChatTab 
              messages={messages}
              userInput={userInput}
              isLoading={isMuseChatLoading}
              onUserInputChange={handleUserInputChange}
              onSendMessage={handleSendMessage}
              onAddToManuscript={onAddToManuscript} 
              // <-- 6. Pass the new message down to the chat UI -->
              injectedContextMessage={injectedContextMessage}
            />
          </div>
        )}
        {activeTab === 'editorAnalysis' && (
          <div id="editor-analysis-panel" role="tabpanel" aria-labelledby="editor-analysis-tab" className="h-full">
            <EditorAnalysisTab 
              suggestions={editorSuggestions}
              isLoading={isEditorAnalyzing}
              error={editorAnalysisError}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive: boolean;
  showIndicator?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, showIndicator, ...rest }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium focus:outline-none w-1/2 transition-colors duration-150 relative
      ${isActive 
        ? 'border-b-2 border-codex-primary text-codex-primary dark:text-codex-primary bg-codex-light dark:bg-codex-dark' 
        : 'text-codex-light-text-dim dark:text-codex-dark-text-dim hover:bg-codex-light-darker/70 dark:hover:bg-codex-dark-lighter/70 hover:text-codex-light-text dark:hover:text-codex-dark-text'
      }`}
    role="tab"
    aria-selected={isActive}
    {...rest}
  >
    {label}
    {showIndicator && ( 
      <span className="absolute top-2 right-2 w-2 h-2 bg-codex-primary rounded-full"></span>
    )}
  </button>
);

export default AIPanel;
