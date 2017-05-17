import { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import StyleSheet from './StyleSheet';

export default class IconButton extends Component {
  static defaultProps = {
    align: 'column',
  };

  props: {
    align: 'row' | 'column';
    iconStyle?: Object;
    onPress: () => any;
    source: string;
    style?: Object;
    title?: string;
    titleStyle?: Object;
  };

  render() {
    const {
      align, iconStyle, onPress, source, titleStyle, title, style,
    } = this.props;

    const containerStyle = [styles.container, style];
    if (align === 'row') {
      containerStyle.push(styles.rowLayout);
    }

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        align={align}
      >
        <Icon
          style={[styles.icon, iconStyle]}
          source={source}
        />
        <Text numberOfLines={1} style={[styles.title, titleStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },

  icon: {
    fontSize: 20,
    color: '$pe_color_blue',
    marginBottom: 4,
  },

  rowLayout: {
    flexDirection: 'row',
  },

  title: {
    color: '$pe_color_blue',
    fontSize: 12,
  },
});