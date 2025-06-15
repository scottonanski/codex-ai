import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => (
  <div className={className} style={{ fontWeight: 'bold', fontSize: 24 }}>Codex Logo</div>
);


export default Logo;
