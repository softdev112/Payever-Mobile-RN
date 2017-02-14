/* eslint react/prefer-stateless-function: 0 */

import { Component } from 'react';
import { Text as ReactText } from 'react-native';

import StyleSheet from './StyleSheet';

export default class Text extends Component {
  props: {
    style?: Object | number;
  };

  render() {
    return (
      <ReactText
        {...this.props}
        style={[styles.container, this.props.style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    color: '$pe_color_dark_gray',
    fontFamily: '$font_family',
    fontWeight: '200',
  },
});