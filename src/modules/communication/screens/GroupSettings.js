import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { FlatList } from 'react-native';
import { Navigator } from 'react-native-navigation';
import {
  Icon, ErrorBox, Loader, NavBar, StyleSheet, Text, TextButton, View,
} from 'ui';

import GroupMember from '../components/settings/GroupMember';
import type CommunicationStore from '../../../store/communication';

@inject('communication')
@observer
export default class GroupSettings extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    navigator: Navigator;
  };

  async componentWillMount() {
    const { communication } = this.props;
    const { selectedConversation } = communication;

    // Reload settings
    const conversationSettings = await communication.getGroupSettings(
      selectedConversation.id,
      selectedConversation.type
    );
    selectedConversation.setConversationSettings(conversationSettings);
  }

  onAddMember() {
    this.props.navigator.push({
      screen: 'communication.AddMemberToGroup',
      animated: true,
    });
  }

  onRemoveMember(memberId: number) {
    const { communication: { selectedConversation: group } } = this.props;
    this.props.communication.removeGroupMember(group.id, memberId);
  }

  async onDeleteGroup() {
    const {
      communication: { selectedConversation: group },
      navigator,
    } = this.props;
    await this.props.communication.deleteGroup(group.id);

    navigator.pop({ screen: 'communication.Chat', animated: true });
  }

  renderMemberItem({ item: member }) {
    const { selectedConversation: conversation } = this.props.communication;

    if (!conversation) {
      return null;
    }

    const { settings } = conversation;

    return (
      <GroupMember
        member={member}
        onRemove={settings.isOwner ? ::this.onRemoveMember : null}
      />
    );
  }

  render() {
    const { communication } = this.props;
    const { isLoading, error, selectedConversation } = communication;
    const { settings } = selectedConversation;

    const memberCount = selectedConversation.membersCount;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Group Settings" showTitle="always" />
        </NavBar>
        <Loader isLoading={isLoading}>
          {error || !settings ? (
            <ErrorBox message={error} />
          ) : (
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  {settings.name}
                </Text>
                {settings.isOwner && (
                  <Icon
                    style={styles.ownStar}
                    source="fa-star"
                  />
                )}
              </View>
              {settings.isOwner && (
                <View style={styles.btnsContainer}>
                  <TextButton
                    titleStyle={styles.btnTitle}
                    title="Delete Group"
                    onPress={::this.onDeleteGroup}
                  />
                  <TextButton
                    titleStyle={styles.btnTitle}
                    title="Add Member"
                    onPress={::this.onAddMember}
                  />
                </View>
              )}
              <Text style={styles.membersTitle}>
                {`${memberCount} ${memberCount === 1 ? 'Member' : 'Members'}:`}
              </Text>
              <FlatList
                style={styles.membersList}
                data={settings.members.slice()}
                renderItem={::this.renderMemberItem}
                keyExtractor={m => m.id}
              />
            </View>
          )}
        </Loader>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  userInfo: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 8,
  },

  name: {
    fontSize: 24,
    fontWeight: '300',
  },

  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  btnTitle: {
    fontWeight: '200',
  },

  membersList: {
    paddingLeft: 15,
  },

  membersTitle: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: '$font_family',
    color: '$pe_color_gray',
    paddingTop: 8,
    paddingBottom: 2,
    paddingHorizontal: 16,
    backgroundColor: '$pe_color_apple_div',
  },

  ownStar: {
    color: '$pe_color_twitter',
    fontSize: 12,
    marginLeft: 5,
  },
});