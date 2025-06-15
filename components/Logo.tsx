
import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Simplified book/quill concept */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.7 }} />
      </linearGradient>
    </defs>
    
    {/* Open Book Shape */}
    <path 
      d="M 30 170 Q 30 20, 100 40 Q 170 20, 170 170 L 100 150 Z" 
      fill="url(#logoGradient)"
      stroke="currentColor" 
      strokeWidth="5"
      opacity="0.6"
    />
    <path 
      d="M 100 40 V 150" 
      stroke="currentColor" 
      strokeWidth="5"
      opacity="0.6"
    />

    {/* Stylized Quill/Pen */}
    <path 
      d="M 120 50 Q 140 70, 110 100 T 80 150 L 70 140 Q 100 90, 130 60 Z"
      fill="currentColor"
      transform="rotate(-15 100 100)"
      opacity="0.9"
    />
    <circle cx="125" cy="55" r="8" fill="currentColor" opacity="0.9" transform="rotate(-15 100 100)" />
  </svg>
);

export default Logo;
