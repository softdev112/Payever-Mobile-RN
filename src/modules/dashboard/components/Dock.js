import { Component } from 'react';
import { IconText, StyleSheet, View } from 'ui';

import type AppItem from '../../../store/UserProfilesStore/models/AppItem';

export default class Dock extends Component {
  static defaultProps = {
    showApps: true,
  };

  props: {
    apps: Array<AppItem>;
    onAppClick: (item: AppItem) => any;
    showApps?: boolean;
  };

  renderIcon(item: AppItem) {
    const { showApps, onAppClick } = this.props;

    let title = item.name;
    if (item.label === 'dashboard' && showApps) {
      title = 'Home';
    }

    const imageStyles = [
      styles.image,
      item.label === 'dashboard' ? null : styles.image_shadow,
    ];

    return (
      <IconText
        style={styles.icon}
        key={item.label}
        imageStyle={imageStyles}
        textStyle={styles.title}
        onPress={() => onAppClick(item)}
        source={item.logoSource}
        title={title}
      />
    );
  }

  render() {
    const { apps } = this.props;
    return (
      <View style={styles.container}>
        {apps.map(::this.renderIcon)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    height: 80,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, .06)',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -8 },
    elevation: 25,
  },

  icon: {
    width: 63,
  },

  image: {
    width: 40,
    height: 40,
  },

  image_shadow: {},

  title: {
    color: '$pe_color_gray_2',
    fontSize: 10,
    fontWeight: '400',
    paddingTop: 5,
  },

  '@media (min-width: 400)': {
    container: {
      height: 105,
    },

    icon: {
      width: 70,
    },

    image: {
      width: 60,
      height: 60,
    },

    title: {
      fontSize: 12,
    },
  },

  '@media (min-width: 550)': {
    container: {
      height: 135,
    },

    icon: {
      width: 105,
    },

    image: {
      width: 80,
      height: 80,
    },

    image_shadow: {
      borderRadius: 18,
      elevation: 4,
      shadowColor: 'rgba(0, 0, 0, .1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 14,
    },

    title: {
      fontSize: 15,
      backgroundColor: 'transparent',
    },
  },
});