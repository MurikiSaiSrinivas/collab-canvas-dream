
import React from 'react';
import { useDrawStore, DrawingTool } from '@/store/useDrawStore';
import { Button } from '@/components/ui/button';
import { Brush, Eraser, RotateCcw, RotateCw, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import ColorPicker from './ColorPicker';

interface ToolBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ToolBar: React.FC<ToolBarProps> = ({
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo
}) => {
  const { 
    selectedTool, 
    selectTool, 
    brushSize, 
    setBrushSize,
    brushColor,
    setBrushColor,
    canvasLocked
  } = useDrawStore();
  
  const tools: { id: DrawingTool; name: string; icon: React.ReactNode }[] = [
    { id: 'brush', name: 'Brush', icon: <Brush size={20} /> },
    { id: 'eraser', name: 'Eraser', icon: <Eraser size={20} /> }
  ];
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 mr-3">
        {tools.map(tool => (
          <Button
            key={tool.id}
            type="button"
            size="sm"
            variant={selectedTool === tool.id ? "default" : "outline"}
            onClick={() => selectTool(tool.id)}
            disabled={canvasLocked}
            className={cn(
              "flex items-center gap-1",
              selectedTool === tool.id && "bg-primary text-primary-foreground"
            )}
          >
            {tool.icon}
            <span>{tool.name}</span>
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ColorPicker 
          color={brushColor} 
          onChange={setBrushColor} 
          disabled={canvasLocked || selectedTool === 'eraser'} 
        />
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        <span className="text-sm font-medium">Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={e => setBrushSize(parseInt(e.target.value))}
          disabled={canvasLocked}
          className="w-24"
        />
        <span className="text-sm">{brushSize}px</span>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo || canvasLocked}
          className="px-2"
        >
          <RotateCcw size={18} />
          <span className="sr-only">Undo</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo || canvasLocked}
          className="px-2"
        >
          <RotateCw size={18} />
          <span className="sr-only">Redo</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={canvasLocked}
          className="px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash size={18} />
          <span className="sr-only">Clear</span>
        </Button>
      </div>
    </div>
  );
};

export default ToolBar;
