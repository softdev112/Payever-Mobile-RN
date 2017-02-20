import { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import type { Navigator } from 'react-native-navigation';
import StyleSheet from './StyleSheet';

export default class Link extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    children?: any;
    props?: Object;
    style?: Object | number;
    screen?: string;
  };

  onPress() {
    const { children, props: passProps, screen } = this.props;
    const { navigator } = this.context;
    const title = typeof children === 'string' ? children : undefined;

    navigator.push({
      passProps,
      screen,
      title,
    });
  }

  render() {
    return (
      <Text
        onPress={::this.onPress}
        {...this.props}
        style={[styles.component, this.props.style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  component: {
    color: '$pe_color_blue',
    fontWeight: '400',
  },
});