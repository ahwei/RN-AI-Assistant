import { Button, Icon, Input } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ChatInputProps {
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput = ({ message, onChangeText, onSend, disabled }: ChatInputProps) => {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Please input some text..."
          value={message}
          onChangeText={onChangeText}
          containerStyle={styles.input}
          inputContainerStyle={styles.inputInner}
          inputStyle={styles.inputText}
        />
        <Button
          icon={<Icon name="send" type="material" color="#fff" size={24} />}
          onPress={onSend}
          containerStyle={styles.button}
          buttonStyle={styles.buttonInner}
          disabled={disabled}
        />
      </View>
    </View>
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
});

export default ChatInput;
