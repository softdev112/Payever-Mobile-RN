import { Component } from 'react';
import { ART, Animated, Easing } from 'react-native';
import { View, StyleSheet } from 'ui';

import svgIcons from './icons';

const {
  Surface,
  Shape,
} = ART;

const ICON_SHOW_TIME = 450;
const ICON_CHANGE_DURATION = 700;
const START_PAYEVER_ICON_DURATION = 3000;

const DEFAULT_PATH_X = 52;
const DEFAULT_PATH_Y = 40;
const DEFAULT_SCALE = 2;

export default class SvgIconsShow extends Component {
  props: {
    style: Object;
  };

  state: {
    animValue: Object;
    currentIcon: number;
    isAnimStoped: boolean;
  };

  constructor(props) {
    super(props);

    this.startAnimation = ::this.startAnimation;

    this.state = {
      animValue: new Animated.Value(1),
      currentIcon: 0,
      isAnimStoped: false,
    };
  }

  componentDidMount() {
    setTimeout(this.startAnimation, START_PAYEVER_ICON_DURATION);
  }

  componentWillUnmount() {
    const { animValue } = this.state;

    this.setState({ isAnimStoped: true });
    animValue.stopAnimation();
  }

  startAnimation() {
    const { animValue, currentIcon, isAnimStoped } = this.state;

    Animated.timing(animValue, {
      toValue: 0,
      duration: ICON_CHANGE_DURATION,
      easing: Easing.quad,
      delay: ICON_SHOW_TIME,
    }).start(() => {
      if (isAnimStoped) return;

      const nextIcon = currentIcon === svgIcons.length - 1
        ? 0 : currentIcon + 1;
      this.setState({ currentIcon: nextIcon });

      Animated.timing(animValue, {
        toValue: 1,
        duration: ICON_CHANGE_DURATION,
        easing: Easing.quad,
      }).start(this.startAnimation);
    });
  }

  renderCurrentIcon() {
    const { currentIcon } = this.state;

    return svgIcons[currentIcon].map((iconPath, index) => {
      return (
        <Shape
          key={index}
          scale={iconPath.scale || DEFAULT_SCALE}
          d={iconPath.path}
          fill={iconPath.fill}
          stroke={iconPath.stroke}
          x={iconPath.x || DEFAULT_PATH_X}
          y={iconPath.y || DEFAULT_PATH_Y}
        />
      );
    });
  }

  render() {
    const { style } = this.props;
    const { animValue } = this.state;

    return (
      <View style={[styles.container, style]}>
        <Animated.View style={{ opacity: animValue }}>
          <Surface width={250} height={250}>
            {this.renderCurrentIcon()}
          </Surface>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});