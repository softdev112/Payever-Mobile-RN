/* eslint react/prefer-stateless-function: 0 */

import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Button extends Component {
  props: {
    title: string;
    onPress: () => any;
    disabled?: ?boolean;
    titleStyle?: Object | number;
    style?: Object | number;
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

    return (
      <TouchableOpacity
        style={buttonStyles}
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={textStyles}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '$pe_color_blue',
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
    backgroundColor: '#dfdfdf',
    borderColor: '#dfdfdf',
  },

  textDisabled: {
    color: '#a1a1a1',
  },
});