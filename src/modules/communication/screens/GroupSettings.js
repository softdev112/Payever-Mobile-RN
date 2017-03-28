import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ListView } from 'react-native';
import { Navigator } from 'react-native-navigation';
import {
  Icon, ErrorBox, Loader, NavBar, StyleSheet, Text, TextButton, View,
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
    this.props.communication.getSelectedGroupSettings();
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

    navigator.pop({ animated: true });
  }

  renderMemberRow(member) {
    const { communication } = this.props;
    const { selectedGroupSettings } = communication;

    return (
      <ChatGroupMember
        member={member}
        onRemove={selectedGroupSettings.isOwner ? ::this.onRemoveMember : null}
      />
    );
  }

  render() {
    const { communication } = this.props;
    const { isLoading, error, selectedGroupSettings } = communication;
    const ds = communication.groupMembersDataSource;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Group Settings" />
        </NavBar>
        <Loader isLoading={isLoading}>
          {error || !selectedGroupSettings ? (
            <ErrorBox message={error} />
          ) : (
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>
                  {selectedGroupSettings.name}
                </Text>
                {selectedGroupSettings.isOwner && (
                  <Icon
                    style={styles.ownStar}
                    source="fa-star"
                  />
                )}
              </View>
              {selectedGroupSettings.isOwner && (
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
              <Text style={styles.membersTitle}>Members:</Text>
              <ListView
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
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  name: {
    fontSize: 24,
    fontWeight: '300',
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
    marginBottom: 8,
  },

  ownStar: {
    color: '$pe_color_twitter',
    fontSize: 12,
    marginLeft: 5,
  },
});