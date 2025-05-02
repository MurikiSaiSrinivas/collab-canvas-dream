
import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';
import { useDrawStore } from '../store/useDrawStore';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

export function useRoom() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    roomId,
    username,
    setRoomId,
    setUsername,
    setIsRoomCreator,
    setOtherUser,
    addMessage,
    setOtherUserState
  } = useDrawStore();
  
  useEffect(() => {
    // Connect to socket service
    socketService.connect()
      .on('connect', () => {
        setIsConnected(true);
      })
      .on('room_created', (data) => {
        toast({
          title: "Room Created",
          description: `Room ${data.roomId} has been created. Waiting for another user to join.`
        });
        setIsConnecting(false);
      })
      .on('room_joined', (data) => {
        toast({
          title: "Room Joined",
          description: `Successfully joined room ${data.roomId}.`
        });
        setIsConnecting(false);
      })
      .on('user_joined', (data) => {
        toast({
          title: "User Joined",
          description: `${data.username} has joined the room.`
        });
        setOtherUser(data.username);
      })
      .on('user_left', (data) => {
        toast({
          title: "User Left",
          description: `${data.username} has left the room.`
        });
        setOtherUser(null);
      })
      .on('new_message', (data) => {
        addMessage(data.sender, data.text);
      })
      .on('other_user_ready', (data) => {
        setOtherUserState('ready');
        toast({
          description: `${data.username} is ready!`
        });
      })
      .on('error', (error) => {
        setError(error.message);
        setIsConnecting(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      });
      
    return () => {
      socketService.disconnect();
    };
  }, []);
  
  const createRoom = (username: string) => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    setError(null);
    setIsConnecting(true);
    
    const newRoomId = nanoid(6).toUpperCase();
    setRoomId(newRoomId);
    setUsername(username);
    setIsRoomCreator(true);
    
    socketService.emit('create_room', { roomId: newRoomId, username });
    
    return newRoomId;
  };
  
  const joinRoom = (roomId: string, username: string) => {
    if (!roomId.trim() || !username.trim()) {
      setError('Room ID and username are required');
      return;
    }
    
    setError(null);
    setIsConnecting(true);
    
    setRoomId(roomId);
    setUsername(username);
    setIsRoomCreator(false);
    
    socketService.emit('join_room', { roomId, username });
  };
  
  const sendMessage = (text: string) => {
    if (!text.trim() || !roomId || !username) return;
    
    socketService.emit('send_message', {
      roomId,
      sender: username,
      text
    });
    
    // Add message to local state immediately (optimistic update)
    addMessage(username, text);
  };
  
  const setUserReady = () => {
    if (!roomId || !username) return;
    
    socketService.emit('user_ready', {
      roomId,
      username
    });
  };
  
  return {
    createRoom,
    joinRoom,
    sendMessage,
    setUserReady,
    isConnecting,
    isConnected,
    error
  };
}
