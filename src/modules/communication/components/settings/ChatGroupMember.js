import { Icon, StyleSheet, Text, View } from 'ui';

import type GroupMember
  from '../../../../store/communication/models/GroupMember';
import Avatar from '../contacts/Avatar';

export default function ({ member, onRemove }: PropTypes) {
  const statusLabelStyle = [styles.labelText];
  if (member.status.online) {
    statusLabelStyle.push(styles.onlineLabel);
  }

  return (
    <View style={styles.container}>
      <View style={styles.memberInfo}>
        <Avatar avatar={member.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.statusRow}>
            <Text style={styles.nameText} numberOfLines={1}>{member.name}</Text>
            {member.isOwner && (
              <Icon
                style={styles.ownStar}
                source="fa-star"
              />
            )}
          </View>
          <Text style={statusLabelStyle} numberOfLines={1}>
            {member.status.label}
          </Text>
        </View>
      </View>
      {onRemove && (
        <Icon
          onPress={() => onRemove(member.id)}
          source="icon-trashcan-24"
        />
      )}
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

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  nameText: {
    fontSize: 16,
    fontWeight: '300',
    fontFamily: '$font_family',
    marginRight: 5,
  },

  labelText: {
    fontSize: 12,
    color: '$pe_color_gray',
    fontFamily: '$font_family',
  },

  ownStar: {
    color: '$pe_color_twitter',
    fontSize: 12,
  },

  onlineLabel: {
    color: '$pe_color_twitter',
  },
});

type PropTypes = {
  member: GroupMember;
  onRemove: (memberId: number) => void;
};