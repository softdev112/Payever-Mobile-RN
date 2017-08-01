import { PureComponent } from 'react';
import { Animated, Image, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { images, RoundSwitch, StyleSheet, Text, View } from 'ui';

import type CustomerContactInfo
  from '../../../store/contacts/models/CustomerContactInfo';

const SWITCH_INIT_Y_POS = -40;
const INIT_PADDING = 8;

export default class CustomerContact extends PureComponent {
  static defaultProps = {
    selected: false,
  };

  props: {
    selectMode: boolean;
    contact: CustomerContactInfo;
    onSelectChange: (state: boolean, contact: CustomerContactInfo) => void;
    style?: Object;
    selected?: boolean;
    onLongPress?: (contact: CustomerContactInfo) => void;
    onPress?: () => void;
  };

  state: {
    paddingAnimValue: Animated.Value;
    leftPosAnimValue: Animated.Value;
  };

  constructor(props) {
    super(props);

    this.state = {
      paddingAnimValue: new Animated.Value(INIT_PADDING),
      leftPosAnimValue: new Animated.Value(SWITCH_INIT_Y_POS),
    };
  }

  componentDidMount() {
    const { selectMode } = this.props;

    if (selectMode) {
      this.onSelectModeOn();
    }
  }

  componentWillReceiveProps(newProps) {
    const { selectMode } = this.props;

    if (!selectMode && newProps.selectMode) {
      this.onSelectModeOn();
    } else if (selectMode && !newProps.selectMode) {
      this.onSelectedModeOff();
    }
  }

  onContactPress({ nativeEvent }) {
    const { onPress } = this.props;

    if (onPress) {
      onPress(nativeEvent);
    }
  }

  onContactLongPress() {
    const { contact, onLongPress } = this.props;

    if (onLongPress) {
      onLongPress(contact);
    }
  }

  onSelectModeOn() {
    const { paddingAnimValue, leftPosAnimValue } = this.state;

    Animated.parallel([
      Animated.timing(paddingAnimValue, {
        toValue: 40,
        duration: 250,
      }),
      Animated.timing(leftPosAnimValue, {
        toValue: 5,
        duration: 400,
      }),
    ]).start();
  }

  onSelectedModeOff() {
    const { paddingAnimValue, leftPosAnimValue } = this.state;

    Animated.parallel([
      Animated.timing(paddingAnimValue, {
        toValue: 8,
        duration: 400,
      }),
      Animated.timing(leftPosAnimValue, {
        toValue: SWITCH_INIT_Y_POS,
        duration: 250,
      }),
    ]).start();
  }

  onSelectValueChange(value: boolean) {
    const { onSelectChange, contact } = this.props;

    if (onSelectChange) {
      onSelectChange(value, contact);
    }
  }

  render() {
    const { contact, selected, style } = this.props;
    const { paddingAnimValue, leftPosAnimValue } = this.state;
    const {
      avatar_url, birthday, first_name, last_name, email, country, city,
      street,
    } = contact;

    const avatar = avatar_url ? { uri: avatar_url } : images.noAvatar;
    const birthdayStr = birthday && birthday !== ''
      ? moment(birthday).format('DD/MM/YYYY') : '';

    return (
      <TouchableWithoutFeedback
        onLongPress={::this.onContactLongPress}
        onPress={::this.onContactPress}
      >
        <Animated.View
          style={[styles.container, { paddingLeft: paddingAnimValue }, style]}
        >
          <RoundSwitch
            style={[styles.selectSwitch, { left: leftPosAnimValue }]}
            value={selected}
            onValueChange={::this.onSelectValueChange}
          />

          <Image
            style={styles.avatar}
            source={avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText} numberOfLines={1}>
              {first_name} {last_name}
            </Text>

            <Text style={styles.subText} numberOfLines={1}>
              {`Birthday:  ${birthdayStr}`}
            </Text>

            <Text style={styles.subText} numberOfLines={1}>
              {`Email: ${email}`}
            </Text>

            <Text style={styles.subText} numberOfLines={1}>
              {country} {city} {street}
            </Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: CustomerContact.MIN_ROW_HEIGHT,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  mainText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    paddingBottom: 2,
  },

  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  subText: {
    fontSize: 14,
    color: '$pe_color_gray',
  },

  selectSwitch: {
    position: 'absolute',
    top: 30,
    left: SWITCH_INIT_Y_POS,
  },
});