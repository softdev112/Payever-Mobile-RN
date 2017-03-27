import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View } from 'ui';

import AddContactBlock from '../components/contacts/AddContactBlock';
import type CommunicationStore from '../../../store/communication';

@inject('communication')
@observer
export default class AddMemberToGroup extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
  };

  onAddMembersToGroup() {
    const { communication } = this.props;
    communication.addAllMembersToGroup(communication.selectedConversation.id);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back title="Settings" showTitle="always" />
          <NavBar.Title title="Add Member" />
          <NavBar.Button
            title="Save"
            onPress={::this.onAddMembersToGroup}
            unwind
          />
        </NavBar>
        <View style={styles.content}>
          <AddContactBlock bottomDockStyle={styles.bottomDockPos} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 15,
  },

  bottomDockPos: {
    $topHeight: '72%',
    top: '$topHeight',
  },
});