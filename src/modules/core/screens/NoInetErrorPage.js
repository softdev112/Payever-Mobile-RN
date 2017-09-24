import { Component } from 'react';
import { Image } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { images, Text, View } from 'ui';
import { networkHelper, screenParams } from 'utils';

import { showScreen } from '../../../common/Navigation';
import StyleSheet from '../../../common/ui/StyleSheet';
import type { Config } from '../../../config';

const START_PING_PERIOD = 3000;
const PING_PERIOD_STEP = 5400;

// Periods then increase ping time
// 5 min 10 min 15 min 20 min 25 min 30 min
const FIRST_PERIOD = 300000;
const SECOND_PERIOD = 600000;
const THIRD_PERIOD = 900000;
const THOUTH_PERIOD = 1200000;
const FIVE_PERIOD = 1500000;
const SIX_PERIOD = 1800000;

@inject('config')
@observer
export default class NoInetErrorPage extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    config: Config;
  };

  state: {
    currentKoef: number;
    startDate: number;
  };

  pingTimerId: number;

  constructor(props) {
    super(props);

    this.onPingTimer = this.onPingTimer.bind(this);

    this.state = {
      currentKoef: 0,
      startDate: Date.now(),
    };
  }

  componentDidMount() {
    this.pingTimerId = setInterval(this.onPingTimer, START_PING_PERIOD);
  }

  componentWillUnmount() {
    clearInterval(this.pingTimerId);
    this.pingTimerId = null;
  }

  async onPingTimer() {
    const { config } = this.props;
    const { currentKoef, startDate } = this.state;

    if (await networkHelper.isConnected()) {
      showScreen('core.AllWebView', { passProps: { uri: config.siteUrl } });
      return;
    }

    const timePassed = Date.now() - startDate;
    let mulKoef = 0;
    if (timePassed > FIRST_PERIOD && timePassed <= SECOND_PERIOD) {
      mulKoef = 1;
    } else if (timePassed > SECOND_PERIOD && timePassed <= THIRD_PERIOD) {
      mulKoef = 2;
    } else if (timePassed > THIRD_PERIOD && timePassed <= THOUTH_PERIOD) {
      mulKoef = 3;
    } else if (timePassed > FIVE_PERIOD && timePassed <= SIX_PERIOD) {
      mulKoef = 4;
    } else if (timePassed > SIX_PERIOD) {
      mulKoef = 5;
    }

    if (mulKoef === currentKoef) {
      return;
    }

    const nextPingPeriod = START_PING_PERIOD + (mulKoef * PING_PERIOD_STEP);
    clearInterval(this.pingTimerId);
    this.pingTimerId = setInterval(::this.onPingTimer(), nextPingPeriod);

    this.setState({ currentKoef: mulKoef });
  }

  render() {
    return (
      <Image
        style={[styles.container, StyleSheet.absoluteFillObject]}
        source={images.background}
        resizeMode="cover"
        blurRadius={10}
      >
        <View style={styles.blackOverlay}>
          <Image
            style={styles.logoImage}
            source={images.bigLogo}
            resizeMode="contain"
          />
          <View style={styles.belowTextCont}>
            <Text style={styles.bigText}>Payever Services not available</Text>
            <Text style={styles.smallText}>no internet connection</Text>
          </View>
        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenParams.width,
    height: screenParams.height,
  },

  logoImage: {
    marginTop: 100,
    width: 300,
    height: 50,
  },

  bigText: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 22,
  },

  smallText: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 16,
  },

  blackOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000000BB',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  belowTextCont: {
    alignItems: 'center',
    height: '60%',
  },
});