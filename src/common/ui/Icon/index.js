import { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import StyleSheet from '../StyleSheet';
//noinspection JSUnresolvedVariable
import stacked from './stacked.json';
//noinspection JSUnresolvedVariable
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

  renderRaster(bmp: Bitmap, componentStyle = {}, props = {}) {
    const style = Object.assign({}, StyleSheet.flatten(componentStyle));
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
        {...props}
        style={[bmpStyle, style]}
        source={bmp.image}
      />
    );
  }

  renderVector(glyph: Glyph, componentStyle, props = {}) {
    const unicode = glyph.unicode;
    const glyphStyle = {
      color: glyph.color === 'black' ? null : glyph.color,
      fontSize: glyph.width || 24,
    };
    return (
      <Text {...props} style={[styles.glyph, glyphStyle, componentStyle]}>
        {unicode}
      </Text>
    );
  }

  renderStacked(stack: Stacked, componentStyle) {
    const imgNodes = [];

    stack.layers.forEach(({ name, style }) => {
      if (bitmap[name]) {
        imgNodes.push(this.renderRaster(
          bitmap[name],
          [styles.stacked, style],
          { key: name }
        ));
      } else if (vector[name]) {
        imgNodes.push(this.renderVector(
          vector[name],
          [styles.stacked, style],
          { key: name }
        ));
      } else {
        throw new Error(`Icon stacked: Glyph ${name} not found.`);
      }
    });

    return (
      <View style={[stack.style, componentStyle]}>
        {imgNodes}
      </View>
    );
  }

  render() {
    const { name, onPress, style } = this.props;
    let imgNode;

    if (stacked[name]) {
      imgNode = this.renderStacked(stacked[name], style, this.props);
    } else if (bitmap[name]) {
      imgNode = this.renderRaster(bitmap[name], style, this.props);
    } else if (vector[name]) {
      imgNode = this.renderVector(vector[name], style, this.props);
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

  stacked: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent'
  },
});

type Glyph = {
  unicode: string;
  color: string;
  width: number;
  height: number;
};

type Bitmap = {
  image: number;
  width: number;
  height: number;
};

type Stacked = {
  style: Object;
  layers: Array<StackedLayer>
};

type StackedLayer = {
  name: string;
};