import React from 'react';

export default function LinkifiedText({ children, className = "" }) {
  if (typeof children !== 'string') return <span className={className}>{children}</span>;

  // Regex to match URLs (starts with http:// or https://)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  const parts = children.split(urlRegex);
  
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a 
              key={i} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}
