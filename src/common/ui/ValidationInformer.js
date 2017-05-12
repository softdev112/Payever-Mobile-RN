import { Component } from 'react';
import * as Animatable from 'react-native-animatable';

import StyleSheet from './StyleSheet';

export default class ValidationInformer extends Component {
  static defaultProps = {
    neutralMessage: 'You can enter what ever you want',
    currentState: 'neutral',
  };

  props: {
    neutralMessage?: string;
    errorMessage?: string;
    successMessage?: string;
    currentState?: 'neutral' | 'error' | 'success';
    style: Object;
  };

  $animText: Animatable.Text;

  componentWillReceiveProps(oldProps) {
    if (this.props.currentState !== oldProps.currentState) {
      this.$animText.fadeOut(300);
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.currentState !== oldProps.currentState) {
      this.$animText.fadeIn(300);
    }
  }

  getCurrentValidatorState(): ValidatorState {
    const {
      neutralMessage, errorMessage, successMessage, currentState,
    } = this.props;

    switch (currentState) {
      case 'neutral':
        return {
          message: neutralMessage,
          textStyle: styles.neutralText,
        };

      case 'error':
        return {
          message: errorMessage,
          textStyle: styles.errorText,
        };

      case 'success':
        return {
          message: successMessage,
          textStyle: styles.successText,
        };

      default:
        return {
          message: neutralMessage,
          textStyle: styles.neutralText,
        };
    }
  }

  render() {
    const { style } = this.props;
    const currentValidatorState = this.getCurrentValidatorState();

    return (
      <Animatable.View
        style={[styles.container, style]}
        animation="fadeIn"
        duration={300}
      >
        <Animatable.Text
          style={currentValidatorState.textStyle}
          ref={ref => this.$animText = ref}
        >
          {currentValidatorState.message}
        </Animatable.Text>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
  },

  neutralText: {
    color: '$pe_color_blue',
    fontSize: 12,
  },

  successText: {
    color: '$pe_color_dark_green',
    fontSize: 12,
  },

  errorText: {
    color: '$pe_color_dark_red',
    fontSize: 12,
  },
});

type ValidatorState = {
  message: string;
  textStyle: Object;
  containerStyle: Object;
};