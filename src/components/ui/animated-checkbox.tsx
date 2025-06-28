
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  className,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'custom-checkbox',
        checked && 'checked',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-checked={checked}
      role="checkbox"
    >
      <div className="checkmark">
        <Check className="h-3 w-3" strokeWidth={3} />
      </div>
    </button>
  );
};
