'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  divider?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

export function Dropdown({ 
  trigger, 
  options, 
  onSelect, 
  placement = 'bottom-start',
  className 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (option: DropdownOption) => {
    if (!option.disabled && !option.divider) {
      onSelect(option.value);
      setIsOpen(false);
    }
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case 'bottom-end':
        return 'top-full right-0 mt-1';
      case 'top-start':
        return 'bottom-full left-0 mb-1';
      case 'top-end':
        return 'bottom-full right-0 mb-1';
      default:
        return 'top-full left-0 mt-1';
    }
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg py-1',
            getPlacementClasses()
          )}
        >
          {options.map((option, index) => (
            <div key={index}>
              {option.divider ? (
                <div className="border-t border-gray-200 my-1" />
              ) : (
                <button
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors',
                    option.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                  )}
                  onClick={() => handleOptionClick(option)}
                  disabled={option.disabled}
                >
                  {option.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

