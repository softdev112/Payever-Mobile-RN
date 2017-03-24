import { Icon, StyleSheet, Text, View } from 'ui';

import type GroupMember
  from '../../../../store/communication/models/GroupMember';
import Avatar from '../contacts/Avatar';

export default function ({ member, onRemove }: PropTypes) {
  return (
    <View style={styles.container}>
      <View style={styles.memberInfo}>
        <Avatar avatar={member.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.nameText} numberOfLines={1}>{member.name}</Text>
          <Text style={styles.labelText} numberOfLines={1}>
            {member.status.label}
          </Text>
        </View>
      </View>
      <Icon
        onPress={() => onRemove(member.id)}
        source="icon-trashcan-24"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    height: 60,
  },

  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    width: '68%',
  },

  nameText: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: '$font_family',
  },

  labelText: {
    fontSize: 12,
    color: '$pe_color_gray',
    fontFamily: '$font_family',
  },
});

type PropTypes = {
  member: GroupMember;
  onRemove: (memberId: number) => void;
};