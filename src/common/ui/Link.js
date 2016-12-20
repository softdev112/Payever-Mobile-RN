import { Component } from 'react';
import { Text } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Link extends Component {
  render() {
    return (
      <Text {...this.props} style={[styles.component, this.props.style]} />
    );
  }
}

const styles = StyleSheet.create({
  component: {
    color: '$pe_color_blue'
  }
});