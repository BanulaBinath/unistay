import React from 'react';
import './LoadingButton.css';

const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  onClick,
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'loading-button',
    `loading-button-${variant}`,
    `loading-button-${size}`,
    fullWidth ? 'loading-button-full' : '',
    loading ? 'loading-button-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="loading-button-spinner">
          <svg viewBox="0 0 24 24" fill="none">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset="60"
            />
          </svg>
        </span>
      )}
      <span className={loading ? 'loading-button-text-hidden' : ''}>
        {children}
      </span>
    </button>
  );
};

export default LoadingButton;
