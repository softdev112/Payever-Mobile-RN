/* eslint-disable react/prefer-stateless-function */

import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import StyleSheet from '../StyleSheet';

const DEFAULT_HIT_SLOP = 10;

export default class NavBarItem extends Component {
  props: {
    onPress?: () => any;
    children: any;
  };

  render() {
    const { children, onPress } = this.props;

    const hitSlop = {
      top: DEFAULT_HIT_SLOP,
      left: DEFAULT_HIT_SLOP,
      bottom: DEFAULT_HIT_SLOP,
      right: DEFAULT_HIT_SLOP,
    };

    return (
      <TouchableOpacity
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={!onPress}
        hitSlop={hitSlop}
        onPress={onPress}
        style={style.container}
      >
        {children}

      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 6,
  },
});