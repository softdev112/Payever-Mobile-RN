import { Component, PropTypes } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import StyleSheet from '../StyleSheet';
import map from './map.json';

/**
 * You can find all icons at https://payeverworldwide.github.io/#svg-usage
 */
export default class Icon extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    style: Text.propTypes.style
  };

  props: {
    name: string;
    onPress?: () => any;
    style?: Object | Number;
  };

  render() {
    const { name, style, onPress } = this.props;

    const glyph = map[name];
    if (!glyph) {
      throw new Error(`Icon: Glyph ${name} not found.`);
    }

    const unicode = glyph.unicode;
    const colorStyle = glyph.color === 'black' ? null : { color: glyph.color };

    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress}>
          <Text {...this.props} style={[styles.container, colorStyle, style]}>
            {unicode}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Text {...this.props} style={[styles.container, colorStyle, style]}>
        {unicode}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'payeverIcons',
    fontSize: 24
  }
});