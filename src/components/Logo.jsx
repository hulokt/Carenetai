import React from 'react';
import logoImage from '../assets/Carenetai_logo.png';

const Logo = ({ size = 'default', className = '', showText = true }) => {
  const sizes = {
    small: { width: 'w-8', height: 'h-8', text: 'text-base' },
    default: { width: 'w-10', height: 'h-10', text: 'text-xl' },
    large: { width: 'w-12', height: 'h-12', text: 'text-2xl' },
    xlarge: { width: 'w-16', height: 'h-16', text: 'text-3xl' },
    huge: { width: 'w-24', height: 'h-24', text: 'text-5xl' }
  };

  const { width, height, text } = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Carenetai Logo Image */}
      <div className="relative group">
        <img
          src={logoImage}
          alt="Carenetai Logo"
          className={`${width} ${height} object-contain transition-transform duration-300 group-hover:scale-110`}
        />
      </div>

      {/* Brand Name */}
      {showText && (
        <div className="flex flex-col justify-center">
          <h1 className={`font-jakarta font-bold ${text} leading-tight`} style={{ color: '#1F4E89' }}>
            Carenetai
          </h1>
          <p className="text-xs text-gray-500 font-medium -mt-0.5">A community for cancer</p>
        </div>
      )}
    </div>
  );
};

export default Logo;
