import { Component } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';

import StyleSheet from '../StyleSheet';
import vector from './vector.json';
import bitmap from './bitmap';

/**
 * You can find all icons at https://payeverworldwide.github.io/#svg-usage
 *
 * Some glyphs can't be transformed correctly to font icons. These glyphs
 * are stored as bitmap.
 */
export default class Icon extends Component {
  props: {
    name: string;
    onPress?: () => any;
    style?: Object | Number;
  };

  renderRaster(bmp: Bitmap) {
    const style = Object.assign({}, StyleSheet.flatten(this.props.style));
    if (style.color) {
      style.tintColor = style.color;
      delete style.color;
    }

    const bmpStyle = {
      width: bmp.width,
      height: bmp.height,
    };
    return (
      <Image
        {...this.props}
        style={[bmpStyle, style]}
        source={bmp.image}
      />
    );
  }

  renderVector(glyph: Glyph) {
    const { style } = this.props;
    const unicode = glyph.unicode;
    const glyphStyle = {
      color: glyph.color === 'black' ? null : glyph.color,
      fontSize: glyph.width || 24,
    };
    return (
      <Text {...this.props} style={[styles.glyph, glyphStyle, style]}>
        {unicode}
      </Text>
    );
  }

  render() {
    const { name, onPress } = this.props;
    let imgNode;

    if (bitmap[name]) {
      imgNode = this.renderRaster(bitmap[name]);
    } else if (vector[name]) {
      imgNode = this.renderVector(vector[name]);
    } else {
      throw new Error(`Icon: Glyph ${name} not found.`);
    }

    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress}>{imgNode}</TouchableOpacity>
      );
    }

    return imgNode;
  }
}

const styles = StyleSheet.create({
  glyph: {
    fontFamily: 'payeverIcons',
  },
});

type Glyph = {
  unicode: string;
  color: string;
  width: number;
  height: number;
}

type Bitmap = {
  image: number;
  width: number;
  height: number;
}