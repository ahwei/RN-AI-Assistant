import { useExpertResponse } from '@/hooks/useChat';
import React, { useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';

interface AIStreamingBubbleProps {
  chatId: number;
  expertId: number;
}

export const AIStreamingBubble = ({ chatId, expertId }: AIStreamingBubbleProps) => {
  const [accumulatedText, setAccumulatedText] = useState('');
  const { data: stream } = useExpertResponse(chatId, expertId);

  useEffect(() => {
    if (stream) {
      setAccumulatedText(prev => prev + stream);
    }
  }, [stream]);

  return (
    <MessageBubble title={`${expertId}`} isMe={false} text={accumulatedText || 'thinking...'} />
  );
};

export default AIStreamingBubble;
