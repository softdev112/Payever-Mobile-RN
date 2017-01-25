import { Component } from 'react';
import { Text } from 'react-native';
import Icon from '../Icon';
import NavBarItem from './NavBarItem';
import StyleSheet from '../StyleSheet';

export default class IconButton extends Component {
  static defaultProps = {
    align: 'right',
  };

  props: {
    align: 'left' | 'right' | 'middle';
    imageStyle?: Object | number;
    onPress: () => any;
    source: Object | number | string;
    title?: string;
    titleStyle?: Object | number;
  };

  render() {
    const {
      align, imageStyle, onPress, source, titleStyle, title,
    } = this.props;

    let iconStyle;
    if (typeof source === 'string') {
      iconStyle = styles.icon;
    }

    return (
      <NavBarItem onPress={onPress} align={align}>
        <Icon source={source} style={[styles.image, iconStyle, imageStyle]} />
        {!!title && (
          <Text numberOfLines={1} style={[styles.title, titleStyle]}>
            {title}
          </Text>
        )}
      </NavBarItem>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: '$pe_color_blue',
  },

  image: {
    height: 24,
    width: 24,
  },

  title: {
    color: '$pe_color_blue',
    fontSize: 15,
    marginLeft: 6,
    '@media (max-width: 991)': {
      width: 0,
      height: 0,
      marginLeft: 0,
    },
  },
});