import { Component } from 'react';
import { KeyboardAvoidingView, ListView, Platform } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, StyleSheet } from 'ui';

import Footer from './Footer';
import MessageView from './MessageView';
import Header from './Header';
import CommunicationStore from '../../../../store/communication';

@inject('communication')
@observer
export default class Chat extends Component {
  props: {
    communication?: CommunicationStore;
    style?: Object | number;
  };

  $listView: ListView;

  renderRow(row) {
    return <MessageView message={row} />;
  }

  render() {
    const { communication, style } = this.props;

    const conversation = communication.selectedConversation;
    const ds = communication.selectedConversationDataSource;

    if (!conversation) {
      return (
        <Loader isLoading={ds.isLoading}>
          <ErrorBox message={ds.error} />
        </Loader>
      );
    }

    return (
      <KeyboardAvoidingView
        style={[styles.container, style]}
        contentContainerStyle={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <Header status={conversation.status} userName={conversation.name} />
        <ListView
          contentContainerStyle={styles.list}
          dataSource={ds}
          enableEmptySections
          ref={ref => this.$listView = ref}
          renderRow={this.renderRow}
        />
        <Footer conversationId={conversation.id} />
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