import { Component } from 'react';
import { Animated, Easing, View } from 'react-native';
import Icon from './Icon';
import StyleSheet from './StyleSheet';

export default class Loader extends Component {
  props: {
    children?: any;
    isLoading?: boolean;
    style?: Object | number;
  };

  spinValue: Animated;

  constructor(params) {
    super(params);
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.spin();
  }

  spin() {
    //noinspection JSUnresolvedFunction
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
      .start(() => this.spin());
  }

  renderInline() {
    const { isLoading, style } = this.props;
    if (!isLoading) {
      return null;
    }

    //noinspection JSUnresolvedFunction
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={[styles.loaderContainer, style]}>
        <Animated.View
          style={[styles.animatedElement, { transform: [{ rotate: spin }] }]}
        >
          <Icon source="spinner" />
        </Animated.View>
      </View>
    );
  }

  renderContainer() {
    const { isLoading, children } = this.props;
    if (!isLoading) {
      if (Array.isArray(children)) {
        throw new Error('Loader can contain only a single element');
      }
      return children;
    }
    return this.renderInline();
  }

  render() {
    const { children } = this.props;
    if (children) {
      return this.renderContainer();
    }
    return this.renderInline();
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  animatedElement: {
    '@media ios': {
      paddingTop: 1,
    },
    '@media android': {
      paddingBottom: 1,
    },
    paddingLeft: 1,
  },
});