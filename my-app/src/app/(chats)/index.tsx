import { Avatar, Button, Icon, Input } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEventListener,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

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

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardDidShow: KeyboardEventListener = e => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide: KeyboardEventListener = () => {
    setKeyboardHeight(0);
  };

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
      keyboardVerticalOffset={keyboardHeight}
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
              {!msg.isMe && <Text style={[styles.messageUser]}>{msg.user}</Text>}

              {msg.isMe ? (
                <Text style={[styles.messageText]}>{msg.text}</Text>
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
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Please input some text..."
            value={message}
            onChangeText={setMessage}
            containerStyle={styles.input}
            inputContainerStyle={styles.inputInner}
            inputStyle={styles.inputText}
          />
          <Button
            icon={<Icon name="send" type="material" color="#fff" size={24} />}
            onPress={sendMessage}
            containerStyle={styles.button}
            buttonStyle={styles.buttonInner}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: 45,
  },
  buttonInner: {
    backgroundColor: '#007AFF',
    borderRadius: 22.5,
    height: 45,
    padding: 0,
    width: 45,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    backgroundColor: 'transparent',
    flex: 1,
    height: 45,
    marginRight: 10,
    paddingHorizontal: 5,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 45,
    flexDirection: 'row',
    padding: 10,
    width: '90%',
  },
  inputInner: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  inputText: {
    fontSize: 16,
  },
  inputWrapper: {
    alignItems: 'center',
    paddingBottom: 25,
    width: '100%',
  },
  markdownCode: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
  messageUser: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  myBubble: {
    backgroundColor: '#E8E8E8',
    marginLeft: 'auto',
    width: '100%',
  },
  myMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  otherBubble: {
    backgroundColor: 'transparent',
    marginRight: 'auto',
    width: '100%',
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
