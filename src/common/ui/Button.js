/* eslint react/prefer-stateless-function: 0 */

import React, { Component } from 'react';
import { Animated, Easing, Text, TouchableOpacity } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Button extends Component {
  props: {
    animated?: boolean;
    disabled?: boolean;
    onPress: () => any;
    style?: Object | number;
    title: string;
    titleStyle?: Object | number;
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
      <Animated.View
        style={[styles.container, { opacity: this.state.opacityAnim }]}
      >
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
  container: {
    '@media android': {
      paddingVertical: 4,
      paddingHorizontal: 1,
    },
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$pe_color_blue',
    borderRadius: 4,
    height: 45,

    '@media ios': {
      height: 41,
    },
    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.8,
  },

  text: {
    color: 'white',
    fontWeight: '400',
    padding: 8,
    textAlign: 'center',
    fontSize: 16,
  },

  textDisabled: {
    color: 'white',
    fontSize: 16,
  },
});