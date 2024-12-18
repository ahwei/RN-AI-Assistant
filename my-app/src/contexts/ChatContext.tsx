import React, { createContext, useContext, useState } from 'react';
import { useCreateChatRoom, useGetUserChats } from '../hooks/useChat';

interface ChatContextProps {
  chatRooms: { chat_id: number; user_id: number }[];
  isLoading: boolean;
  error: Error | null;
  currentRoomId: number | null;
  setCurrentRoomId: (id: number | null) => void;
  createNewChatRoom: () => Promise<number>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const { data: chatRooms = [], isLoading, error, refetch } = useGetUserChats();

  const createChatRoom = useCreateChatRoom();

  const createNewChatRoom = async () => {
    const result = await createChatRoom.mutateAsync(1);

    await refetch();
    return result.chat_id;
  };

  return (
    <ChatContext.Provider
      value={{
        chatRooms,
        isLoading,
        error,
        currentRoomId,
        setCurrentRoomId,
        createNewChatRoom,
      }}
    >
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
