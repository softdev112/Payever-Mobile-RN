/* eslint-disable react/prefer-stateless-function */

import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import StyleSheet from '../StyleSheet';

const DEFAULT_HIT_SLOP = 10;

export default class NavBarItem extends Component {
  static defaultProps = {
    align: 'moddle',
  };

  props: {
    onPress?: () => any;
    children: any;
    align?: 'left' | 'right' | 'middle';
  };

  getAlignStyles(align: 'left' | 'right' | 'middle') {
    switch (align) {
      case 'left':
        return styles.alignLeft;
      case 'right':
        return styles.alignRight;
      case 'middle':
        return styles.alignMiddle;
      default:
        return styles.alignMiddle;
    }
  }

  render() {
    const { align, children, onPress } = this.props;

    const hitSlop = {
      top: DEFAULT_HIT_SLOP,
      left: DEFAULT_HIT_SLOP,
      bottom: DEFAULT_HIT_SLOP,
      right: DEFAULT_HIT_SLOP,
    };

    const touchElementStyle = [styles.container, this.getAlignStyles(align)];

    return (
      <TouchableOpacity
        style={touchElementStyle}
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={!onPress}
        hitSlop={hitSlop}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 6,
  },

  alignMiddle: {
    justifyContent: 'center',
  },

  alignLeft: {
    justifyContent: 'flex-start',
  },

  alignRight: {
    justifyContent: 'flex-end',
  },
});