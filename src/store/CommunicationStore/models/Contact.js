//noinspection JSUnresolvedVariable
import type { UserAvatar } from './MessengerPrivateInfo';

export default class Contact {
  id: string;
  name: string;
  email: string;
  avatar: UserAvatar;
  blockName: string;
}