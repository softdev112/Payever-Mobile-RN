/**
 * Created by Elf on 27.01.2017.
 */
import { Component } from 'react';
import { Keyboard, TextInput } from 'react-native';
import { Icon, StyleSheet, View } from 'ui';

export default class ChatBottomBar extends Component {
  $input: TextInput;

  state: {
    text: string;
  };

  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  onAddonsPress() {
    console.log('Upload message');
  }

  onSendPress() {
    console.log('Send message');
    Keyboard.dismiss();
    this.setState({ text: '' });
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon
          onPress={::this.onAddonsPress}
          source="icon-plus-24"
          touchStyle={styles.iconTouch}
        />
        <TextInput
          style={styles.input}
          ref={i => this.$input = i}
          onChangeText={text => this.setState({ text })}
          onSubmitEditing={::this.onSendPress}
          placeholder="Enter message"
          returnKeyType="send"
          underlineColorAndroid="transparent"
          value={this.state.text}
        />
        <Icon
          style={styles.iconSend}
          hitSlop={14}
          onPress={::this.onSendPress}
          source="icon-arrow-right-16"
          touchStyle={styles.iconTouch}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    height: 50,
    borderColor: '$pe_color_light_gray_1',
    borderWidth: 1,
  },

  iconAddons: {
  },

  input: {
    flex: 72,
    paddingHorizontal: 8,
    borderLeftColor: '$pe_color_light_gray_1',
    borderLeftWidth: 1,
  },

  iconSend: {
    fontSize: 24,
  },

  iconTouch: {
    flex: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});