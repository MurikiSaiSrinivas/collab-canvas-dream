
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRoom } from '@/hooks/useRoom';

const Index = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const { createRoom, joinRoom, isConnecting, error } = useRoom();
  const navigate = useNavigate();
  
  const handleCreateRoom = () => {
    const newRoomId = createRoom(username);
    if (newRoomId) {
      navigate(`/room/${newRoomId}`);
    }
  };
  
  const handleJoinRoom = () => {
    joinRoom(roomId, username);
    navigate(`/room/${roomId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-app-text">
            VibeCanva
          </h1>
          <p className="text-gray-600">
            Collaborative drawing and image generation
          </p>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Start Drawing</CardTitle>
            <CardDescription>
              Create a new room or join an existing one to start collaborating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="create">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="create">Create Room</TabsTrigger>
                <TabsTrigger value="join">Join Room</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username-create">Your Name</Label>
                    <Input 
                      id="username-create" 
                      placeholder="Enter your name" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isConnecting}
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleCreateRoom} 
                    disabled={!username.trim() || isConnecting}
                  >
                    {isConnecting ? 'Creating Room...' : 'Create New Room'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="join">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-id">Room Code</Label>
                    <Input 
                      id="room-id" 
                      placeholder="Enter 6-letter room code" 
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      maxLength={6}
                      disabled={isConnecting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username-join">Your Name</Label>
                    <Input 
                      id="username-join" 
                      placeholder="Enter your name" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isConnecting}
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleJoinRoom} 
                    disabled={!roomId.trim() || !username.trim() || isConnecting}
                  >
                    {isConnecting ? 'Joining Room...' : 'Join Room'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            Create or join a room to start your collaboration!
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
