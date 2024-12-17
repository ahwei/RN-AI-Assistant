import ChatRoom from '@/components/chat/ChatRoom';
import { useLocalSearchParams } from 'expo-router';

const ChatRoomPage = () => {
  const { chatId } = useLocalSearchParams();

  return <ChatRoom chatId={Number(chatId)} />;
};

export default ChatRoomPage;
