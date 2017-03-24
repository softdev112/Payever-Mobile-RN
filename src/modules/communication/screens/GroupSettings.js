import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ListView } from 'react-native';
import { Navigator } from 'react-native-navigation';
import {
  ErrorBox, Loader, NavBar, StyleSheet, Text, TextButton, View,
} from 'ui';

import ChatGroupMember from '../components/settings/ChatGroupMember';
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

  componentWillMount() {
    this.props.communication.getChatGroupSettings();
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

  onDeleteGroup() {
    const {
      communication: { selectedConversation: group },
      navigator,
    } = this.props;
    this.props.communication.deleteGroup(group.id);

    navigator.push({
      screen: 'communication.Main',
      animated: true,
    });
  }

  renderMemberRow(member) {
    return (
      <ChatGroupMember
        member={member}
        onRemove={::this.onRemoveMember}
      />
    );
  }

  render() {
    const { communication } = this.props;
    const { isLoading, error, selectedChatGroupSettings } = communication;
    const ds = communication.groupMembersDataSource;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Group Settings" />
        </NavBar>
        <Loader isLoading={isLoading}>
          {error || !selectedChatGroupSettings ? (
            <ErrorBox message={error} />
          ) : (
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {selectedChatGroupSettings.name}
              </Text>
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
              <Text style={styles.membersTitle}>Members:</Text>
              <ListView
                contentContainerStyle={styles.contentContainer}
                dataSource={ds}
                enableEmptySections
                renderRow={::this.renderMemberRow}
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },

  name: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 5,
  },

  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  btnTitle: {
    fontWeight: '200',
  },

  membersTitle: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: '$font_family',
    marginBottom: 10,
  },
});