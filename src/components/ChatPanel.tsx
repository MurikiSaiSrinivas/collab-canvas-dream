
import React, { useState, useEffect, useRef } from 'react';
import { useDrawStore } from '@/store/useDrawStore';
import { useRoom } from '@/hooks/useRoom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ChatPanel: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, username, userState, otherUser, otherUserState } = useDrawStore();
  const { sendMessage } = useRoom();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-lg">Chat</h3>
        <div className="flex items-center gap-2">
          <UserStatus name={username} status={userState} isSelf />
          {otherUser && (
            <UserStatus name={otherUser} status={otherUserState || undefined} />
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "rounded-lg p-3 max-w-[80%]",
              message.sender === username 
                ? "bg-primary text-white ml-auto" 
                : "bg-gray-100 mr-auto"
            )}
          >
            <div className="text-xs opacity-75 mb-1">{message.sender}</div>
            <div>{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

interface UserStatusProps {
  name: string;
  status?: string;
  isSelf?: boolean;
}

const UserStatus: React.FC<UserStatusProps> = ({ name, status, isSelf }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end">
        <span className="text-xs font-medium">{isSelf ? "You" : name}</span>
        <Badge variant={status === 'ready' ? "default" : "outline"} className="text-xs">
          {status === 'ready' ? 'Ready' : 'Drawing'}
        </Badge>
      </div>
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
        {name.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default ChatPanel;
