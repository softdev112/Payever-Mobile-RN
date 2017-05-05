import { Component } from 'react';
import { Animated } from 'react-native';
import { Icon, IconText, StyleSheet, View } from 'ui';

import type AppItem from '../../../store/profiles/models/AppItem';

const FLOAT_DOCK_HIDE_POS = -51;

export default class Dock extends Component {
  static defaultProps = {
    showApps: true,
    floatMode: false,
  };

  props: {
    apps: Array<AppItem>;
    onAppClick: (item: AppItem) => any;
    showApps?: boolean;
    floatMode?: boolean;
  };

  state: {
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      animValue: new Animated.Value(FLOAT_DOCK_HIDE_POS),
    };
  }

  onSwitchDockSate() {
    const { animValue } = this.state;

    /* eslint-disable no-underscore-dangle */
    if (animValue._value === 0) {
      Animated.timing(animValue, {
        toValue: FLOAT_DOCK_HIDE_POS,
        duration: 300,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
      }).start();
    }
    /* eslint-enable no-underscore-dangle */
  }

  onAppIconClick(item: AppItem) {
    const { floatMode, onAppClick } = this.props;

    if (floatMode) {
      this.onSwitchDockSate();
    }

    if (onAppClick) {
      onAppClick(item);
    }
  }

  renderIcon(item: AppItem) {
    const { showApps } = this.props;

    let title = item.name;
    const logoSource = item.logoSource;
    if (item.label === 'dashboard' && showApps) {
      title = 'Home';
      logoSource.uri = logoSource.uri.replace('dashboard.png', 'home.png');
    }

    if (item.label === 'communication') {
      title = 'Chat';
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
        onPress={() => this.onAppIconClick(item)}
        source={logoSource}
        title={title}
      />
    );
  }

  render() {
    const { animValue } = this.state;
    const { apps, floatMode } = this.props;

    const containerStyle = [styles.container];
    if (floatMode) {
      containerStyle.push(styles.floatMode);
      containerStyle.push({ bottom: animValue });
    }

    return (
      <Animated.View style={containerStyle}>
        {floatMode && (
          <View style={styles.header}>
            <Icon
              style={styles.headerIcon}
              tocuhStyle={styles.headerIconTouch}
              source="icon-dots-h-24"
              onPress={::this.onSwitchDockSate}
            />
          </View>
        )}
        <View style={styles.content}>
          {apps.map(::this.renderIcon)}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 2,
    backgroundColor: 'transparent',
    shadowColor: 'rgba(0, 0, 0, .06)',
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -8 },
    elevation: 25,
  },

  content: {
    height: 55,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    backgroundColor: '#fff',
  },

  floatMode: {
    position: 'absolute',
    bottom: FLOAT_DOCK_HIDE_POS,
    zIndex: 1000,
  },

  header: {
    height: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    overflow: 'hidden',
    borderBottomColor: '#FFF',
    borderBottomWidth: 15,
    borderLeftWidth: 7,
    borderLeftColor: 'transparent',
    borderRightWidth: 7,
    borderRightColor: 'transparent',
    width: 50,
  },

  headerIcon: {
    width: 25,
    height: 20,
    color: '$pe_color_icon',
  },

  headerIconTouch: {
    position: 'absolute',
    left: 50,
    top: -5,
  },

  icon: {
    width: 63,
    '@media android': {
      width: 63,
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
      width: 70,
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
      width: 85,
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