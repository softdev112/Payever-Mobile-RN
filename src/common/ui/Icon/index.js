import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import componentFactory from './componentFactory';

const MIN_TOUCHABLE_SIZE = 44;
const DEFAULT_HIT_SLOP   = 10;

/**
 * You can find all icons at https://payeverworldwide.github.io/#svg-usage
 *
 * Some glyphs can't be transformed correctly to font icons. These glyphs
 * are stored as bitmap.
 */
export default class Icon extends Component {
  static defaultProps = { hitSlop: { top: 2, left: 2, bottom: 2, right: 2 } };

  props: {
    source: string | Object;
    onPress?: () => any;
    hitSlop?: Object;
  };

  render() {
    const { onPress, source, hitSlop } = this.props;
    const iconNode = componentFactory(source, this.props);

    if (onPress) {
      return (
        <TouchableOpacity
          hitSlop={calcHitSlop(hitSlop, source)}
          onPress={onPress}
        >
          {iconNode}
        </TouchableOpacity>
      );
    }

    return iconNode;
  }
}

function calcHitSlop(providedHitSlop, source) {
  let hitSlop;

  if (providedHitSlop && typeof providedHitSlop === 'object') {
    return providedHitSlop;
  }

  if (providedHitSlop) {
    hitSlop = providedHitSlop;
  }

  if (!hitSlop && typeof source === 'string') {
    const size = source.match(/\d{2}$/);
    if (size) {
      hitSlop = (MIN_TOUCHABLE_SIZE - size) / 2;
    }
  }

  if (!hitSlop) {
    hitSlop = DEFAULT_HIT_SLOP;
  }

  return {
    top: hitSlop,
    left: hitSlop,
    bottom: hitSlop,
    right: hitSlop,
  };
}