
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private callbacks: { [event: string]: Function[] } = {};

  connect(url: string = 'https://mock-socket-server.com') {
    // In a real app, this would connect to your actual socket server
    // For now, we'll simulate socket behavior in-memory
    console.log('Connecting to socket service...');
    
    // Normally we'd connect to a real server
    // this.socket = io(url);
    
    // Instead, we'll simulate socket events for the prototype
    setTimeout(() => {
      this.trigger('connect');
      console.log('Socket connected (simulated)');
    }, 500);

    return this;
  }

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
    return this;
  }

  off(event: string, callback: Function) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
    return this;
  }

  // Used for our mock implementation to trigger events
  trigger(event: string, ...args: any[]) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        callback(...args);
      });
    }
  }

  emit(event: string, data: any) {
    console.log(`Emitting ${event}:`, data);
    
    // In a real implementation, this would send to the server
    // if (this.socket) {
    //   this.socket.emit(event, data);
    // }
    
    // For the prototype, we'll simulate responses
    switch (event) {
      case 'join_room':
        setTimeout(() => {
          this.trigger('room_joined', { roomId: data.roomId, username: data.username });
        }, 300);
        break;
        
      case 'create_room':
        setTimeout(() => {
          this.trigger('room_created', { roomId: data.roomId, username: data.username });
        }, 300);
        break;
        
      case 'send_message':
        setTimeout(() => {
          this.trigger('new_message', {
            sender: data.sender,
            text: data.text,
            timestamp: new Date()
          });
        }, 200);
        break;
        
      case 'user_ready':
        setTimeout(() => {
          this.trigger('other_user_ready', { username: data.username });
        }, 200);
        break;

      default:
        break;
    }
  }

  disconnect() {
    console.log('Disconnecting from socket');
    this.callbacks = {};
    // if (this.socket) {
    //   this.socket.disconnect();
    // }
    this.socket = null;
  }
}

export const socketService = new SocketService();
