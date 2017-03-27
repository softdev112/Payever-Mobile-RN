import { observable, extendObservable } from 'mobx';
import type GroupMember from './GroupMember';

export default class GroupSettingsData {
  id: number;
  name: string;
  members: Array<GroupMember>;
  isOwner: true;

  addMember: (member: GroupMember) => void;
  removeMember: (memberId: number) => void;

  constructor(data) {
    extendObservable(this, data);
  }

  addMember(member: GroupMember) {
    this.members.push(observable(member));
  }

  removeMember(memberId: number) {
    this.members = observable(
      this.members.slice().filter(member => member.id !== memberId)
    );
  }
}