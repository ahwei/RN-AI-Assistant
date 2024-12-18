import { useExpertResponse } from '@/hooks/useChat';
import { IMessage, Sender } from '@/types/messages';
import React from 'react';
import MessageBubble from './MessageBubble';

interface AIStreamingBubbleProps {
  chatId: number;
  expertId: number;
  message: IMessage;
}

export const AIStreamingBubble = ({ chatId, expertId, message }: AIStreamingBubbleProps) => {
  const { data, isLoading, error } = useExpertResponse(chatId, expertId);

  if (error) {
    return (
      <MessageBubble
        message={{
          ...message,
          sender: Sender.EXPERT,
          content: 'Error occurred while loading response',
        }}
        isMe={false}
      />
    );
  }

  return (
    <MessageBubble
      message={{
        ...message,
        sender: Sender.EXPERT,
        content: isLoading && !data ? 'thinking...' : data || '',
      }}
      isMe={false}
    />
  );
};

export default AIStreamingBubble;
