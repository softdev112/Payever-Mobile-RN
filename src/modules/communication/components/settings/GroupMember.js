import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { Icon, StyleSheet, Text, View } from 'ui';

import type GroupMemberData
  from '../../../../store/communication/models/GroupMemberInfo';
import Avatar from '../contacts/Avatar';

export default class GroupMember extends Component {
  props: {
    member: GroupMemberData;
    onRemove: Function;
  };

  $swipeRow: Swipeable;

  deleteMember() {
    const { member, onRemove } = this.props;

    onRemove(member.id);
    this.swipeBack();
  }

  getSwipeButtons() {
    return ([
      <TouchableOpacity
        style={styles.delBtn}
        onPress={::this.deleteMember}
      >
        <Text style={styles.delBtnText}>Delete</Text>
      </TouchableOpacity>,
    ]);
  }

  swipeBack() {
    if (this.$swipeRow) {
      this.$swipeRow.recenter();
    }
  }

  render() {
    const { member } = this.props;

    const statusLabelStyle = [styles.labelText];
    if (member.status.online) {
      statusLabelStyle.push(styles.onlineLabel);
    }

    return (
      <Swipeable
        style={styles.container}
        rightButtons={this.getSwipeButtons()}
        rightButtonWidth={70}
        rightActionActivationDistance={80}
        contentContainerStyle={styles.swipeContainerInside}
        onRef={ref => this.$swipeRow = ref}
      >
        <View style={styles.memberInfo}>
          <Avatar avatar={member.avatar} />
          <View style={styles.textContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.nameText} numberOfLines={1}>
                {member.name}
              </Text>
              {member.isOwner && (
                <Icon
                  style={styles.ownStar}
                  source="fa-star"
                />
              )}
            </View>
            <Text style={statusLabelStyle} numberOfLines={1}>
              {member.status.online ? 'online' : member.status.label}
            </Text>
          </View>
        </View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    overflow: 'hidden',
  },

  swipeContainerInside: {
    padding: 2,
    justifyContent: 'center',
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

  delBtn: {
    flex: 1,
    backgroundColor: '$pe_color_red',
    justifyContent: 'center',
    paddingLeft: 15,
  },

  delBtnText: {
    color: '#FFF',
    fontSize: 15,
  },
});