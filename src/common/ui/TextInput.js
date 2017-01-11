import { Component } from 'react';
import { Keyboard } from 'react-native';
import TextField from 'react-native-md-textinput';


export default class TextInput extends Component {
  $input: TextField;

  shouldComponentUpdate(nexProps, nextState) {
    if(!this.$input) return false;

    // To prevent label fall down when value === ''
    // because of error in the TextField Component
    return nexProps.value !== ''
      && (!!this.props.securityTextEntry && this.$input.isFocused());
  }

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