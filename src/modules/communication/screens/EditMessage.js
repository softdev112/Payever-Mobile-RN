import { Component } from 'react';
import { KeyboardAvoidingView, TextInput, Platform } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet, View } from 'ui';

import type Message from '../../../store/communication/models/Message';
import type CommunicationStore from '../../../store/communication';

@inject('communication')
@observer
export default class EditMessage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication: CommunicationStore;
    message: Message;
    navigator: Navigator;
  };

  state: {
    text: string;
  };

  $textInput: TextInput;

  constructor(props) {
    super(props);

    this.state = {
      text: props.message.editBody,
    };
  }

  componentDidMount() {
    // To avoid blinking while screen appearing animation is going on
    setTimeout(() => this.$textInput && this.$textInput.focus(), 600);
  }

  onSaveMessage() {
    const { communication, message, navigator } = this.props;
    communication.editMessage(message.id, this.state.text);
    navigator.pop({ animated: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Edit Message" />
          <NavBar.Button title="Save" onPress={::this.onSaveMessage} />
        </NavBar>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <TextInput
            multiline
            style={styles.textInput}
            ref={ref => this.$textInput = ref}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
        </KeyboardAvoidingView>
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
    padding: 8,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: '$font_family',
  },
});