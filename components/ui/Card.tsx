
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-900/70 rounded-xl shadow-md overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return <div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props}>{children}</div>;
}

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return <div className={`p-4 sm:p-6 ${className}`} {...props}>{children}</div>;
}

export const CardFooter: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return <div className={`p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 ${className}`} {...props}>{children}</div>;
}
