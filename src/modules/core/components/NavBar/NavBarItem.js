/**
 * Created by Elf on 17.01.2017.
 */
/* eslint react/prefer-stateless-function: 0 */
import { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon, Image, View, Text, StyleSheet } from 'ui';

const DEFAULT_HIT_SLOP   = 10;

export default class NavBarItem extends Component {
  static defaultProps = {
    align: 'row',
  };

  props: {
    title?: string;
    source: Object | number | string;
    onPress: () => any;
    style?: Object;
    imageStyle?: Object;
    titleStyle?: Object;
    align?: string;
  };

  render() {
    const {
      onPress, source, title, imageStyle, titleStyle, style, align,
    } = this.props;

    const buttonStyles = [styles.button, style, { flexDirection: align }];
    const imageStyles = [styles.image, imageStyle];
    const titleStyles = [styles.title, titleStyle];

    let textNode = null;
    if (title) {
      textNode = (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={titleStyles}
        >
          {title}
        </Text>
      );
    }

    const flatImgStyle = StyleSheet.flatten(imageStyles);
    let imgStyle;
    let imgNode = null;

    switch (typeof source) {
      case 'object':
      case 'number': {
        imgStyle = {
          width: flatImgStyle.width,
          height: flatImgStyle.height,
          borderRadius: flatImgStyle.borderRadius,
        };

        imgNode = <Image style={imgStyle} source={source} />;
        break;
      }

      case 'string': {
        imgStyle = {
          fontSize: flatImgStyle.fontSize,
          color: flatImgStyle.color,
        };

        imgNode = <Icon style={imgStyle} source={source} />;
        break;
      }

      default: {
        imgNode = null;
        break;
      }
    }

    delete flatImgStyle.width;
    delete flatImgStyle.height;
    delete flatImgStyle.fontSize;
    delete flatImgStyle.color;

    const hitSlop = {
      top: DEFAULT_HIT_SLOP,
      left: DEFAULT_HIT_SLOP,
      bottom: DEFAULT_HIT_SLOP,
      right: DEFAULT_HIT_SLOP,
    };

    return (
      <TouchableOpacity
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={!onPress}
        hitSlop={hitSlop}
        onPress={onPress}
      >
        <View style={buttonStyles}>
          <View style={flatImgStyle}>
            {imgNode}
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
    padding: 2,
  },

  image: {
    width: 32,
    height: 32,
    color: '$pe_color_blue',
    fontSize: 24,
  },

  title: {
    textAlign: 'center',
    color: '$pe_color_blue',
    fontSize: 16,
  },
});