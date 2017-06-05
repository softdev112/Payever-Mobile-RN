import { Component } from 'react';
import { Animated } from 'react-native';
import Icon from './Icon';
import StyleSheet from './StyleSheet';

export default class BottomOverlay extends Component {
  static defaultProps = {
    startBottom: 0,
    endBottom: 50,
  };

  props: {
    children: Array<Component>;
    onRemove?: () => void;
    startBottom?: number;
    endBottom?: number;
    style?: Object;
  };

  state: {
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      animValue: new Animated.Value(props.startBottom),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.animValue, {
      toValue: this.props.endBottom,
      duration: 200,
    }).start();
  }

  onRemove() {
    const { onRemove, startBottom } = this.props;

    Animated.timing(this.state.animValue, {
      toValue: startBottom,
      duration: 200,
    }).start(() => {
      if (onRemove) {
        onRemove();
      }
    });
  }

  render() {
    const { children, style } = this.props;

    return (
      <Animated.View
        style={[styles.container, { bottom: this.state.animValue }, style]}
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
    elevation: 10,
  },

  delIcon: {
    width: 30,
  },
});