import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => (
  <button onClick={onToggle}>Toggle Theme (Current: {theme})</button>
);

export default ThemeToggle;
