import { Component } from 'react';
import { TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';

import StyleSheet from './StyleSheet';

export default class FlatTextInput extends Component {
  static defaultProps = {
    securityTextEntry: false,
    placeholder: 'Enter text',
    autoCorrect: false,
  };


  props: {
    placeholder?: string;
    securityTextEntry?: boolean;
    style?: Object;
    inputStyle?: Object;
    autoCorrect?: boolean;
    value?: string;
    onChangeText?: Function;
  };

  $textInput: TextInput;
  $animContainer: Animatable.View;

  async shakeElementAndSetFocus() {
    await this.$animContainer.shake(300);
    this.$textInput.focus();
  }

  render() {
    const {
      autoCorrect, inputStyle, placeholder, securityTextEntry, style,
      value, onChangeText,
    } = this.props;

    return (
      <Animatable.View
        style={[styles.container, style]}
        ref={ref => this.$animContainer = ref}
      >
        <TextInput
          style={[styles.textInput, inputStyle]}
          ref={ref => this.$textInput = ref}
          placeholder={placeholder}
          autoCorrect={autoCorrect}
          autoCapitalize="none"
          securityTextEntry={securityTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  textInput: {
    fontSize: 22,
    height: 50,
    fontFamily: '$font_family',
    fontWeight: '200',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});