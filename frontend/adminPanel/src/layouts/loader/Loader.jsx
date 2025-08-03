import React from 'react';

const Loader = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  // Color classes
  const colorClasses = {
    primary: 'border-t-blue-500',
    secondary: 'border-t-gray-500',
    success: 'border-t-green-500',
    danger: 'border-t-red-500',
    warning: 'border-t-yellow-500',
    info: 'border-t-cyan-500',
    light: 'border-t-gray-200',
    dark: 'border-t-gray-800'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid border-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        style={{ animationDuration: '0.8s' }}
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;