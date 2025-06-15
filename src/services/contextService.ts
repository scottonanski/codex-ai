
// src/services/contextService.ts

import { BinderItem, DocumentType } from "../types";

// --- REFINED a: Filter out empty fields for cleaner context ---
const formatItemContent = (item: BinderItem): string => {
  const typeLabel = Object.keys(DocumentType).find(key => DocumentType[key as keyof typeof DocumentType] === item.type) || 'Document';

  if (typeof item.content === 'object' && item.content !== null) {
    const fields = Object.entries(item.content)
      // Only include fields that have a non-empty value
      .filter(([, value]) => value && value.trim() !== '') 
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join('\n');
      
    // If all fields were empty, don't return a useless block
    if (fields.trim() === '') return ''; 

    return `[${typeLabel}: ${item.title}]\n${fields}`;
  }
  return `[${typeLabel}: ${item.title}]\n${item.content}`;
};

// --- REFINED b: The search logic is now more robust ---
const findMentionedItemsRecursive = (
  userInput: string,
  items: BinderItem[]
): BinderItem[] => {
  let found: BinderItem[] = [];
  // Clean the user's input ONCE by removing punctuation and adding spaces
  const cleanUserInput = ` ${userInput.replace(/[.,!?;:()]/g, ' ')} `;

  for (const item of items) {
    // Check if the cleaned input includes the title, surrounded by spaces
    // This is more robust than a simple regex for this use case
    const titleToFind = ` ${item.title} `;
    
    if (item.type !== 'Folder' && cleanUserInput.toLowerCase().includes(titleToFind.toLowerCase())) {
      found.push(item);
    }

    if (item.children) {
      found = [...found, ...findMentionedItemsRecursive(userInput, item.children)];
    }
  }

  return found;
};


// Main function to be exported and used in the UI
export const buildContextString = (
  userInput: string,
  binderItems: BinderItem[]
): { contextString: string; mentionedItemTitles: string[] } => {
  console.log("ContextService: buildContextString called with userInput:", userInput);
  if (!userInput || binderItems.length === 0) {
    console.log("ContextService: No user input or no binder items, returning empty context.");
    return { contextString: '', mentionedItemTitles: [] };
  }
  const mentionedItems = findMentionedItemsRecursive(userInput, binderItems);

  if (mentionedItems.length === 0) {
    console.log("ContextService: No mentioned (template) items found in user input, returning empty context.");
    return { contextString: '', mentionedItemTitles: [] };
  }

  const contextParts = mentionedItems.map(formatItemContent).filter(part => part !== ''); // Filter out empty formatted parts
  const mentionedItemTitles = mentionedItems.map(item => item.title);

  const contextString = contextParts.join('\n---\n');

  console.log("ContextService: Final contextString being returned:", contextString);
  console.log("ContextService: MentionedItemTitles being returned:", mentionedItemTitles);

  return { contextString, mentionedItemTitles };
};
