import { Component } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Icon, StyleSheet, View } from 'ui';
import CommunicationStore from '../../../../store/CommunicationStore/index';

@inject('communication')
@observer
export default class Footer extends Component {
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

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          ref={i => this.$input = i}
          onChangeText={text => this.setState({ text })}
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