import { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';
import StyleSheet from './StyleSheet';

export default class SocialIconButton extends Component {
  props: {
    disabled?: boolean;
    onPress: () => any;
    style?: Object | number;
    title: string;
    titleStyle?: Object | number;
    iconSource: string;
    iconStyle: Object;
  };

  state: {
    pressed: boolean;
  };

  constructor(props) {
    super(props);

    this.state = {
      pressed: false,
    };
  }

  render() {
    const {
      onPress, title, disabled, style, titleStyle, iconSource, iconStyle,
    } = this.props;

    const buttonStyles = [styles.button, style];
    const textStyles = [styles.title, titleStyle];
    const btnIconStyle = [styles.icon, iconStyle];

    const activeColor = StyleSheet.flatten(style).backgroundColor || '#0084ff';
    buttonStyles.push({ borderColor: activeColor });
    if (this.state.pressed) {
      buttonStyles.push({ backgroundColor: 'white' });
      textStyles.push({ color: activeColor });
      btnIconStyle.push({ color: activeColor });
    }

    return (
      <TouchableOpacity
        style={buttonStyles}
        activeOpacity={0.9}
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => this.setState({ pressed: true })}
        onPressOut={() => this.setState({ pressed: false })}
        delayPressOut={150}
      >
        <View style={styles.insideContainer}>
          <Icon style={btnIconStyle} source={iconSource} />
          <Text style={textStyles}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '$pe_color_blue',
    borderColor: '$pe_color_blue',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    width: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },

  insideContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 16,
  },

  icon: {
    fontSize: 25,
    color: 'white',
    marginRight: 8,
  },
});