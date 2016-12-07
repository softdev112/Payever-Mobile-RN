import React, { Component } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Button extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
  };


  props: {
    title: string,
    onPress: () => any,
    disabled?: ?boolean,
  };

  render() {
    const { onPress, title, disabled } = this.props;
    const buttonStyles = [styles.button];
    const textStyles = [styles.text];

    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
      textStyles.push(styles.textDisabled);
    }

    const formattedTitle = Platform.OS === 'android' ? title.toUpperCase() : title;
    return (
      <TouchableOpacity
        accessibilityComponentType="button"
        accessibilityTraits={['button']}
        disabled={disabled}
        onPress={onPress}>
        <View style={buttonStyles}>
          <Text style={textStyles}>{formattedTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  button: {
    elevation: 4,
    backgroundColor: '#0084ff',
    borderRadius: 4,
  },
  text: {
    textAlign: 'center',
    color: 'white',
    padding: 8,
    fontWeight: '500',
  },
  buttonDisabled: {
    elevation: 0,
    backgroundColor: '#dfdfdf'
  },
  textDisabled: {
    color: '#a1a1a1',
  }
});