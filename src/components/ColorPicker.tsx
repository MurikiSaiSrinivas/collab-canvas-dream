
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const PREDEFINED_COLORS = [
  '#33C3F0', // brand blue
  '#1EAEDB', // darker blue
  '#0EA5E9', // sky blue
  '#E5DEFF', // soft purple
  '#FDE1D3', // soft peach
  '#D3E4FD', // soft blue
  '#FFDEE2', // soft pink
  '#F97316', // orange
  '#22C55E', // green
  '#EF4444', // red
  '#000000', // black
  '#FFFFFF', // white
];

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="p-1 w-10 h-10 rounded-md"
          disabled={disabled}
        >
          <div 
            className="w-full h-full rounded-sm border border-gray-200" 
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-6 gap-2">
          {PREDEFINED_COLORS.map((c) => (
            <button
              key={c}
              className="w-8 h-8 rounded-md border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
              onClick={() => {
                onChange(c);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8"
          />
          <input 
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 p-2 text-sm border border-gray-200 rounded-md"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
