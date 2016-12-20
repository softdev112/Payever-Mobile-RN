import { Component } from 'react';
import { Text as ReactText } from 'react-native';

import StyleSheet from './StyleSheet';

export default class Text extends Component {
  static propTypes = {
    style: ReactText.propTypes.style
  };

  props: {
    style?: Object | Number;
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
    fontFamily: '$font_family'
  }
});