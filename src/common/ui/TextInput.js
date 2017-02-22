import { Component } from 'react';
import { Keyboard, Platform } from 'react-native';
import TextField from 'react-native-md-textinput';

export default class TextInput extends Component {
  static defaultProps = { securityTextEntry: false };

  props: {
    securityTextEntry?: boolean;
  };

  $input: TextField;

  shouldComponentUpdate(nexProps) {
    if (!this.$input) return false;

    // To prevent label fall down when value === ''
    // because of error in the TextField Component
    return nexProps.value !== ''
      && (this.props.securityTextEntry && this.$input.isFocused());
  }

  focus() {
    this.$input.focus();
  }

  blur() {
    this.$input.blur();
    Keyboard.dismiss();
  }

  isFocused() {
    return this.$input.isFocused;
  }

  render() {
    // Prevent propTypes warning inside md-textinput
    const inputStyle = Platform.OS === 'android' ? { paddingVertical: 5 } : {};
    return (
      <TextField
        ref={f => this.$input = f}
        dense
        highlightColor="#6d6d6d"
        inputStyle={inputStyle}
        {...this.props}
      />
    );
  }
}