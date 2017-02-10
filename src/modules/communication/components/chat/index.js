import { Component } from 'react';
import { ListView, ListViewDataSource, Platform } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Loader, StyleSheet, View } from 'ui';

import Footer from './Footer';
import MessageView from './MessageView';
import Header from './Header';
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

  $listView: ListView;

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
      this.setState({ conversation });
    }
  }

  componentDidMount() {
    // TODO: Replace this hack by a normal solution
    setTimeout(() => this.scrollToBottom());
    setTimeout(() => this.scrollToBottom(), 200);
    setTimeout(() => this.scrollToBottom(), 400);
  }

  componentDidUpdate() {
    this.scrollToBottom(true);
  }

  scrollToBottom(animated = false) {
    if (!this.$listView) return;

    if (Platform.OS === 'ios') {
      // On IOS you should use a real y offset instead of Number.MAX_VALUE
      return;
    }
    const scrollResponder = this.$listView.getScrollResponder();
    scrollResponder.scrollTo({ animated, y: Number.MAX_VALUE });
  }

  renderRow(row) {
    return <MessageView message={row} />;
  }

  render() {
    const { conversation = {} } = this.state;
    let { dataSource } = this.state;
    const { conversationId } = this.props;

    const status = conversation.status || {};

    if (conversation.messages) {
      dataSource = dataSource.cloneWithRows(conversation.messages.slice());
    }

    return (
      <Loader isLoading={!conversation.messages}>
        <View style={styles.container}>
          <Header
            online={status.online}
            status={status.label}
            userName={conversation.name}
          />
          <ListView
            contentContainerStyle={styles.list}
            dataSource={dataSource}
            ref={ref => this.$listView = ref}
            renderRow={this.renderRow}
          />
          <Footer conversationId={conversationId} />
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
    paddingLeft: 28,
    paddingRight: 65,
    paddingVertical: 10,
  },
});