import { Component } from 'react';
import {
  Animated, Easing, KeyboardAvoidingView, ListView, Platform,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, Loader, StyleSheet, Text } from 'ui';
import { ScreenParams } from 'utils';
import { last } from 'lodash';

import Footer from './Footer';
import MessageView from './MessageView';
import Header from './Header';
import RedirectDock from './RedirectDock';
import CommunicationStore from '../../../../store/communication';

const ANIM_DURATION_KOEF = 0.4;
const ANIM_POSITION_ADJUST = 65;
const MAX_SCREEN_HEIGHT = ScreenParams.height - 130;

@inject('communication')
@observer
export default class Chat extends Component {
  props: {
    communication?: CommunicationStore;
    style?: Object | number;
  };

  state: {
    animMsgPosY: number;
    animMsgValue: Object;
    isAnimScroll: boolean;
    listHeight: number;
    listContentHeight: number;
    showRedirectAnim: boolean;
  };

  $listView: ListView;

  constructor(props) {
    super(props);

    this.state = {
      animMsgPosY: 0,
      animMsgValue: new Animated.Value(0),
      isAnimScroll: false,
      listHeight: 0,
      listContentHeight: 0,
      showRedirectAnim: false,
    };
  }

  onListContentSizeChange(listContentHeight) {
    const { isAnimScroll, listHeight } = this.state;
    console.log('ssssssssss', listContentHeight, 'ddd', listHeight);

    if (this.$listView && listHeight !== 0 && listContentHeight > listHeight) {
      this.$listView.scrollToEnd({ animated: this.state.isAnimScroll });
    }

    // After first list render switch anim scrollToEnd on
    // if listHeight === 0 we didn't scroll onLayout will scrollToEnd first time
    if (!isAnimScroll) {
      this.setState({
        listContentHeight,
        isAnimScroll: listHeight > 0,
      });
    }
  }

  onListLayout({ nativeEvent: { layout } }) {
    const { listContentHeight, listHeight } = this.state;

    if (listHeight !== 0) return;

    // Test if it runs after onContentChange and onContentChange
    // didn't has listHeight and do not scrollToEnd because of this
    if (listContentHeight !== 0 && listContentHeight > layout.height) {
      this.$listView.scrollToEnd({ animated: false });
    }

    // If listContentHeight === 0 we didn't scroll onContentChange
    // scrollToEnd first time
    this.setState({
      listHeight: layout.height,
      isAnimScroll: listContentHeight > 0,
    });
  }

  onRedirectMessage(message, posY) {
    const { communication } = this.props;
    const { animMsgValue } = this.state;

    this.setState({
      animMsgPosY: posY - ANIM_POSITION_ADJUST,
      showRedirectAnim: true,
    });

    Animated.timing(animMsgValue, {
      toValue: 10,
      duration: this.getDurationOnRowYPos(posY),
      easing: Easing.linear,
    }).start(() => {
      this.setState({
        animMsgPosY: 0,
        showRedirectAnim: false,
      });
      animMsgValue.setValue(0);

      // Add message to messages for redirect to show it in dock
      // on other screens
      communication.addMessageForRedirect(message);
    });
  }

  getDurationOnRowYPos(posY: number) {
    // duration = ANIM_DURATION_KOEF * (screenHeight - Y)
    return ANIM_DURATION_KOEF * (ScreenParams.height - posY);
  }

  renderRow(row) {
    return (
      <MessageView
        message={row}
        onRedirectMessage={::this.onRedirectMessage}
      />
    );
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

    const {
      animMsgValue, animMsgPosY, showRedirectAnim, msgsForRedirect,
    } = this.state;
    const translateY = animMsgValue.interpolate({
      inputRange: [0, 10],
      outputRange: [animMsgPosY, MAX_SCREEN_HEIGHT],
      extrapolate: 'clamp',
    });

    const opacity = animMsgValue.interpolate({
      inputRange: [0, 10],
      outputRange: [1, 0],
    });

    const width = animMsgValue.interpolate({
      inputRange: [0, 10],
      outputRange: [300, 150],
    });

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
          renderRow={::this.renderRow}
          initialListSize={conversation.messages.length}
          onContentSizeChange={(w, h) => this.onListContentSizeChange(h)}
          onLayout={::this.onListLayout}
        />
        <Footer conversationId={conversation.id} />

        {showRedirectAnim && (
          <Animated.View
            style={[styles.animRedirectMsg, {
              opacity,
              width,
              transform: [
                {
                  translateY,
                },
              ],
            }]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {last(msgsForRedirect) && last(msgsForRedirect).body}
            </Text>
          </Animated.View>
        )}

        {communication.isMsgsForRedirectAvailable && <RedirectDock />}
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

  animRedirectMsg: {
    position: 'absolute',
    left: 20,
    height: 40,
    width: 200,
    borderColor: '$pe_color_twitter',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
});