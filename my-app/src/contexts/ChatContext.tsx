import React, { createContext, useContext, useState } from 'react';

interface ChatContextProps {
  chatRooms: { id: number; label: string }[];
  addChatRoom: (label: string) => number;
  currentRoomId: number | null;
  setCurrentRoomId: (id: number | null) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatRooms, setChatRooms] = useState<{ id: number; label: string }[]>([
    { id: 1, label: 'Chat Room 1' },
    { id: 2, label: 'Chat Room 2' },
  ]);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);

  const addChatRoom = (label: string) => {
    const newId = chatRooms.length > 0 ? Math.max(...chatRooms.map(room => room.id)) + 1 : 1;
    const newRoom = { id: newId, label };
    setChatRooms([...chatRooms, newRoom]);
    return newId;
  };

  return (
    <ChatContext.Provider value={{ chatRooms, addChatRoom, currentRoomId, setCurrentRoomId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatList = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatList must be used within a ChatProvider');
  }
  return context;
};
