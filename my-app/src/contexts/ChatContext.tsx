import React, { createContext, useContext, useState } from 'react';

interface ChatContextProps {
  chatRooms: { id: number; label: string }[];
  addChatRoom: (label: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatRooms, setChatRooms] = useState([{ id: 1, label: 'Chat Room 1' }]);

  const addChatRoom = (label: string) => {
    const newId = chatRooms.length > 0 ? Math.max(...chatRooms.map(room => room.id)) + 1 : 1;
    setChatRooms([...chatRooms, { id: newId, label }]);
  };

  return <ChatContext.Provider value={{ chatRooms, addChatRoom }}>{children}</ChatContext.Provider>;
};

export const useChatList = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatList must be used within a ChatProvider');
  }
  return context;
};
