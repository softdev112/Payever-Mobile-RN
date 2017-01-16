/* eslint react/prefer-stateless-function: 0 */

import { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

export default class ImageButton extends Component {
  props: {
    hitSlop?: Object;
    onPress?: () => any;
    source: Object | number;
    style?: Object;
  };

  render() {
    const { hitSlop, onPress, source, style } = this.props;

    const flatStyle = StyleSheet.flatten(style);
    const imageStyle = {
      width: flatStyle.width,
      height: flatStyle.height,
      borderRadius: flatStyle.borderRadius,
    };

    return (
      <TouchableOpacity
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        hitSlop={hitSlop}
        onPress={onPress}
        style={style}
      >
        <Image style={imageStyle} source={source} />
      </TouchableOpacity>
    );
  }
}