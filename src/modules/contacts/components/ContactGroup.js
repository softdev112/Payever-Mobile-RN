import { PureComponent } from 'react';
import { Animated, Image, TouchableWithoutFeedback } from 'react-native';
import { images, RoundSwitch, StyleSheet, Text, View } from 'ui';

import type ContactGroupInfo
  from '../../../store/contacts/models/ContactGroupInfo';

const SWITCH_INIT_Y_POS = -40;
const INIT_PADDING = 8;

export default class ContactGroup extends PureComponent {
  static defaultProps = {
    selected: false,
  };

  props: {
    selectMode: boolean;
    group: ContactGroupInfo;
    onSelectChange: (state: boolean, group: ContactGroupInfo) => void;
    style?: Object;
    selected?: boolean;
    onLongPress?: (group: ContactGroupInfo) => void;
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

  onGroupPress({ nativeEvent }) {
    const { onPress } = this.props;

    if (onPress) {
      onPress(nativeEvent);
    }
  }

  onGroupLongPress() {
    const { group, onLongPress } = this.props;

    if (onLongPress) {
      onLongPress(group);
    }
  }

  onSelectModeOn() {
    const { paddingAnimValue, leftPosAnimValue } = this.state;

    Animated.parallel([
      Animated.timing(paddingAnimValue, {
        toValue: 40,
        duration: 200,
      }),
      Animated.timing(leftPosAnimValue, {
        toValue: 5,
        duration: 300,
      }),
    ]).start();
  }

  onSelectedModeOff() {
    const { paddingAnimValue, leftPosAnimValue } = this.state;

    Animated.parallel([
      Animated.timing(paddingAnimValue, {
        toValue: 8,
        duration: 300,
      }),
      Animated.timing(leftPosAnimValue, {
        toValue: SWITCH_INIT_Y_POS,
        duration: 200,
      }),
    ]).start();
  }

  async onSelectValueChange(value: boolean) {
    const { onSelectChange, group } = this.props;

    if (onSelectChange) {
      onSelectChange(value, group);
    }
  }

  render() {
    const { group, selected, style } = this.props;
    const { paddingAnimValue, leftPosAnimValue } = this.state;
    const { contacts_count, name, logo_url } = group;

    const avatar = logo_url ? { uri: logo_url } : images.noAvatar;

    return (
      <TouchableWithoutFeedback
        onLongPress={::this.onGroupLongPress}
        onPress={::this.onGroupPress}
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
              {name}
            </Text>
            <Text style={styles.subText} numberOfLines={1}>
              {`Contacts count:  ${contacts_count}`}
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
    minHeight: 85,
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