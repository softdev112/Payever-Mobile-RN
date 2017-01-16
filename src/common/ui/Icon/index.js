import { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import componentFactory from './componentFactory';

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
          hitSlop={hitSlop}
          onPress={onPress}
        >
          <Text>{iconNode}</Text>
        </TouchableOpacity>
      );
    }

    return iconNode;
  }
}