import { PropTypes, Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageSourcePropType from 'react-native/Libraries/Image/ImageSourcePropType';

export default class ImageButton extends Component {
  static propTypes = {
    source: Image.propTypes.source,
    onPress: PropTypes.func,
    style: Image.propTypes.style
  };

  props: {
    source: ImageSourcePropType;
    onPress?: () => any;
    style?: Object;
  };

  render() {
    const { onPress, source, style } = this.props;

    const flatStyle = StyleSheet.flatten(style);
    const imageStyle = {
      width: flatStyle.width,
      height: flatStyle.height,
      borderRadius: flatStyle.borderRadius
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