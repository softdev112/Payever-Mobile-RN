import { Component } from 'react';
import { ScrollView } from 'react-native';
import { IconText, StyleSheet, View } from 'ui';
import { ScreenParams } from 'utils';

import type AppItem from '../../../store/profiles/models/AppItem';

export default class Dock extends Component {
  static defaultProps = {
    showApps: true,
  };

  props: {
    apps: Array<AppItem>;
    onAppClick: (item: AppItem) => any;
    showApps?: boolean;
  };

  state: {
    btnsOffset: number;
  };

  constructor(props) {
    super(props);

    this.state = {
      btnsOffset: 0,
    };
  }

  onContentSizeChanges(width) {
    const btnsOffset = (width - ScreenParams.width) / 2;
    this.setState({ btnsOffset });
  }

  renderIcon(item: AppItem) {
    const { showApps, onAppClick } = this.props;

    let title = item.name;
    const logoSource = item.logoSource;
    if (item.label === 'dashboard' && showApps) {
      title = 'Home';
      logoSource.uri = logoSource.uri.replace('dashboard.png', 'home.png');
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
        source={logoSource}
        title={title}
      />
    );
  }

  render() {
    const { apps } = this.props;
    const { btnsOffset } = this.state;

    return (
      <View style={[styles.container, { paddingLeft: -btnsOffset }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={btnsOffset > 0}
          onContentSizeChange={::this.onContentSizeChanges}
        >
          {apps.map(::this.renderIcon)}
        </ScrollView>
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
    height: 55,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, .06)',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -8 },
    elevation: 25,
  },

  icon: {
    width: 80,
    '@media android': {
      width: 85,
    },
  },

  image: {
    width: 40,
    height: 35,
  },

  image_shadow: {},

  title: {
    color: '$pe_color_gray_2',
    fontSize: 11,
    padding: 0,
    fontWeight: '400',
  },

  '@media (min-width: 400)': {
    icon: {
      width: 90,
    },

    image: {
      width: 40,
      height: 35,
    },

    title: {
      fontSize: 12,
      padding: 0,
    },
  },

  '@media (min-width: 550)': {
    container: {
      height: 62,
    },

    icon: {
      width: 110,
    },

    image: {
      width: 45,
      height: 40,
    },

    title: {
      fontSize: 14,
      padding: 0,
    },
  },
});