
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
    <div className="p-3 sm:p-4 flex flex-col h-full bg-base-100">
      {/* Show context injection message if present */}
      {injectedContextMessage && (
        <div className="mb-2 px-3 py-2 rounded bg-warning text-warning-content text-sm text-center font-medium animate-fade-in">
          {injectedContextMessage}
        </div>
      )}
      <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto pr-1 sm:pr-2 pb-2 mb-2 custom-scrollbar min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-2.5 sm:p-3 rounded-lg shadow-sm text-sm sm:text-[0.9rem] leading-snug
                ${msg.sender === 'ai' 
                ? 'bg-base-200 text-base-content rounded-tl-none sm:rounded-tl-none' 
                : 'bg-primary text-primary-content rounded-tr-none sm:rounded-tr-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.sender === 'ai' && msg.showAddButton && (
                <button
                  onClick={() => onAddToManuscript(msg.text)}
                  className="mt-8 text-xs font-medium flex items-center space-x-2 hover:opacity-100
                            text-primary-content hover:bg-primary hover:text-primary-content p-1.5 rounded-sm"
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
             <div className="max-w-[85%] p-2.5 sm:p-3 rounded-lg shadow-sm text-sm sm:text-[0.9rem] leading-snug bg-base-200 text-base-content rounded-tl-none sm:rounded-tl-none flex items-center space-x-2">
                <Loader size="sm" />
                <span>Muse is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      

      <form onSubmit={handleFormSubmit} className="mt-auto pt-3 border-t border-base-300 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => onUserInputChange(e.target.value)}
            placeholder="Chat with your Muse..."
            className="flex-1 p-2.5 border border-base-300 rounded-md bg-base-100 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm disabled:opacity-70"
            aria-label="Muse chat input"
            disabled={isLoading}
          />
          <button 
            type="submit"
            className="px-4 py-2.5 btn btn-primary text-base-content font-medium text-sm shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
