import { Component } from 'react';
import { Animated, Easing } from 'react-native';
import ScreenParams from '../utils/screenParams';

import Text from './Text';
import StyleSheet from './StyleSheet';

const ANIM_DURATION_KOEF = 0.4;
const MAX_ANIM_HEIGHT = ScreenParams.height - 160;
const START_WIDTH = 300;
const END_WIDTH = 150;

export default class MoveYAnimElement extends Component {
  props: {
    message: string;
    startPosY: number;
    style?: Object;
    onAnimationEnd?: () => void;
  };

  state: {
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      animValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.onPerformAnim();
  }

  onPerformAnim() {
    const { animValue } = this.state;
    const { onAnimationEnd, startPosY } = this.props;

    Animated.timing(animValue, {
      toValue: 10,
      duration: this.getDurationOnRowYPos(startPosY),
      easing: Easing.linear,
    }).start(() => onAnimationEnd && onAnimationEnd());
  }

  getDurationOnRowYPos() {
    // duration = ANIM_DURATION_KOEF * (screenHeight - Y)
    return ANIM_DURATION_KOEF * (ScreenParams.height - this.props.startPosY);
  }

  render() {
    const { message, style, startPosY } = this.props;
    const { animValue } = this.state;

    const translateY = animValue.interpolate({
      inputRange: [0, 10],
      outputRange: [startPosY, MAX_ANIM_HEIGHT],
      extrapolate: 'clamp',
    });

    const opacity = animValue.interpolate({
      inputRange: [0, 10],
      outputRange: [1, 0],
    });

    const width = animValue.interpolate({
      inputRange: [0, 10],
      outputRange: [START_WIDTH, END_WIDTH],
    });

    const containerStyle = [styles.container, { opacity }, { width }, style];
    containerStyle.push({ transform: [{ translateY }] });

    return (
      <Animated.View style={containerStyle}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {message}
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    height: 40,
    width: 200,
    borderColor: '$pe_color_twitter',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },
});