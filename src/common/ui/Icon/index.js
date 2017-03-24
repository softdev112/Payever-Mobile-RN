import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import componentFactory from './componentFactory';

const MIN_TOUCHABLE_SIZE = 44;
const DEFAULT_HIT_SLOP   = 10;

/**
 * You can find all icons at https://payeverworldwide.github.io/#svg-usage
 *
 * Some glyphs can't be transformed correctly to font icons. These glyphs
 * are stored as bitmap or as transformed SVG.
 */
export default class Icon extends Component {
  props: {
    hitSlop?: Object;
    onPress?: () => any;
    source: string | Object;
    touchStyle?: Object | number;
  };

  constructor(props) {
    super(props);
    this.state = {
      hitSlop: calcHitSlop(props.hitSlop, props.source),
    };
  }

  render() {
    const { onPress, source, touchStyle } = this.props;
    const { hitSlop } = this.state;
    const iconNode = componentFactory(source, this.props);

    if (onPress) {
      return (
        <TouchableOpacity
          hitSlop={hitSlop}
          onPress={onPress}
          style={touchStyle}
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