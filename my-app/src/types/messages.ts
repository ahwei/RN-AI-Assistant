import { Expert } from './expert';
export interface IMessage {
  message_id: number;
  expert?: Expert;
  sender: 'user' | 'expert';
  timestamp: string;
  content: string;
}
