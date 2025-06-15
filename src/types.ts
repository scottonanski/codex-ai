import React from 'react';

export enum DocumentType {
  Manuscript = "Manuscript Chapter",
  CharacterSheet = "Character Sheet",
  Location = "Location Profile",
  Lore = "Lore Entry",
  Research = "Research Note",
}

export type BinderItemType = DocumentType | 'Folder';

export interface BinderItem {
  id: string;
  title: string; // Changed from name
  type: BinderItemType;
  icon: React.ReactNode;
  content: string | Record<string, string>; // Changed from content?: string
  level: number; // For indentation
  children?: BinderItem[]; // For hierarchical structure
  isOpen?: boolean; // For toggling folder open/close state
}

export interface MuseSuggestion {
  id:string;
  text: string;
}

export type Theme = 'light' | 'dark';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  showAddButton?: boolean;
}

export type AIPanelTab = 'museChat' | 'editorAnalysis';

export interface EditorSuggestion {
  id: string; // Unique ID for React key
  original: string;
  suggestion: string;
  category: string; // e.g., "Clarity", "Conciseness", "Passive Voice", "Repetition"
  reason: string;
}