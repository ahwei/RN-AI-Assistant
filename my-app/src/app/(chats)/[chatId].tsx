import AIStreamingBubble from '@/components/chat/AIStreamingBubble';
import ChatInput from '@/components/chat/ChatInput';
import ExpertSelector from '@/components/chat/ExpertSelector';
import MessageBubble from '@/components/chat/MessageBubble';
import { useChatList } from '@/contexts/ChatContext';
import { useAddMessage, useGetMessages } from '@/hooks/useChat'; // 移除 useSendMessage
import { defaultExperts } from '@/types/expert';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isMe: boolean;
  type: 'user' | 'ai' | 'streaming';
  expertId?: number;
  user?: string;
}

const ChatRoom = () => {
  const { chatId } = useLocalSearchParams();
  console.log('chatId', chatId);
  const { createNewChatRoom, isLoading: isLoadingChatList } = useChatList();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedExperts, setSelectedExperts] = useState<number[]>([]);

  const { data: messageHistory = [], isLoading } = useGetMessages(Number(chatId));
  const { mutateAsync: addMessageMutate, isLoading: isAddingMessage } = useAddMessage();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    setLocalMessages([]);
  }, [chatId]);

  const formattedHistoryMessages: Message[] = messageHistory.map(
    (msg: {
      message_id: string;
      content: string;
      timestamp: string | number | Date;
      sender: string;
    }) => ({
      id: msg.message_id,
      text: msg.content,
      timestamp: new Date(msg.timestamp).toLocaleTimeString(),
      isMe: msg.sender === 'user',
      type: msg.sender === 'user' ? 'user' : 'ai',
      user: msg.sender === 'user' ? 'You' : 'AI',
    })
  );

  const allMessages = [...formattedHistoryMessages, ...localMessages];

  const handleExpertSelect = (expertId: number) => {
    setSelectedExperts(prev => {
      if (prev.includes(expertId)) {
        return prev.filter(id => id !== expertId);
      }
      return [...prev, expertId];
    });
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setMessage('');
      if (String(chatId) === 'new') {
        const newChatId = await createNewChatRoom();
        await addMessageMutate({ content: message, chartId: newChatId });
        router.setParams({ chatId: newChatId });
        return;
      }

      const newMessage: Message = {
        id: Date.now(),
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        isMe: true,
        type: 'user',
      };

      setLocalMessages(prev => [...prev, newMessage]);

      await addMessageMutate({
        content: message,
        chartId: Number(chatId),
      });

      if (selectedExperts.length > 0) {
        selectedExperts.forEach(expertId => {
          const aiMessage: Message = {
            id: Date.now() + expertId,
            text: '',
            timestamp: new Date().toLocaleTimeString(),
            isMe: false,
            type: 'streaming',
            expertId,
          };
          setLocalMessages(prev => [...prev, aiMessage]);
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <ExpertSelector
        experts={defaultExperts}
        selectedExperts={selectedExperts}
        onSelectExpert={handleExpertSelect}
      />
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {isLoading ? (
          <Text>Loading messages...</Text>
        ) : allMessages.length > 0 ? (
          allMessages.map(msg =>
            msg.type === 'streaming' && msg.expertId && chatId ? (
              <AIStreamingBubble key={msg.id} chatId={Number(chatId)} expertId={msg.expertId} />
            ) : (
              <MessageBubble key={msg.id} {...msg} />
            )
          )
        ) : (
          <MessageBubble
            title="AI Expert Assistant"
            text="Welcome to the AI Expert Chatbot! I can help you answer questions, provide suggestions, or have interesting conversations. How can I assist you today?"
            isMe={false}
          />
        )}
      </ScrollView>
      <ChatInput
        message={message}
        onChangeText={setMessage}
        onSend={handleSendMessage}
        disabled={isLoading || isLoadingChatList || isAddingMessage}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
});

export default ChatRoom;
