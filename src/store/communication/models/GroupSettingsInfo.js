import { observable, extendObservable } from 'mobx';
import type GroupMemberInfo from './GroupMemberInfo';

export default class GroupSettingsInfo {
  id: number;
  name: string;
  members: Array<GroupMemberInfo>;
  isOwner: true;

  addMember: (member: GroupMemberInfo) => void;
  removeMember: (memberId: number) => void;

  constructor(data) {
    extendObservable(this, data);
  }

  addMember(member: GroupMemberInfo) {
    this.members.push(observable(member));
  }

  removeMember(memberId: number) {
    this.members = observable(
      this.members.slice().filter(member => member.id !== memberId)
    );
  }
}