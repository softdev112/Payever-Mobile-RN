import type { UserAvatar } from './MessengerInfo';

export default class Contact {
  id: string;
  name: string;
  email: string;
  avatar: UserAvatar;
  blockName: string;
}