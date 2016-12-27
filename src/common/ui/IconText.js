/* eslint react/prefer-stateless-function: 0*/

import { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import StyleSheet from './StyleSheet';
import Text from './Text';

export default class IconText extends Component {
  props: {
    title?: string;
    source: Object | number;
    onPress: () => any;
    disabled?: ?boolean;
    style?: Object;
    imageStyle?: Object;
    textStyle?: Object;
  };

  render() {
    const {
      onPress, source, title, disabled, imageStyle, textStyle, style,
    } = this.props;
    const buttonStyles = [styles.button, style];
    const imageStyles = [styles.image, imageStyle];
    const textStyles = [styles.text, textStyle];

    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      imageStyles.push(styles.imageDisabled);
      textStyles.push(styles.textDisabled);
    }

    let textNode = null;
    if (title) {
      textNode = (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={textStyles}
        >
          {title}
        </Text>
      );
    }

    const flatStyle = StyleSheet.flatten(imageStyles);
    const imgStyle = {
      width: flatStyle.width,
      height: flatStyle.height,
      borderRadius: flatStyle.borderRadius,
    };

    delete flatStyle.width;
    delete flatStyle.height;

    return (
      <TouchableOpacity
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={disabled}
        onPress={onPress}
      >
        <View style={buttonStyles}>
          <View style={flatStyle}>
            <Image style={imgStyle} source={source} />
          </View>
          {textNode}
        </View>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },

  image: {
    width: 60,
    height: 60,
  },

  text: {
    textAlign: 'center',
    padding: 8,
    color: '$pe_color_dark_gray',
  },

  buttonDisabled: {
    elevation: 0,
  },

  imageDisabled: {
    opacity: 0.3,
  },

  textDisabled: {
    color: '#a1a1a1',
  },
});