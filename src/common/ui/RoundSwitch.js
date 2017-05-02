import { Component } from 'react';
import { Animated } from 'react-native';
import Icon from './Icon';
import StyleSheet from './StyleSheet';

const RADIUS = 12;

export default class RoundSwitch extends Component {
  props: {
    onValueChange: () => any;
    style?: Object;
    onIconStyle?: Object;
    offIconStyle?: Object;
    value?: boolean;
  };

  state: {
    isOn: boolean;
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      animValue: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.state.value) {
      this.onPress();
    }
  }

  onPress() {
    const { onValueChange } = this.props;
    const { animValue, value } = this.state;

    this.setState({ value: !value }, Animated.timing(animValue, {
      toValue: 8,
      duration: 600,
    }).start(() => {
      if (onValueChange) {
        onValueChange(!value);
      }

      this.state.animValue.setValue(0);
    }));
  }

  render() {
    const { style, onIconStyle, offIconStyle } = this.props;
    const { animValue, value } = this.state;

    const scale = animValue.interpolate({
      inputRange: [0, 2, 4, 6, 8],
      outputRange: [1, 1.2, 0.9, 1.1, 1],
      extrapolate: 'clamp',
    });

    const containerStyle = [
      styles.container,
      style,
      {
        transform: [{ scale }],
      },
    ];

    let iconStyle;
    let source;
    if (value) {
      iconStyle = [styles.onIcon, onIconStyle];
      source = 'icon-checkbox-checked-24';
    } else {
      iconStyle = [styles.offIcon, offIconStyle];
      containerStyle.push(styles.containerOff);
      source = 'icon-checkbox-24';
    }

    return (
      <Animated.View style={containerStyle}>
        <Icon
          style={iconStyle}
          touchStyle={styles.onBtn}
          source={source}
          onPress={::this.onPress}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS,
    height: 2 * RADIUS,
    width: 2 * RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  containerOff: {
    backgroundColor: '#FFF',
  },

  offBtn: {
    backgroundColor: '$pe_color_gray_2',
  },

  onIcon: {
    color: '$pe_color_blue',
    fontSize: 22,
  },

  offIcon: {
    color: '$pe_color_icon',
    fontWeight: '100',
    fontSize: 22,
  },
});