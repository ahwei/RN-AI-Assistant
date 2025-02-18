import { IMessage } from '@/types/messages';
import { Avatar } from '@rneui/themed';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MessageBubbleProps {
  message: IMessage;
  isMe: boolean;
}

const MessageBubble = ({ message, isMe }: MessageBubbleProps) => {
  const { content, expert } = message;
  const title = expert ? expert.name : 'AI Response:';

  return (
    <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
      {!isMe && (
        <Avatar
          rounded
          size="small"
          source={
            message?.expert?.avatar_url
              ? { uri: message.expert.avatar_url }
              : require('@/assets/images/ai-icon.png')
          }
        />
      )}
      <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
        {!isMe && <Text style={styles.messageUser}>{title}</Text>}
        {isMe ? (
          <Text style={styles.messageText}>{content}</Text>
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
            {content}
          </Markdown>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  markdownCode: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    fontFamily: 'monospace',
    padding: 8,
  },
  markdownHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    marginVertical: 8,
    paddingVertical: 4,
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
    maxWidth: '80%',
    minWidth: 200,
    padding: 12,
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
  myBubble: {
    backgroundColor: '#E8E8E8',
    marginLeft: 'auto',
    maxWidth: '80%',
    width: 'auto',
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
});

export default MessageBubble;
