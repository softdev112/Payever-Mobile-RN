import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'ui';
import * as Animatable from 'react-native-animatable';

import CommunicationStore from '../../../../store/communication';
import RedirectMessage from './RedirectMessage';

@inject('communication')
@observer
export default class RedirectDock extends Component {
  props: {
    communication?: CommunicationStore;
  };

  $scrollView: ScrollView;

  onScrollContentSizeChange() {
    if (!this.$scrollView) return;

    this.$scrollView.scrollToEnd({ animated: true });
  }

  renderMessagesForRedirect() {
    const { communication } = this.props;

    if (!communication.isMsgsForRedirectAvailable) return [];

    return communication.messagesForRedirect.map((message) => {
      return (
        <RedirectMessage
          style={styles.message}
          key={message.id}
          message={message}
        />
      );
    });
  }

  render() {
    return (
      <Animatable.View
        style={styles.container}
        animation="fadeIn"
        duration={300}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={(ref) => this.$scrollView = ref}
          onContentSizeChange={::this.onScrollContentSizeChange}
        >
          {this.renderMessagesForRedirect()}
        </ScrollView>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  $maxHeight: '82%',

  container: {
    position: 'absolute',
    top: '$maxHeight - 60',
    '@media (max-height: 620):': {
      top: '$maxHeight - 80',
    },
    backgroundColor: 'transparent',
    height: 60,
  },

  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  message: {
    marginRight: 10,
  },
});