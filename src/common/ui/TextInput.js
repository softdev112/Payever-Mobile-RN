import { Component } from 'react';
import TextField from 'react-native-md-textinput';

export default class TextInput extends Component {

  focus() {
    this.refs.field.focus();
  }

  blur() {
    this.refs.field.blur();
  }

  isFocused() {
    return this.field.isFocused;
  }

  render() {
    return (
      <TextField ref="field" dense={true} {...this.props} />
    );
  }
}