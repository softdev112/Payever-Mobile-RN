import { Component } from 'react';
import { images, NavBar, StyleSheet, View } from 'ui';

import Chat from '../components/chat';
import { ConversationType }
  from '../../../store/CommunicationStore/models/Conversation';

export default class ChatScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    conversationId: number;
    type: ConversationType;
  };

  render() {
    const { conversationId, type } = this.props;
    return (
      <View style={styles.container}>
        <NavBar.Default title="Communication" source={images.communication} />
        <Chat conversationId={conversationId} type={type} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});