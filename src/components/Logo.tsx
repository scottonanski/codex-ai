import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => (
  <div className={className} style={{ fontWeight: 'bold', fontSize: 24 }}>
    <span className="text-primary">Codex</span>
    <span className="text-primary">Ai</span>
    </div>
);


export default Logo;
