import { PropTypes, Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class ImageButton extends Component {
  static propTypes = {
    title: PropTypes.string,
    source: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.number.isRequired
    ]),
    disabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    imageStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    textStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ])
  };

  props: {
    title: ?string,
    source: ImageSourcePropType,
    onPress: () => any,
    disabled?: ?boolean,
    style: Object,
    imageStyle: Object,
    textStyle: Object
  };

  render() {
    const {
      onPress, source, title, disabled, imageStyle, textStyle, style
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
          style={textStyles}>{title}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={disabled}
        onPress={onPress}>
        <View style={buttonStyles}>
          <Image style={imageStyles} source={source} />
          {textNode}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  button: {
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60
  },
  text: {
    textAlign: 'center',
    padding: 8
  },
  buttonDisabled: {
    elevation: 0
  },
  imageDisabled: {
    opacity: .3,
  },
  textDisabled: {
    color: '#a1a1a1',
  }
});