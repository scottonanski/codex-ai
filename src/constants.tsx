
import React from 'react';
import { BinderItem, DocumentType } from './types';

// SVG Icons
export const ManuscriptIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

export const CharacterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export const LocationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

export const LoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const ResearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
);

export const AddIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const PlotLinesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const TEMPLATES: Record<string, string[]> = {
  [DocumentType.CharacterSheet]: ['Role', 'Goal', 'Motivation', 'Flaw', 'Backstory'],
  [DocumentType.Location]: ['Description', 'Atmosphere', 'History', 'Key Points of Interest'],
  [DocumentType.Lore]: ['Summary', 'Rules', 'Impact on World'],
  [DocumentType.Research]: ['Source URL', 'Key Takeaways', 'Quotes', 'Notes'],
  [DocumentType.PlotLines]: ['Plot', 'Setting', 'Characters', 'Conflict', 'Resolution'],
};

export const getIconForItemType = (type: DocumentType): React.ReactNode => {
  switch (type) {
    case DocumentType.Manuscript:
      return <ManuscriptIcon />;
    case DocumentType.CharacterSheet:
      return <CharacterIcon />;
    case DocumentType.Location:
      return <LocationIcon />;
    case DocumentType.Lore:
      return <LoreIcon />;
    case DocumentType.Research:
      return <ResearchIcon />;
    case DocumentType.PlotLines:
      return <PlotLinesIcon />;
    default:
      // This case should ideally not be reached if all DocumentType values are handled above.
      // The exhaustive check pattern `const exhaustiveCheck: never = type;` can sometimes
      // cause issues if the compiler doesn't perfectly infer exhaustiveness.
      // We log a warning and provide a fallback icon.
      console.warn(`No icon defined for unhandled document type: ${String(type)}`);
      return <ManuscriptIcon />;
  }
};

export const INITIAL_BINDER_ITEMS: BinderItem[] = [
  {
    id: 'folder-manuscript',
    title: 'Manuscript',
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: true,
    content: {},
    children: [],
  },
  {
    id: 'folder-characters',
    title: 'Characters',
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: true,
    content: {},
    children: [],
  },
  {
    id: 'folder-locations',
    title: 'Locations',
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: false,
    content: {},
    children: [],
  },
  {
    id: 'folder-lore',
    title: 'Lore',
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: false,
    content: {},
    children: [],
  },
  {
    id: 'folder-research',
    title: 'Research & Notes',
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: false,
    content: {},
    children: [],
  },
  {
    id: 'folder-plot-lines',
    title: 'Plot Lines',
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: false,
    content: {},
    children: [],
  },
];


export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
