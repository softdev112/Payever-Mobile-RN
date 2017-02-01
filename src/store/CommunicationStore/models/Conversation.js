import Message from './Message';

export default class Conversation {
  archived: boolean;
  id: number;
  messages: Array;
  name: string;
  status: ConversationStatus;
  type: 'conversation';

  constructor(data) {
    data.messages = (data.messages || []).map(m => new Message(m));
    Object.assign(this, data);
  }
}

export type ConversationStatus = {
  label: ?string;
  lastVisit: ?string;
  online: boolean;
  userId: number;
};