
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

export const TEMPLATES: Record<string, string[]> = {
  [DocumentType.CharacterSheet]: ['Role', 'Goal', 'Motivation', 'Flaw', 'Backstory'],
  [DocumentType.Location]: ['Description', 'Atmosphere', 'History', 'Key Points of Interest'],
  [DocumentType.Lore]: ['Summary', 'Rules', 'Impact on World'],
  [DocumentType.Research]: ['Source URL', 'Key Takeaways', 'Quotes', 'Notes'],
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
    children: [
      { 
        id: 'manuscript-1', 
        title: 'Chapter 1: The Awakening', 
        type: DocumentType.Manuscript, 
        icon: <ManuscriptIcon />, 
        level: 1,
        content: "The old house stood on a hill overlooking the town. It had stood there for a hundred years, and for all that time, it had been empty. Or so they said.\n\nElara pulled her cloak tighter. The wind was biting tonight, carrying the scent of rain and something else... something ancient and unsettling. She wasn't supposed to be here. Her grandmother had warned her, her voice a low tremor, 'Some doors are best left unopened, child.'\n\nBut Elara was not a child anymore. And this door, the one creaking softly on its hinges at the top of the hill, called to her."
      },
      { 
        id: 'manuscript-2', 
        title: 'Chapter 2: Whispers in the Dark', 
        type: DocumentType.Manuscript, 
        icon: <ManuscriptIcon />, 
        level: 1, 
        content: "Inside, dust lay thick as a shroud. Moonlight, fractured by grimy windowpanes, painted eerie shapes on the decaying furniture. Every footstep echoed in the oppressive silence. Then, she heard it - a whisper, faint as a dying breath, from the shadows at the end of the hall." 
      },
      { 
        id: 'manuscript-3', 
        title: 'Chapter 3: Unseen Eyes', 
        type: DocumentType.Manuscript, 
        icon: <ManuscriptIcon />, 
        level: 1, 
        content: "She froze, heart hammering against her ribs. The whisper came again, closer this time, seeming to swirl around her. It wasn't words she could understand, but a feeling... a cold dread mixed with an undeniable pull." 
      },
    ]
  },
  {
    id: 'folder-characters',
    title: 'Characters', 
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: true, 
    content: {},
    children: [
      { 
        id: 'char-elara', 
        title: 'Elara Meadowlight', 
        type: DocumentType.CharacterSheet, 
        icon: <CharacterIcon />,
        level: 1,
        content: {
          'Role': 'Protagonist',
          'Goal': 'Uncover the secrets of the abandoned house and her family\'s connection to it.',
          'Motivation': 'A recurring dream, a sense of belonging she can\'t explain, a desire to prove her grandmother wrong.',
          'Flaw': 'Impulsive and headstrong, often acts before thinking through the consequences.',
          'Backstory': 'Grew up hearing whispered tales about the house. Her family has a mysterious past tied to it. Feels like an outsider in her own village.'
        }
      },
    ]
  },
   {
    id: 'folder-locations',
    title: 'Locations', 
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: false,
    content: {},
    children: [
      { 
        id: 'loc-oldhouse', 
        title: 'The Old Hill House', 
        type: DocumentType.Location, 
        icon: <LocationIcon />,
        level: 1,
        content: {
          'Description': 'A dilapidated Victorian-era mansion on a windswept hill. Overgrown gardens, boarded-up windows on the lower floors. One window on the top floor seems to glow faintly at night.',
          'Atmosphere': 'Foreboding, mysterious, melancholic. Locals avoid it, especially after dark.',
          'History': 'The house was built by the eccentric inventor Alistair Blackwood in 1888. Blackwood vanished without a trace, leaving behind strange contraptions and rumors of forbidden experiments.',
          'Key Points of Interest': 'Grand oak door, winding staircase, a library filled with rotting books, a sealed room in the basement.'
        }
      },
    ]
  },
  {
    id: 'folder-lore',
    title: 'Lore', 
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: false,
    content: {},
    children: [
      { 
        id: 'lore-whispers', 
        title: 'The Whispering Sickness', 
        type: DocumentType.Lore, 
        icon: <LoreIcon />,
        level: 1,
        content: {
          'Summary': 'An ancient magical ailment or curse associated with the Old Hill House.',
          'Rules': 'Victims hear faint whispers, become paranoid, gradually lose their connection to reality. In advanced stages, they might speak in unknown tongues or exhibit strange powers. Physical contact with artifacts from the house can trigger it in susceptible individuals.',
          'Impact on World': 'The reason the house has remained abandoned for so long. The source of local legends and fear.'
        }
      },
    ]
  },
   {
    id: 'folder-research',
    title: 'Research & Notes', 
    type: 'Folder',
    icon: <FolderIcon />,
    level: 0,
    isOpen: false,
    content: {},
    children: [
      { 
        id: 'research-history', 
        title: 'Local History Notes', 
        type: DocumentType.Research, 
        icon: <ResearchIcon />,
        level: 1,
        content: {
          'Source URL': 'Town Archives Digital Portal (link)',
          'Key Takeaways': 'House built 1888 by Alistair Blackwood. No record of sale since. Blackwood family line died out or moved away.',
          'Quotes': '"...the Blackwood estate, a place of sorrow and shadows..." - Local newspaper, 1923.',
          'Notes': '- Check town archives for records of the house\'s original owners.\n- Interview old Mrs. Gable - she\'s lived in the village her whole life, might know more stories.\n- Research local folklore related to hilltop dwellings and \'watchers\'.\n- Look into historical instances of \'mass hysteria\' or unexplained illnesses in the region.'
        }
      },
    ]
  },
];

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
