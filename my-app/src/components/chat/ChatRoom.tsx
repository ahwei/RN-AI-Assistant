import AIStreamingBubble from '@/components/chat/AIStreamingBubble';
import ChatInput from '@/components/chat/ChatInput';
import ExpertSelector from '@/components/chat/ExpertSelector';
import MessageBubble from '@/components/chat/MessageBubble';
import { useSendMessage } from '@/hooks/useChat';
import { defaultExperts } from '@/types/expert';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

interface Message {
  id: number;
  text: string;
  timestamp: string;
  isMe: boolean;
  type: 'normal' | 'streaming';
  expertId?: number;
  user?: string;
}

interface ChatRoomProps {
  chatId?: number;
  userId?: number;
}

const ChatRoom = ({ chatId }: ChatRoomProps) => {
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I am ChatGPT, how can I assist you today?',
      timestamp: new Date().toLocaleTimeString(),
      isMe: false,
      type: 'normal',
      user: 'AI',
    },
    {
      id: 2,
      text: 'Can you explain the React lifecycle?',
      timestamp: new Date().toLocaleTimeString(),
      isMe: true,
      type: 'normal',
      user: 'Ahwei',
    },
    {
      id: 3,
      text: 'The React lifecycle consists of three main phases:\n\n1. **Mounting**\n- constructor()\n- render()\n- componentDidMount()\n\n2. **Updating**\n- shouldComponentUpdate()\n- render()\n- componentDidUpdate()\n\n3. **Unmounting**\n- componentWillUnmount()',
      timestamp: new Date().toLocaleTimeString(),
      isMe: false,
      type: 'normal',
      user: 'AI',
    },
  ]);
  const [selectedExperts, setSelectedExperts] = useState<number[]>([]);

  const { mutate: sendMessage } = useSendMessage();

  const handleExpertSelect = (expertId: number) => {
    setSelectedExperts(prev => {
      if (prev.includes(expertId)) {
        return prev.filter(id => id !== expertId);
      }
      return [...prev, expertId];
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        isMe: true,
        type: 'normal',
      };

      setMessages(prev => [...prev, newMessage]);

      sendMessage({
        chatId: 1,
        userId: 1,
        content: message,
      });

      setMessage('');

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
      <Text>chatId: {chatId}</Text>
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
        {messages.map(msg =>
          msg.type === 'streaming' && msg.expertId ? (
            <AIStreamingBubble key={msg.id} chatId={1} expertId={msg.expertId} />
          ) : (
            <MessageBubble key={msg.id} {...msg} />
          )
        )}
      </ScrollView>
      <ChatInput message={message} onChangeText={setMessage} onSend={handleSendMessage} />
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
