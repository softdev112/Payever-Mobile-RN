/* eslint react/prefer-stateless-function: 0 */

import React, { Component } from 'react';
import { Animated, Easing, Text, TouchableOpacity } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Button extends Component {
  props: {
    title: string;
    onPress: () => any;
    disabled?: ?boolean;
    animated?: ?boolean;
    titleStyle?: Object | number;
    style?: Object | number;
  };

  state: {
    isDisabled: boolean;
    opacityAnim: Object;
  };

  constructor(props) {
    super(props);

    const initBtnDisabled = props.disabled !== undefined && props.disabled;

    this.state = {
      opacityAnim: new Animated.Value(initBtnDisabled ? 0.4 : 1),
    };
  }

  componentWillReceiveProps(props) {
    const { disabled, animated } = this.props;
    const { opacityAnim } = this.state;

    if (disabled === undefined || animated === undefined) return;

    if (!disabled && props.disabled) {
      Animated.timing(opacityAnim, {
        toValue: 0.4,
        duration: 350,
        easing: Easing.easy,
      }).start();
    } else if (disabled && !props.disabled) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.easy,
      }).start();
    }
  }

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
      <Animated.View style={{ opacity: this.state.opacityAnim }}>
        <TouchableOpacity
          style={buttonStyles}
          accessibilityComponentType="button"
          accessibilityTraits={['button']}
          disabled={disabled}
          onPress={onPress}
        >
          <Text style={textStyles}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
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
    fontWeight: '400',
  },

  buttonDisabled: {
    elevation: 0,
    backgroundColor: '#1dcaff',
    borderColor: '#1dcaff',
  },

  textDisabled: {
    color: '#fff',
  },
});