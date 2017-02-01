import { Component } from 'react';
import { ListView, ListViewDataSource } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Loader, StyleSheet, View } from 'ui';

import ChatBottomBar from './ChatBottomBar';
import ChatMessage from './ChatMessage';
import UserInfoHeader from './UserInfoHeader';
import CommunicationStore from '../../../../store/CommunicationStore';
import type Conversation from
  '../../../../store/CommunicationStore/models/Conversation';

@inject('communication')
@observer
export default class Chat extends Component {

  props: {
    communication?: CommunicationStore;
    conversationId: number;
  };

  state: {
    dataSource: ListViewDataSource;
    conversation: Conversation;
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
    };
  }

  async componentWillMount() {
    const { communication, conversationId } = this.props;

    const conversation = await communication.loadConversation(conversationId);
    if (conversation) {
      this.setState({
        conversation,
        dataSource: this.state.dataSource.cloneWithRows(conversation.messages),
      });
    }
  }

  renderRow(row) {
    return <ChatMessage message={row} />;
  }

  render() {
    const { conversation = {}, dataSource } = this.state;

    const status = conversation.status || {};

    return (
      <Loader isLoading={!conversation}>
        <View style={styles.container}>
          <UserInfoHeader
            online={status.online}
            status={status.label}
            userName={conversation.name}
          />
          <ListView
            contentContainerStyle={styles.list}
            dataSource={dataSource}
            renderRow={this.renderRow}
          />
          <ChatBottomBar />
        </View>
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
});