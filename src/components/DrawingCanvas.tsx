
import React, { useEffect } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { useDrawStore } from '@/store/useDrawStore';

interface DrawingCanvasProps {
  canvasId: string;
  width?: number;
  height?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  canvasId,
  width = 800,
  height = 600
}) => {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCanvas({ canvasId, width, height });
  
  const canvasLocked = useDrawStore(state => state.canvasLocked);
  
  // Fix cursor position by adjusting for any scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Function to handle resolution scaling
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      // Only update if dimensions have changed
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef, width, height]);
  
  return (
    <div className="relative">
      {canvasLocked && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg z-10">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <span className="text-lg font-medium">Canvas Locked</span>
          </div>
        </div>
      )}
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <canvas
          id={canvasId}
          ref={canvasRef}
          className="bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default DrawingCanvas;
