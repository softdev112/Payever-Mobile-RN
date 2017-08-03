import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { Animated, WebView } from 'react-native';
import { Icon, StyleSheet, View } from 'ui';
import WKWebView from 'react-native-wkwebview-reborn';
import type { Config } from '../../../config';

const HIDE_POS = -108;
const SHOW_POS = -8;

@inject('config')
@observer
export default class AllWebView extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    config: Config;
  };

  state: {
    touchTime: number;
  };

  $webView: WebView;
  animValue: Animated.Value;

  constructor(props) {
    super(props);

    this.state = {
      touchTime: 0,
      animValue: new Animated.Value(HIDE_POS),
    };
  }

  onGoBack() {
    if (this.$webView) {
      this.$webView.goBack();
      this.onSwitchNavMenu();
    }
  }

  onGoForward() {
    if (this.$webView) {
      this.$webView.goForward();
      this.onSwitchNavMenu();
    }
  }

  onSwitchNavMenu() {
    /* eslint-disable no-underscore-dangle */
    const { animValue } = this.state;
    let toValue = SHOW_POS;
    if (animValue._value !== HIDE_POS) {
      toValue = HIDE_POS;
    }

    Animated.timing(animValue, {
      toValue,
      duration: 200,
    }).start();
    /* eslint-enable no-underscore-dangle */
  }

  render() {
    const { config } = this.props;
    const { animValue } = this.state;

    return (
      <View style={styles.container}>
        <WKWebView
          ref={r => this.$webView = r}
          source={{ uri: config.siteUrl }}
          userAgent="Mozilla/5.0"
        />
        <Animated.View style={[styles.navBar, { right: animValue }]}>
          <Icon
            style={styles.backIcon}
            touchStyle={styles.drawBtn}
            source="fa-ellipsis-v"
            onPress={::this.onSwitchNavMenu}
          />

          <Icon
            style={styles.backIcon}
            touchStyle={styles.backBtn}
            source="icon-arrow-left-ios-24"
            onPress={::this.onGoBack}
          />
          <Icon
            style={styles.backIcon}
            touchStyle={styles.backBtn}
            source="icon-arrow-right-ios-24"
            onPress={::this.onGoBack}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backIcon: {
    color: '$pe_color_light_gray',
  },

  drawBtn: {
    width: 10,
    height: 30,
    marginRight: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  backBtn: {
    width: 35,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  navBar: {
    position: 'absolute',
    top: '76%',
    right: HIDE_POS,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 20,
  },
});