import { extendObservable } from 'mobx';
import type Avatar from './Avatar';

export default class GroupMemberInfo {
  id: number;
  recipient_id: string;
  name: string;
  avatar: Avatar;
  isOwner: boolean;
  status: MemberStatus;

  constructor(data) {
    extendObservable(this, data);
  }
}

type MemberStatus = {
  userId: number;
  online: boolean;
  lastVisit: string;
  label: string;
};