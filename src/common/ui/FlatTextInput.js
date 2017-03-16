import { Component } from 'react';
import { TextInput, View } from 'react-native';
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
  };

  $input: TextInput;

  render() {
    const {
      autoCorrect, inputStyle, placeholder, securityTextEntry, style,
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        <TextInput
          style={[styles.textInput, inputStyle]}
          placeholder={placeholder}
          autoCorrect={autoCorrect}
          securityTextEntry={securityTextEntry}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
  },

  textInput: {
    fontSize: 24,
    height: 50,
    fontFamily: '$font_family',
    fontWeight: '200',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});