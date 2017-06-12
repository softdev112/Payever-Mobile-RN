import { Component } from 'react';
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Navigator } from 'react-native-navigation';
import { NavBar, StyleSheet, View } from 'ui';

import type Message from '../../../store/communication/models/Message';

export default class EditMessage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    message: Message | string;
    navigator: Navigator;
    onSave: (message: string) => void;
    onChangeText: (text: string) => void;
  };

  state: {
    message: string;
  };

  $textInput: TextInput;

  constructor(props) {
    super(props);

    this.state = {
      message: props.message,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.$textInput) {
        this.$textInput.focus();
      }
    }, 500);
  }

  async onSaveMessage() {
    const { onSave, navigator } = this.props;
    const { message } = this.state;

    if (onSave) {
      onSave(message);
    }

    navigator.pop({ animated: true });
  }

  onChangeText(message) {
    const { onChangeText } = this.props;

    if (onChangeText) {
      onChangeText(message);
    }

    this.setState({ message });
  }

  render() {
    const { message } = this.state;

    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Edit Message" showTitle="always" />
          <NavBar.Button title="Save" onPress={::this.onSaveMessage} />
        </NavBar>
        <KeyboardAvoidingView
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <TextInput
            style={styles.textInput}
            ref={r => this.$textInput = r}
            multiline
            value={message}
            onChangeText={::this.onChangeText}
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

  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    fontFamily: '$font_family',
    justifyContent: 'flex-start',
  },

  chatContainer: {
    flex: 1,
    zIndex: 1,
  },
});