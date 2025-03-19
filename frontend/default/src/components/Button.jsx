import React from 'react'
import PropTypes from "prop-types"

const Button = ({
    type = 'button',
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    loading = false,
    children,
    className = '',
    ...rest
  }) => {
    const baseClass = 'inline-flex items-center justify-center font-medium rounded';

    const variantClass = {
      primary:
      "bg-blue-500 text-white shadow-theme-xs hover:bg-blue-600 disabled:bg-brand-300",
      outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
      // primary: 'bg-blue-500 text-white hover:bg-blue-600',
      // secondary: 'bg-gray-500 text-white hover:bg-gray-600',
      delete: ' text-white bg-red-400 hover:bg-red-500 ',
    }[variant];
  
    const sizeClass = {
      sm: "px-4 py-3 text-sm",
      md: "px-5 py-3.5 text-sm",
      // sm: 'px-2 py-1 text-sm',
      // md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }[size];
  
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const loadingClass = loading ? 'opacity-75 cursor-wait' : '';
  
    return (
      <button
        type={type}
        className={`${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${loadingClass} ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <span className="loader mr-2"></span> // Add a loader/spinner if needed
        ) : null}
        {children}
      </button>
    );
  };
  
  Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'delete']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };
  
  export default Button;