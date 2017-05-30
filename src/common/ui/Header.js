/* eslint react/prefer-stateless-function: 0 */

import { Component } from 'react';
import { View } from 'react-native';

import StyleSheet from './StyleSheet';
import Text from './Text';

export default class Header extends Component {
  props: {
    children: any;
    style?: Object | number;
    textStyle?: Object | number;
  };

  render() {
    let { children } = this.props;
    const { textStyle } = this.props;
    if (typeof children === 'string') {
      children = <Text style={[styles.text, textStyle]}>{children}</Text>;
    }

    return (
      <View {...this.props} style={[styles.component, this.props.style]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    '@media ios': {
      marginTop: 10,
    },
    backgroundColor: '#FFF',
    elevation: 8,
  },

  text: {
    color: '$pe_color_dark_gray',
    fontWeight: '400',
    textAlign: 'center',
  },
});