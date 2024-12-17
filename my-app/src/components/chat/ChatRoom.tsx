import AIStreamingBubble from '@/components/chat/AIStreamingBubble';
import ChatInput from '@/components/chat/ChatInput';
import ExpertSelector from '@/components/chat/ExpertSelector';
import MessageBubble from '@/components/chat/MessageBubble';
import { useChatList } from '@/contexts/ChatContext';
import { useGetMessages, useSendMessage } from '@/hooks/useChat';
import { defaultExperts } from '@/types/expert';
import { useRouter } from 'expo-router';
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

interface ChatRoomProps {
  chatId?: number;
  userId?: number;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const { createNewChatRoom, isLoading: isLoadingChatList } = useChatList();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedExperts, setSelectedExperts] = useState<number[]>([]);

  const { data: messageHistory = [], isLoading } = useGetMessages(chatId);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (chatId && messageHistory && messageHistory.length > 0) {
      const formattedMessages: Message[] = messageHistory.map(
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

      const hasChanges = JSON.stringify(formattedMessages) !== JSON.stringify(messages);
      if (hasChanges) {
        setMessages(formattedMessages);
      }
    } else if (messages.length > 0) {
      setMessages([]);
    }
  }, [chatId, messageHistory, messages]);

  const { mutate: sendMessage } = useSendMessage();

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
      if (!chatId) {
        const newRoomId = await createNewChatRoom();
        console.log('newRoomId', newRoomId);
        router.push(`/(chats)/${newRoomId}`);
        return;
      }

      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        isMe: true,
        type: 'user',
      };

      setMessages(prev => [...prev, newMessage]);

      sendMessage({
        chatId,
        userId: 1,
        content: message,
      });

      if (selectedExperts.length > 0) {
        selectedExperts.forEach(expertId => {
          const aiMessage: Message = {
            id: messages.length + 2,
            text: '',
            timestamp: new Date().toLocaleTimeString(),
            isMe: false,
            type: 'streaming',
            expertId,
          };
          setMessages(prev => [...prev, aiMessage]);
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
        ) : messages.length > 0 ? (
          messages.map(msg =>
            msg.type === 'streaming' && msg.expertId && chatId ? (
              <AIStreamingBubble key={msg.id} chatId={chatId} expertId={msg.expertId} />
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
        disabled={isLoading || isLoadingChatList}
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
