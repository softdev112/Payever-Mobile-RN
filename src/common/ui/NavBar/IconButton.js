import { Component } from 'react';
import { Text } from 'react-native';
import Icon from '../Icon';
import NavBarItem from './NavBarItem';
import StyleSheet from '../StyleSheet';

export default class IconButton extends Component {
  static defaultProps = {
    align: 'right',
    showTitle: 'size-dep',
  };

  props: {
    align?: 'left' | 'right' | 'center';
    imageStyle?: Object | number;
    onPress: () => any;
    source: Object | number | string;
    title?: string;
    titleStyle?: Object | number;
    showTitle?: 'size-dep' | 'always' | 'never';
  };

  render() {
    const {
      align, imageStyle, onPress, source, showTitle, titleStyle, title,
    } = this.props;

    let iconStyle;
    if (typeof source === 'string') {
      iconStyle = styles.icon;
    }

    const titleFinalStyle = [styles.title, titleStyle];
    let isShowTitle = !!title;

    switch (showTitle) {
      case 'always':
        isShowTitle = true;
        break;

      case 'size-dep':
        titleFinalStyle.push(styles.titleSizeDepDisable);
        isShowTitle = true;
        break;

      case 'never':
        isShowTitle = false;
        break;

      default:
        isShowTitle = false;
        break;
    }

    return (
      <NavBarItem onPress={onPress} align={align}>
        <Icon
          style={[styles.image, iconStyle, imageStyle]}
          source={source}
          touchStyle={styles.iconTouchElement}
        />
        {isShowTitle && (
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

  iconTouchElement: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'blue',
    borderWidth: 1,
  },

  title: {
    color: '$pe_color_blue',
    fontSize: 16,
    marginLeft: 2,
  },

  titleSizeDepDisable: {
    '@media (max-width: 991)': {
      width: 0,
      height: 0,
      marginLeft: 0,
    },
  },
});