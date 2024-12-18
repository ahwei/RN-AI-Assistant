import AIStreamingBubble from '@/components/chat/AIStreamingBubble';
import ChatInput from '@/components/chat/ChatInput';
import ExpertSelector from '@/components/chat/ExpertSelector';
import MessageBubble from '@/components/chat/MessageBubble';
import { useChatList } from '@/contexts/ChatContext';
import { useAddMessage, useGetExperts, useGetMessages } from '@/hooks/useChat'; // 移除 useSendMessage
import { ChatIdEnum } from '@/types/chat';
import { IMessage, Sender } from '@/types/messages';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ChatRoom = () => {
  const { chatId } = useLocalSearchParams();

  const { createNewChatRoom, isLoading: isLoadingChatList } = useChatList();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedExperts, setSelectedExperts] = useState<number[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { data: messageHistory = [], isLoading } = useGetMessages(Number(chatId));
  const { data: experts } = useGetExperts();

  const { mutateAsync: addMessageMutate, isLoading: isAddingMessage } = useAddMessage();
  const [localMessages, setLocalMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setLocalMessages([]);
  }, [chatId]);

  const formattedHistoryMessages: IMessage[] = messageHistory.map((msg: IMessage) => ({
    ...msg,
    timestamp: new Date(msg.timestamp).toLocaleTimeString(),
  }));

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
      if (chatId === ChatIdEnum.NEW_CHAT) {
        const newChatId = await createNewChatRoom();
        await addMessageMutate({ content: message, chartId: newChatId });
        router.setParams({ chatId: newChatId });
        return;
      }

      const newMessage: IMessage = {
        message_id: Date.now(),
        content: message,
        timestamp: new Date().toISOString(),
        sender: Sender.USER,
      };

      setLocalMessages(prev => [...prev, newMessage]);

      await addMessageMutate({
        content: message,
        chartId: Number(chatId),
      });

      if (selectedExperts.length > 0) {
        selectedExperts.forEach(expertId => {
          const aiMessage: IMessage = {
            message_id: Date.now() + expertId,
            content: '',
            timestamp: new Date().toISOString(),
            sender: Sender.STREAM,
            expert: experts?.find(e => e.expert_id === expertId),
          };
          setLocalMessages(prev => [...prev, aiMessage]);
        });
      }
    }
  };

  const handleScroll = (event: {
    nativeEvent: {
      contentOffset: { y: number };
      contentSize: { height: number };
      layoutMeasurement: { height: number };
    };
  }) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    const distanceFromBottom = contentHeight - currentOffset - scrollViewHeight;
    setShowScrollButton(distanceFromBottom > 100);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <ExpertSelector
        experts={experts || []}
        selectedExperts={selectedExperts}
        onSelectExpert={handleExpertSelect}
      />
      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {isLoading ? (
            <Text>Loading messages...</Text>
          ) : allMessages.length > 0 ? (
            allMessages.map(msg =>
              msg.sender === Sender.STREAM && msg.expert && chatId ? (
                <AIStreamingBubble
                  key={msg.message_id}
                  chatId={Number(chatId)}
                  expertId={msg.expert.expert_id}
                  message={msg}
                />
              ) : (
                <MessageBubble key={msg.message_id} message={msg} isMe={msg.sender === 'user'} />
              )
            )
          ) : (
            <MessageBubble
              isMe={false}
              message={{
                message_id: 0,
                sender: Sender.EXPERT,
                timestamp: new Date().toISOString(),
                content:
                  'Welcome to the AI Expert Chatbot! I can help you answer questions, provide suggestions, or have interesting conversations. How can I assist you today?',
                expert: {
                  expert_id: 0,
                  name: 'AI Expert Assistant',
                },
              }}
            />
          )}
        </ScrollView>
        {showScrollButton && (
          <TouchableOpacity style={styles.scrollButton} onPress={scrollToBottom}>
            <Ionicons name="chevron-down-circle" size={40} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
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
  scrollButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    bottom: 15,
    elevation: 5,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    padding: 10,
  },
});

export default ChatRoom;
