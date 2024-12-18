import { Expert } from './expert';

export enum Sender {
  USER = 'user',
  EXPERT = 'expert',
  STREAM = 'stream',
}

export interface IMessage {
  message_id: number;
  expert?: Expert;
  sender: Sender;
  timestamp: string;
  content: string;
}
