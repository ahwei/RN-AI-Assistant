import { useExpertResponse } from '@/hooks/useChat';
import React from 'react';
import MessageBubble from './MessageBubble';

interface AIStreamingBubbleProps {
  chatId: number;
  expertId: number;
}

export const AIStreamingBubble = ({ chatId, expertId }: AIStreamingBubbleProps) => {
  const { data, isLoading, error } = useExpertResponse(chatId, expertId);

  if (error) {
    return (
      <MessageBubble
        title={`${expertId}`}
        isMe={false}
        text="Error occurred while loading response"
      />
    );
  }

  return (
    <MessageBubble
      title={`${expertId}`}
      isMe={false}
      text={isLoading && !data ? 'thinking...' : data}
    />
  );
};

export default AIStreamingBubble;
