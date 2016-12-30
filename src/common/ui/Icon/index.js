import { Component } from 'react';
import { TouchableOpacity } from 'react-native';

import componentFactory from './componentFactory';

/**
 * You can find all icons at https://payeverworldwide.github.io/#svg-usage
 *
 * Some glyphs can't be transformed correctly to font icons. These glyphs
 * are stored as bitmap.
 */
export default class Icon extends Component {
  props: {
    source: string | Object;
    onPress?: () => any;
  };

  render() {
    const { onPress, source } = this.props;
    const iconNode = componentFactory(source, this.props);

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress}>{iconNode}</TouchableOpacity>
      );
    }

    return iconNode;
  }
}