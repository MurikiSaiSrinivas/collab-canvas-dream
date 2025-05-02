
import { create } from 'zustand';

export type DrawingTool = 'brush' | 'eraser' | 'colorPicker';
export type UserState = 'drawing' | 'ready';

interface DrawState {
  // Room state
  roomId: string | null;
  username: string;
  isRoomCreator: boolean;
  otherUser: string | null;
  userState: UserState;
  otherUserState: UserState | null;

  // Drawing state
  selectedTool: DrawingTool;
  brushColor: string;
  brushSize: number;
  canvasLocked: boolean;

  // Chat state
  messages: { id: string; sender: string; text: string; timestamp: Date }[];
  
  // Actions
  setRoomId: (roomId: string) => void;
  setUsername: (username: string) => void;
  setIsRoomCreator: (isCreator: boolean) => void;
  setOtherUser: (username: string | null) => void;
  setUserState: (state: UserState) => void;
  setOtherUserState: (state: UserState | null) => void;
  
  selectTool: (tool: DrawingTool) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  lockCanvas: () => void;
  unlockCanvas: () => void;
  
  addMessage: (sender: string, text: string) => void;
  resetState: () => void;
}

const initialState = {
  roomId: null,
  username: '',
  isRoomCreator: false,
  otherUser: null,
  userState: 'drawing' as UserState,
  otherUserState: null,
  
  selectedTool: 'brush' as DrawingTool,
  brushColor: '#33C3F0',
  brushSize: 5,
  canvasLocked: false,
  
  messages: []
};

export const useDrawStore = create<DrawState>((set) => ({
  ...initialState,
  
  setRoomId: (roomId) => set({ roomId }),
  setUsername: (username) => set({ username }),
  setIsRoomCreator: (isRoomCreator) => set({ isRoomCreator }),
  setOtherUser: (otherUser) => set({ otherUser }),
  setUserState: (userState) => set({ userState }),
  setOtherUserState: (otherUserState) => set({ otherUserState }),
  
  selectTool: (tool) => set({ selectedTool: tool }),
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  lockCanvas: () => set({ canvasLocked: true, userState: 'ready' }),
  unlockCanvas: () => set({ canvasLocked: false, userState: 'drawing' }),
  
  addMessage: (sender, text) => set((state) => ({
    messages: [
      ...state.messages,
      { id: Date.now().toString(), sender, text, timestamp: new Date() }
    ]
  })),
  
  resetState: () => set(initialState)
}));
