import { Component } from 'react';
import { Animated } from 'react-native';
import Icon from './Icon';
import StyleSheet from './StyleSheet';

export default class BottomOverlay extends Component {
  props: {
    children: Array<Component>;
    onRemove?: () => void;
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
    Animated.timing(this.state.animValue, {
      toValue: 50,
      duration: 200,
    }).start();
  }

  onRemove() {
    const { onRemove } = this.props;

    Animated.timing(this.state.animValue, {
      toValue: 0,
      duration: 200,
    }).start(() => {
      if (onRemove) {
        onRemove();
      }
    });
  }

  render() {
    const { children } = this.props;

    return (
      <Animated.View
        style={[styles.container, { bottom: this.state.animValue }]}
      >
        {children}
        <Icon
          touchStyle={styles.delIcon}
          onPress={::this.onRemove}
          source="icon-trashcan-16"
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    width: '100%',
    bottom: 50,
    position: 'absolute',
    backgroundColor: '#FFF',
    paddingVertical: 6,
    alignItems: 'center',
    borderTopColor: '$pe_color_apple_div',
    borderBottomColor: '$pe_color_apple_div',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 0,
  },

  delIcon: {
    width: 30,
  },
});