
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCanvas } from '@/hooks/useCanvas';
import { useDrawStore } from '@/store/useDrawStore';
import { useRoom } from '@/hooks/useRoom';
import DrawingCanvas from '@/components/DrawingCanvas';
import ToolBar from '@/components/ToolBar';
import ChatPanel from '@/components/ChatPanel';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const { 
    username, 
    roomId: storeRoomId, 
    canvasLocked, 
    lockCanvas, 
    unlockCanvas, 
    userState, 
    otherUserState 
  } = useDrawStore();
  const { setUserReady } = useRoom();
  
  const {
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCanvas({ canvasId: 'drawing-canvas' });
  
  // Check if room exists in store
  useEffect(() => {
    if (!storeRoomId && roomId) {
      // If no roomId in store, redirect to home
      navigate('/');
      toast({
        variant: "destructive",
        title: "Error",
        description: "You need to create or join a room first"
      });
    }
  }, [storeRoomId, roomId, navigate]);
  
  // Check viewport size for layout
  useEffect(() => {
    const checkSize = () => {
      setIsMobileLayout(window.innerWidth < 768);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    
    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);
  
  // Check if both users are ready
  useEffect(() => {
    if (userState === 'ready' && otherUserState === 'ready') {
      // Both users are ready, navigate to result
      setTimeout(() => {
        navigate(`/result/${roomId}`);
      }, 1500);
      
      toast({
        title: "Both users are ready!",
        description: "Proceeding to image generation..."
      });
    }
  }, [userState, otherUserState, roomId, navigate]);
  
  const handleReadyClick = () => {
    if (canvasLocked) {
      unlockCanvas();
    } else {
      lockCanvas();
      setUserReady();
      
      toast({
        title: "You're ready!",
        description: "Waiting for the other user to finish"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-app-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">DrawSync</h1>
            <div className="text-sm text-gray-500">Room: {roomId} • User: {username}</div>
          </div>
          
          <div className="flex gap-2">
            {isMobileLayout && (
              <Button 
                variant="outline" 
                onClick={() => setShowChat(!showChat)}
              >
                {showChat ? "Show Canvas" : "Show Chat"}
              </Button>
            )}
            
            <Button 
              onClick={handleReadyClick}
              variant={userState === 'ready' ? "outline" : "default"}
            >
              {userState === 'ready' ? "Resume Drawing" : "I'm Done"}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div 
            className={`${isMobileLayout && showChat ? 'hidden' : 'flex flex-col gap-4'} flex-1`}
          >
            <ToolBar 
              onUndo={undo}
              onRedo={redo}
              onClear={clearCanvas}
              canUndo={canUndo}
              canRedo={canRedo}
            />
            <DrawingCanvas canvasId="drawing-canvas" />
          </div>
          
          <div 
            className={`${isMobileLayout && !showChat ? 'hidden' : 'block'} md:w-1/3 h-[500px] md:h-auto`}
          >
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
