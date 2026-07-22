import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  const IconComponent = (Icons as unknown as Record<string, React.FC<{ className?: string; size?: number }>>)[name] || Icons.Tag;
  return <IconComponent className={className} size={size} />;
};
