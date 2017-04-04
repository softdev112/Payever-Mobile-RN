import { Component } from 'react';
import {
  Animated, Easing, Picker, Text, TouchableWithoutFeedback, View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import Icon from './Icon';
import StyleSheet from './StyleSheet';

const COLLAPSED_HEIGHT = 50;
const EXPANDED_HEIGHT = 100;

export default class FlatPicker extends Component {
  static defaultProps = {
    placeholder: 'Select value',
  };

  props: {
    placeholder?: string;
    placeholderStyle?: Object;
    style?: Object;
  };

  state: {
    value: string;
    collapsed: true;
    animValue: Animated.Value;
  };

  $animContainer: Animatable.View;

  constructor(props) {
    super(props);

    this.state = {
      value: 'Java',
      collapsed: true,
      animValue: new Animated.Value(0),
    };
  }

  onExpand() {
    const { animValue, collapsed } = this.state;

    Animated.timing(animValue, {
      toValue: collapsed ? 10 : 0,
      duration: 300,
      easing: Easing.inOut,
    }).start(() => this.setState({ collapsed: !collapsed }));
  }

  async shakeElement() {
    await this.$animContainer.shake(300);
  }

  render() {
    const { placeholder, placeholderStyle, style } = this.props;
    const { animValue, collapsed, value } = this.state;

    const height = animValue.interpolate({
      inputRange: [0, 10],
      outputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
    });

    return (
      <Animatable.View
        style={[styles.container, style, { height }]}
        ref={ref => this.$animContainer = ref}
      >
        <TouchableWithoutFeedback
          style={styles.switchBtn}
          onPress={::this.onExpand}
        >
          {collapsed ? (
            <View style={styles.collapsedView}>
              <Text style={[styles.placeholder, placeholderStyle]}>
                {value || placeholder}
              </Text>
              <Icon
                style={styles.placeholder}
                source="icon-arrow-right-3-16"
              />
            </View>
          ) : (
            <Picker
              style={styles.picker}
              selectedValue={this.state.language}
              onValueChange={newValue => this.setState({ value: newValue })}
            >
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker>
          )}
        </TouchableWithoutFeedback>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    height: COLLAPSED_HEIGHT,
  },

  collapsedView: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  placeholder: {
    fontSize: 22,
    fontFamily: '$font_family',
    fontWeight: '200',
    opacity: 0.4,
  },

  switchBtn: {
    zIndex: 101,
  },

  picker: {
    zIndex: 1,
  },
});