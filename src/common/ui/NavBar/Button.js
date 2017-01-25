import { Component } from 'react';
import { Text } from 'react-native';
import NavBarItem from './NavBarItem';
import StyleSheet from '../StyleSheet';

export default class Button extends Component {
  static defaultProps = {
    align: 'right',
  };

  props: {
    onPress?: () => any;
    title: string;
    style?: Object | number;
  };

  render() {
    const { onPress, style, title } = this.props;

    return (
      <NavBarItem onPress={onPress}>
        <Text numberOfLines={1} style={[styles.title, style]}>
          {title}
        </Text>
      </NavBarItem>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '$pe_color_dark_gray',
    fontSize: 15,
  },
});