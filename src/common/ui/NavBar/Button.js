import { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import { Navigator } from 'react-native-navigation';

import NavBarItem from './NavBarItem';
import StyleSheet from '../StyleSheet';

export default class Button extends Component {
  static defaultProps = {
    align: 'right',
    unwind: false,
    disabled: false,
  };

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    onPress?: () => any;
    title: string;
    style?: Object | number;
    unwind?: boolean;
    disabled?: boolean;
  };

  onPress() {
    const { onPress, unwind } = this.props;

    if (onPress) {
      onPress();
    }

    if (unwind) {
      this.context.navigator.pop({ animated: true });
    }
  }

  render() {
    const { disabled, style, title } = this.props;

    const disableBtn = [styles.title, style];
    if (disabled) {
      disableBtn.push(styles.disabledBtn);
    }

    return (
      <NavBarItem disabled={disabled} onPress={::this.onPress}>
        <Text numberOfLines={1} style={disableBtn}>
          {title}
        </Text>
      </NavBarItem>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '$pe_color_blue',
    fontSize: 16,
  },

  disabledBtn: {
    color: '$pe_color_icon',
  },
});