
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { AddIcon } from '../constants'; 
import Loader from '../components/Loader';

interface MuseChatTabProps {
  messages: ChatMessage[];
  userInput: string;
  isLoading: boolean;
  // chatError?: string | null; // Optional: if errors are to be displayed directly here
  onUserInputChange: (text: string) => void;
  onSendMessage: () => void;
  onAddToManuscript: (text: string) => void;
  injectedContextMessage?: string | null; // <-- New prop for context feedback -->
}

const MuseChatTab: React.FC<MuseChatTabProps> = ({ 
  messages,
  userInput,
  isLoading,
  // chatError,
  onUserInputChange,
  onSendMessage,
  onAddToManuscript,
  injectedContextMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSendMessage();
    }
  };

  return (
    <div className="p-3 sm:p-4 flex flex-col h-full bg-codex-light dark:bg-codex-dark">
      {/* Show context injection message if present */}
      {injectedContextMessage && (
        <div className="mb-2 px-3 py-2 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 text-sm text-center font-medium animate-fade-in">
          {injectedContextMessage}
        </div>
      )}
      <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto pr-1 sm:pr-2 pb-2 mb-2 custom-scrollbar min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-2.5 sm:p-3 rounded-lg shadow-sm text-sm sm:text-[0.9rem] leading-snug
                ${msg.sender === 'ai' 
                ? 'bg-codex-light-darker dark:bg-codex-dark-lighter text-codex-light-text dark:text-codex-dark-text rounded-tl-none sm:rounded-tl-none' 
                : 'bg-codex-primary text-white rounded-tr-none sm:rounded-tr-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.sender === 'ai' && msg.showAddButton && (
                <button
                  onClick={() => onAddToManuscript(msg.text)}
                  className="mt-2 text-xs flex items-center space-x-1.5 opacity-75 hover:opacity-100 transition-opacity
                             bg-transparent hover:bg-black/10 dark:hover:bg-white/10 p-1.5 rounded
                             text-codex-light-text-dim dark:text-codex-dark-text-dim hover:text-codex-light-text dark:hover:text-codex-dark-text"
                  title="Add to manuscript"
                  aria-label="Add AI response to manuscript"
                >
                  <AddIcon className="w-3.5 h-3.5"/> 
                  <span>Add to Manuscript</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-[85%] p-2.5 sm:p-3 rounded-lg shadow-sm text-sm sm:text-[0.9rem] leading-snug bg-codex-light-darker dark:bg-codex-dark-lighter text-codex-light-text dark:text-codex-dark-text rounded-tl-none sm:rounded-tl-none flex items-center space-x-2">
                <Loader size="sm" />
                <span>Muse is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Optional: Display chatError if passed and handled here
      {chatError && (
        <div className="my-2 p-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/50 rounded-md text-xs">
          {chatError}
        </div>
      )} */}

      <form onSubmit={handleFormSubmit} className="mt-auto pt-3 border-t border-codex-light-darker dark:border-codex-dark-lighter flex-shrink-0">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => onUserInputChange(e.target.value)}
            placeholder="Chat with your Muse..."
            className="flex-1 p-2.5 border border-codex-light-darker dark:border-codex-dark-lighter rounded-md bg-codex-light dark:bg-codex-dark focus:ring-1 focus:ring-codex-primary focus:border-codex-primary outline-none text-sm disabled:opacity-70"
            aria-label="Muse chat input"
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="px-4 py-2.5 bg-codex-primary hover:bg-codex-primary-dark text-white font-medium rounded-md text-sm shadow focus:outline-none focus:ring-2 focus:ring-codex-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? <Loader size="sm" color="text-white"/> : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MuseChatTab;
