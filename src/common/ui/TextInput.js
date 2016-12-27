import { Component } from 'react';
import TextField from 'react-native-md-textinput';

export default class TextInput extends Component {
  $input: TextField;

  focus() {
    this.$input.focus();
  }

  blur() {
    this.$input.blur();
  }

  isFocused() {
    return this.$input.isFocused;
  }

  render() {
    return (
      <TextField ref={f => this.$input = f} dense {...this.props} />
    );
  }
}