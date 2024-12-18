import { ChatIdEnum } from '@/types/chat';
import { Redirect } from 'expo-router';

export default function IndexPage() {
  return <Redirect href={`/(chats)/${ChatIdEnum.NEW_CHAT}`} />;
}
