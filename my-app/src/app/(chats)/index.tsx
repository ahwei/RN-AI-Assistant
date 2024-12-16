import ChatInput from '@/components/chat/ChatInput';
import MessageBubble from '@/components/chat/MessageBubble';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'AI BOT',
      text: 'Hello! I am ChatGPT, how can I assist you today?',
      timestamp: new Date().toLocaleTimeString(),
      isMe: false,
    },
    {
      id: 2,
      user: 'Me',
      text: 'Can you explain the React lifecycle?',
      timestamp: new Date().toLocaleTimeString(),
      isMe: true,
    },
    {
      id: 3,
      user: 'AI BOT',
      text: 'The React lifecycle consists of three main phases:\n\n1. **Mounting**\n- constructor()\n- render()\n- componentDidMount()\n\n2. **Updating**\n- shouldComponentUpdate()\n- render()\n- componentDidUpdate()\n\n3. **Unmounting**\n- componentWillUnmount()',
      timestamp: new Date().toLocaleTimeString(),
      isMe: false,
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: 'Me',
          text: message,
          timestamp: new Date().toLocaleTimeString(),
          isMe: true,
        },
      ]);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <MessageBubble key={msg.id} {...msg} />
        ))}
      </ScrollView>

      <ChatInput message={message} onChangeText={setMessage} onSend={sendMessage} />
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
