import { Component } from 'react';
import { KeyboardAvoidingView, ListView, Platform } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Loader, StyleSheet, Text } from 'ui';

import Footer from './Footer';
import MessageView from './MessageView';
import Header from './Header';
import CommunicationStore from '../../../../store/CommunicationStore';

@inject('communication')
@observer
export default class Chat extends Component {
  props: {
    communication?: CommunicationStore;
    conversationId: number;
  };

  $listView: ListView;

  componentWillMount() {
    const { communication, conversationId } = this.props;

    //noinspection JSIgnoredPromiseFromCall
    communication.loadConversation(conversationId);
  }

  renderRow(row) {
    return <MessageView message={row} />;
  }

  render() {
    const { communication, conversationId } = this.props;
    const conversation = communication.conversations.get(conversationId);
    const ds = communication.getConversationDataSource(conversationId);

    if (!conversation) {
      return (
        <Loader isLoading={ds.isLoading}>
          <Text>{ds.error}</Text>
        </Loader>
      );
    }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        contentContainerStyle={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <Header
          online={conversation.status.online}
          status={conversation.status.label}
          userName={conversation.name}
        />
        <ListView
          contentContainerStyle={styles.list}
          dataSource={ds}
          ref={ref => this.$listView = ref}
          renderRow={this.renderRow}
        />
        <Footer conversationId={conversationId} />
      </KeyboardAvoidingView>
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