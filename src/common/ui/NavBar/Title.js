import { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import Icon from '../Icon';
import StyleSheet from '../StyleSheet';
import NavBarItem from './NavBarItem';

export default class Title extends Component {
  static contextTypes = {
    popup: PropTypes.bool,
  };

  static defaultProps = {
    align: 'center',
    showTitle: 'size-dep',
  };

  context: {
    popup: boolean;
  };

  props: {
    onPress: () => any;
    source: Object | number | string;
    title?: string;
    showTitle?: 'size-dep' | 'always' | 'never';
  };

  render() {
    const { onPress, source, showTitle, title } = this.props;
    const { popup } = this.context;

    const titleStyles = [popup ? styles.title_popup : styles.title];
    if (source) {
      titleStyles.push(styles.title_icon);
    }

    switch (showTitle) {
      case 'always':
        titleStyles.push(styles.showTitle);
        break;

      case 'never':
        titleStyles.push(styles.hideTitle);
        break;

      case 'size-dep':
        titleStyles.push(styles.sizeDepTitle);
        break;

      default:
        titleStyles.push(styles.sizeDepTitle);
        break;
    }

    return (
      <NavBarItem onPress={onPress}>
        {!!source && (
          <Icon source={source} style={styles.icon} />
        )}
        {!!title && (
          <Text numberOfLines={1} style={titleStyles}>{title}</Text>
        )}
      </NavBarItem>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderColor: '#00000014',
    borderWidth: 1,
  },

  title: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },

  title_icon: {
    marginLeft: 13,
    textAlign: 'left',
    '@media (max-width: 600)': {
      marginLeft: 0,
    },
  },

  title_popup: {
    color: '$pe_color_black',
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    '@media (max-width: 480)': {
      fontSize: 16,
    },
  },

  showTitle: {
  },

  hideTitle: {
    width: 0,
    height: 0,
  },

  sizeDepTitle: {
    '@media (max-width: 600)': {
      width: 0,
      height: 0,
    },
  },
});