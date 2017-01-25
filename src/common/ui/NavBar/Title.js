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
  };

  context: {
    popup: boolean;
  };

  props: {
    onPress: () => any;
    source: Object | number | string;
    title?: string;
  };

  render() {
    const { onPress, source, title } = this.props;

    const titleStyles = [];
    if (source) {
      titleStyles.push(styles.title_icon);
    }
    if (this.context.popup) {
      titleStyles.push(styles.title_popup);
    }

    return (
      <NavBarItem onPress={onPress}>
        {!!source && (
          <Icon source={source} style={styles.icon} />
        )}
        {!!title && (
          <Text numberOfLines={1} style={[styles.title, titleStyles]}>
            {title}
          </Text>
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
    color: '$pe_color_gray',
    fontSize: 18,
    textAlign: 'center',
    '@media (max-width: 600)': {
      width: 0,
      height: 0,
    },
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
    fontWeight: '300',
    '@media (max-width: 480)': {
      fontSize: 14,
    },
  },
});