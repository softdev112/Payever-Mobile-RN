import { Component } from 'react';
import { TextInput, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import StyleSheet from './StyleSheet';

export default class FlatTextInput extends Component {
  static defaultProps = {
    keyboardType: 'default',
    secureTextEntry: false,
    placeholder: 'Enter text',
    autoCorrect: false,
    renderValidator: () => {},
  };


  props: {
    placeholder?: string;
    secureTextEntry?: boolean;
    style?: Object;
    inputStyle?: Object;
    autoCorrect?: boolean;
    keyboardType?: string;
    value?: string;
    onChangeText?: Function;
    onFocus?: Function;
    onLayout?: Function;
    onBlur?: Function;
    onSubmitEditing?: Function;
    renderValidator?: Function;
    returnKeyType?: string;
  };

  state: {
    isFocused: boolean;
    text: string;
  };

  $textInput: TextInput;
  $animContainer: Animatable.View;

  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      text: '',
    };
  }

  onFocus(e) {
    const { onFocus } = this.props;

    if (onFocus) {
      onFocus(e);
    }

    this.setState({ isFocused: true });
  }

  onBlur(e) {
    const { onBlur } = this.props;

    if (onBlur) {
      onBlur(e);
    }

    this.setState({ isFocused: false });
  }

  async shakeElementAndSetFocus() {
    await this.$animContainer.shake(300);
    this.$textInput.focus();
  }

  setFocus() {
    if (this.$textInput) {
      this.$textInput.focus();
    }

    this.setState({ isFocused: true });
  }

  renderValidator() {
    const { renderValidator } = this.props;

    if (renderValidator) {
      return renderValidator();
    }

    return null;
  }

  render() {
    const {
      autoCorrect, inputStyle, placeholder, secureTextEntry, style,
      value, onChangeText, onLayout, keyboardType, returnKeyType,
      onSubmitEditing,
    } = this.props;
    const { isFocused } = this.state;

    return (
      <View style={[styles.container, style]}>
        {isFocused && this.renderValidator()}
        <Animatable.View
          ref={ref => this.$animContainer = ref}
        >
          <TextInput
            style={[styles.textInput, inputStyle]}
            ref={ref => this.$textInput = ref}
            placeholder={placeholder}
            autoCorrect={autoCorrect}
            autoCapitalize="none"
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            onFocus={::this.onFocus}
            onBlur={::this.onBlur}
            onLayout={onLayout}
            underlineColorAndroid="transparent"
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
          />
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
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