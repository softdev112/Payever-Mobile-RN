import { Component, PropTypes } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { Icon, StyleSheet, View } from 'ui';
import CommunicationStore from '../../../../store/CommunicationStore';

@inject('communication')
@observer
export default class Footer extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  $input: TextInput;

  props: {
    communication?: CommunicationStore;
    conversationId: number;
  };

  state: {
    text: string;
  };

  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
    this.onType = ::this.onType;
  }

  onActionPress() {
    const { conversationId } = this.props;

    this.context.navigator.push({
      screen: 'marketing.CreateOffer',
      passProps: { conversationId },
    });
  }

  onSend() {
    const { text } = this.state;
    const { communication, conversationId } = this.props;

    if (text) {
      //noinspection JSIgnoredPromiseFromCall
      communication.sendMessage(conversationId, text);
    }

    //noinspection JSUnresolvedFunction
    Keyboard.dismiss();
    this.setState({ text: '' });
  }

  onType(text) {
    this.setState({ text });
    const { communication, conversationId } = this.props;
    communication.updateTypingStatus(conversationId);
  }

  render() {
    const { communication } = this.props;

    let isBusiness = false;
    if (communication.messengerInfo) {
      isBusiness = communication.messengerInfo.isBusiness;
    }

    return (
      <View style={styles.container}>
        {isBusiness && (
          <Icon
            style={styles.icon}
            onPress={::this.onActionPress}
            source="icon-plus-24"
            touchStyle={styles.icon_action_touch}
          />
        )}
        <TextInput
          style={styles.input}
          ref={i => this.$input = i}
          onChangeText={this.onType}
          onSubmitEditing={::this.onSend}
          placeholder="Send message"
          returnKeyType="send"
          underlineColorAndroid="transparent"
          value={this.state.text}
        />
        <Icon
          style={styles.icon}
          hitSlop={14}
          onPress={::this.onSend}
          source="icon-arrow-right-16"
          touchStyle={styles.icon_touch}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    borderTopColor: '$pe_color_light_gray_1',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
  },

  icon: {
    color: '$pe_color_icon',
    fontSize: 24,
  },

  icon_action_touch: {
    borderRightColor: '$pe_color_light_gray_1',
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  icon_touch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  input: {
    flex: 1,
    paddingHorizontal: 22,
  },
});