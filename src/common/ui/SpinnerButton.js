/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import StyleSheet from './StyleSheet';

export default class SpinnerButton extends Component {
  props:{
    title: string;
    onPress: () => any;
    disabled?: ?boolean;
    titleStyle?: Object;
    style?: Object;
    spinnerColor?: string;
  };

  render() {
    const { onPress, title, disabled, style, titleStyle } = this.props;
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];

    if (style) {
      buttonStyles.push(style);
    }

    if (titleStyle) {
      textStyles.push(titleStyle);
    }

    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
    }

    const spinnerColor = this.props.spinnerColor || '#0084ff';
    return (
      <TouchableOpacity
        style={buttonStyles}
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={disabled}
        onPress={onPress}
      >
        {disabled ? <ActivityIndicator color={spinnerColor} animating /> :
        <Text style={textStyles}>{title}</Text>}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '$pe_color_blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    padding: 3,
  },

  text: {
    textAlign: 'center',
    color: 'white',
    padding: 8,
    fontWeight: '500',
  },

  buttonDisabled: {
    elevation: 0,
    width: '15%',
  },

  textDisabled: {
    color: '#a1a1a1',
  },
});