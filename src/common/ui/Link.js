import { Component } from 'react';
import { Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default class Link extends Component {
  render() {
    return (
      <Text {...this.props} style={[styles.component, this.props.style]} />
    );
  }
}

const styles = EStyleSheet.create({
  component: {
    color: '$pe_color_blue'
  }
});