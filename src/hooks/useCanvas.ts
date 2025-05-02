
import { useRef, useEffect, useState } from 'react';
import { useDrawStore, DrawingTool } from '../store/useDrawStore';

interface UseCanvasProps {
  canvasId: string;
  width?: number;
  height?: number;
}

export function useCanvas({ canvasId, width = 800, height = 600 }: UseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  
  const brushColor = useDrawStore(state => state.brushColor);
  const brushSize = useDrawStore(state => state.brushSize);
  const selectedTool = useDrawStore(state => state.selectedTool);
  const canvasLocked = useDrawStore(state => state.canvasLocked);
  
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    
    canvasRef.current = canvas;
    canvas.width = width;
    canvas.height = height;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    contextRef.current = context;
    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    
    // Create initial snapshot for history
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasHistory([initialState]);
    setHistoryIndex(0);
  }, [canvasId, width, height]);
  
  // Update context when brush properties change
  useEffect(() => {
    if (!contextRef.current) return;
    
    contextRef.current.strokeStyle = selectedTool === 'eraser' ? '#FFFFFF' : brushColor;
    contextRef.current.lineWidth = brushSize;
  }, [brushColor, brushSize, selectedTool]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasLocked || !contextRef.current || !canvasRef.current) return;
    
    isDrawing.current = true;
    
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || canvasLocked || !contextRef.current) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  
  const stopDrawing = () => {
    if (!isDrawing.current || !contextRef.current || !canvasRef.current) return;
    
    contextRef.current.closePath();
    isDrawing.current = false;
    
    // Save to history
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const newState = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
      
      // Remove any states after current index (if user drew after undoing)
      const newHistory = canvasHistory.slice(0, historyIndex + 1);
      newHistory.push(newState);
      
      setCanvasHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };
  
  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add to history
    const clearedState = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = [...canvasHistory, clearedState];
    setCanvasHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const undo = () => {
    if (historyIndex <= 0 || !contextRef.current || !canvasRef.current) return;
    
    const newIndex = historyIndex - 1;
    const canvas = canvasRef.current;
    contextRef.current.putImageData(canvasHistory[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };
  
  const redo = () => {
    if (historyIndex >= canvasHistory.length - 1 || !contextRef.current || !canvasRef.current) return;
    
    const newIndex = historyIndex + 1;
    const canvas = canvasRef.current;
    contextRef.current.putImageData(canvasHistory[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < canvasHistory.length - 1;
  
  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo
  };
}
