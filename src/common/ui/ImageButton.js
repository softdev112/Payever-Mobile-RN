/* eslint react/prefer-stateless-function: 0 */

import { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

export default class ImageButton extends Component {
  props: {
    source: Object | Number;
    onPress?: () => any;
    style?: Object;
    imageStyle?: Object;
  };

  render() {
    const { onPress, source, style } = this.props;

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
        onPress={onPress}
        style={style}
      >
        <Image style={imageStyle} source={source} />
      </TouchableOpacity>
    );
  }
}