import { Icon, StyleSheet, Text, View } from 'ui';

import type GroupMember
  from '../../../../store/communication/models/GroupMember';
import Avatar from '../contacts/Avatar';

export default function ({ member }: PropTypes) {
  return (
    <View style={styles.container}>
      <View style={styles.memberInfo}>
        <Avatar avatar={member.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={1}>{member.name}</Text>
          <Text style={styles.text} numberOfLines={1}>
            {member.status.label}
          </Text>
        </View>
      </View>
      <Icon
        onPress={() => {}}
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
    height: 60,
  },

  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    alignSelf: 'stretch',
  },

  text: {
    fontSize: 16,
  },
});

type PropTypes = {
  member: GroupMember;
};