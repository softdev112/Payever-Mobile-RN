/* eslint react/prefer-stateless-function: 0 */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import StyleSheet from './StyleSheet';

export default class TextButton extends Component {
  props: {
    disabled?: boolean;
    onPress: () => any;
    style?: Object | number;
    title: string;
    titleStyle?: Object | number;
  };

  render() {
    const { onPress, title, disabled, style, titleStyle } = this.props;

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          accessibilityComponentType="button"
          accessibilityTraits={['button']}
          disabled={disabled}
          onPress={onPress}
        >
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },

  title: {
    fontSize: 16,
    fontWeight: '400',
    color: '$pe_color_blue',
  },
});