
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
