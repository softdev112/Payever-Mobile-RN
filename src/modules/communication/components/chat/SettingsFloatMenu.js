import { Component, PropTypes } from 'react';
import { Animated } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type { Navigator } from 'react-native-navigation';
import { Icon, StyleSheet } from 'ui';

import CommunicationStore from '../../../../store/communication';

const INIT_TOP = 20;
const SHOW_TOP = 70;

@inject('communication')
@observer
export default class SettingsFloatMenu extends Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
  };

  context: {
    navigator: Navigator;
  };

  props: {
    communication?: CommunicationStore;
    conversationId: number;
    onRemove?: (cb?: () => void) => void;
    style?: Object;
  };

  state: {
    animValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      animValue: new Animated.Value(INIT_TOP),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.animValue, {
      toValue: SHOW_TOP,
      duration: 200,
    }).start();
  }

  onSendOffer() {
    const { conversationId } = this.props;

    this.context.navigator.push({
      screen: 'marketing.CreateOffer',
      passProps: { conversationId },
    });

    this.onRemove();
  }

  onRemove() {
    this.hideSettingsPopup(this.props.onRemove);
  }

  onSwitchNotificationSetting() {
    const { communication } = this.props;
    const { messengerInfo, selectedConversationId } = communication;

    const notifOn = messengerInfo.byId(selectedConversationId).notification;
    communication.changeConvNotificationProp(!notifOn);
  }

  hideSettingsPopup(cb: () => void) {
    Animated.timing(this.state.animValue, {
      toValue: INIT_TOP,
      duration: 200,
    }).start(() => {
      if (cb) cb();
    });
  }

  render() {
    const { communication, style } = this.props;
    const { messengerInfo, selectedConversationId } = communication;
    const { animValue } = this.state;

    const notifIconStyle = [styles.icon];
    const notifOn = messengerInfo.byId(selectedConversationId).notification;
    if (notifOn) {
      notifIconStyle.push(styles.iconOn);
    }

    return (
      <Animated.View
        style={[styles.container, style, { top: animValue }]}
      >
        <Icon
          style={notifIconStyle}
          hitSlop={14}
          onPress={::this.onSwitchNotificationSetting}
          source={notifOn ? 'fa-bell' : 'fa-bell-slash'}
        />

        <Icon
          style={styles.iconOn}
          hitSlop={14}
          onPress={::this.onSendOffer}
          source={'icon-plus-24'}
        />

        <Icon
          style={styles.iconOn}
          hitSlop={14}
          onPress={::this.onSendOffer}
          source={'fa-info-circle'}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#FFF',
    borderBottomColor: '$pe_color_apple_div',
    borderBottomWidth: 1,
    zIndex: 10,
  },

  icon: {
    color: '$pe_color_icon',
    fontSize: 24,
  },

  iconOn: {
    color: '$pe_color_blue',
    fontSize: 24,
  },
});