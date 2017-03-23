import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ListView } from 'react-native';
import { ErrorBox, Loader, NavBar, StyleSheet, Text, View } from 'ui';

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
  };

  componentWillMount() {
    this.props.communication.getChatGroupSettings();
  }

  renderMemberRow(member) {
    return <ChatGroupMember member={member} />;
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },

  name: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 20,
  },

  membersTitle: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: '$font_family',
  },
});