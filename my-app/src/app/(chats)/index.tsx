import { Avatar, Button, Input } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'ChatGPT',
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
      user: 'ChatGPT',
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
          <View
            key={msg.id}
            style={[styles.messageContainer, msg.isMe ? styles.myMessage : styles.otherMessage]}
          >
            {!msg.isMe && (
              <Avatar rounded size="small" source={require('@/assets/images/ai-icon.png')} />
            )}
            <View style={[styles.messageBubble, msg.isMe ? styles.myBubble : styles.otherBubble]}>
              <Text style={[styles.messageUser, msg.isMe && styles.myMessageUser]}>{msg.user}</Text>
              {msg.isMe ? (
                <Text style={[styles.messageText, msg.isMe && styles.myMessageText]}>
                  {msg.text}
                </Text>
              ) : (
                <Markdown
                  style={{
                    body: { ...styles.messageText, ...styles.markdownText },
                    heading1: styles.markdownHeading,
                    heading2: styles.markdownHeading,
                    heading3: styles.markdownHeading,
                    strong: styles.markdownStrong,
                    code_block: styles.markdownCode,
                  }}
                >
                  {msg.text}
                </Markdown>
              )}
              <Text style={[styles.messageTime, msg.isMe && styles.myMessageTime]}>
                {msg.timestamp}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          containerStyle={styles.input}
        />
        <Button title="Send" onPress={sendMessage} containerStyle={styles.button} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    width: 70,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  inputContainer: {
    borderTopColor: '#eee',
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: 10,
  },
  markdownCode: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    fontFamily: 'monospace',
    padding: 8,
  },
  markdownHeading: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  markdownStrong: {
    fontWeight: 'bold',
  },
  markdownText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
  },
  messageBubble: {
    borderRadius: 15,
    marginHorizontal: 10,
    maxWidth: '70%',
    padding: 10,
  },
  messageContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginVertical: 5,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    alignSelf: 'flex-end',
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  messageUser: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  myBubble: {
    backgroundColor: '#007AFF',
    marginLeft: 'auto',
  },
  myMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  myMessageTime: {
    color: '#FFFFFF',
  },
  myMessageUser: {
    color: '#FFFFFF',
  },
  otherBubble: {
    backgroundColor: '#E8E8E8',
    marginRight: 'auto',
  },
  otherMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  scrollContent: {
    padding: 10,
  },
});

export default ChatRoom;
