import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ 
  variant = 'light', 
  size = 'md', 
  showText = true, 
  className = '' 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src={variant === 'light' ? '/logo9001app.png.png' : '/logo29001app.png.png'}
          alt="9001app Logo"
          fill
          sizes="(max-width: 768px) 32px, (max-width: 1024px) 48px, 64px"
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
            9001app
          </span>
          <span className="text-xs text-gray-500 hidden sm:block">
            ISO 9001 Quality Management
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;

