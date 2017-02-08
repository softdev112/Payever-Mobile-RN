import { Component } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';
import DateTimePicker from 'react-native-modal-datetime-picker';

import type UserSettings
  from '../../../../store/CommunicationStore/models/UserSettings';
import CheckBoxPref from './CheckBoxPref';

const PERIOD_BLOCK_HEIGHT = 70;

export default class SwitchableTimePeriodPref extends Component {
  props: {
    switchPrefName: string;
    switchTitle: string;
    switchIcon?: string;
    periodTitle: string;
    periodIcon?: string;
    periodFromPrefName: string;
    periodToPrefName: string;
    settings: UserSettings;
  };

  state: {
    isTimePeriodOn: boolean;
    isTimePickerOn: boolean;
    isFrom: boolean;
    from: Object;
    to: Object;
    timePeriodHeight: Object;
  };

  constructor(props, context) {
    super(props, context);

    const {
      periodFromPrefName,
      periodToPrefName,
      settings,
      switchPrefName,
    } = this.props;

    const initFromTime = new Date(0, 0, 0, 0, 0);
    const initToTime = new Date(0, 0, 0, 0, 0);

    const initialState = !!(settings[switchPrefName]);

    const currentFromTime = settings[periodFromPrefName];
    if (currentFromTime && currentFromTime.hour && currentFromTime.minute) {
      initFromTime.setUTCHours(currentFromTime.hour);
      initFromTime.setUTCMinutes(currentFromTime.minute);
    }

    const currentToTime = settings[periodToPrefName];
    if (currentToTime && currentToTime.hour && currentToTime.minute) {
      initToTime.setUTCHours(currentToTime.hour);
      initToTime.setUTCMinutes(currentToTime.minute);
    }

    this.state = {
      fromTime: initFromTime,
      toTime: initToTime,
      isTimePeriodOn: initialState,
      isFrom: false,
      timePeriodHeight: new Animated.Value(
        initialState ? PERIOD_BLOCK_HEIGHT : 0
      ),
    };
  }

  onSwitchPress() {
    const { timePeriodHeight, isTimePeriodOn } = this.state;
    this.setState({ isTimePeriodOn: !isTimePeriodOn });

    Animated.timing(timePeriodHeight, {
      toValue: isTimePeriodOn ? 0 : PERIOD_BLOCK_HEIGHT,
      duration: 200,
    }).start();
  }

  onTimePicked(date) {
    const { periodFromPrefName, periodToPrefName, settings } = this.props;
    const { isFrom } = this.state;

    this.hideTimePicker();

    if (isFrom) {
      // Set from time
      settings[periodFromPrefName].hour = date.getUTCHours();
      settings[periodFromPrefName].minute = date.getUTCMinutes();
      this.setState({ fromTime: date });
    } else {
      // Set to time
      settings[periodToPrefName].hour = date.getUTCHours();
      settings[periodToPrefName].minute = date.getUTCMinutes();
      this.setState({ toTime: date });
    }
  }

  showTimePicker(isFrom) {
    this.setState({ isFrom, isTimePickerOn: true });
  }

  hideTimePicker() {
    this.setState({ isTimePickerOn: false });
  }

  render() {
    const {
      settings,
      switchTitle,
      switchPrefName,
      switchIcon,
      periodTitle,
      periodIcon,
    } = this.props;

    const { isFrom, timePeriodHeight, fromTime, toTime } = this.state;
    const opacity = timePeriodHeight.interpolate({
      inputRange: [0, PERIOD_BLOCK_HEIGHT],
      outputRange: [0, 1],
    });

    const fromHour = fromTime.getUTCHours() > 9
      ? String(fromTime.getUTCHours()) : `0${fromTime.getUTCHours()}`;

    const fromMinute = fromTime.getUTCMinutes() > 9
      ? String(fromTime.getUTCMinutes()) : `0${fromTime.getUTCMinutes()}`;

    const toHour = toTime.getUTCHours() > 9
      ? String(toTime.getUTCHours()) : `0${toTime.getUTCHours()}`;

    const toMinute = toTime.getUTCMinutes() > 9
      ? String(toTime.getUTCMinutes()) : `0${toTime.getUTCMinutes()}`;

    return (
      <View style={styles.container}>
        <CheckBoxPref
          prefName={switchPrefName}
          title={switchTitle}
          icon={switchIcon}
          onValueChange={::this.onSwitchPress}
          settings={settings}
        />

        <Animated.View
          style={[
            styles.timePeriodBlock,
            { height: timePeriodHeight },
            { opacity },
          ]}
        >
          <View style={styles.timePeriodTitleBlock}>
            {periodIcon &&
            <Icon style={styles.icon} source={periodIcon} />}
            <Text style={styles.subTitle}>{periodTitle}</Text>
          </View>
          <View style={styles.pickers}>
            <TouchableOpacity
              onPress={this.showTimePicker.bind(this, true)}
            >
              <Text>
                Start:
                <Text style={styles.timeText}>
                  {` ${fromHour}:${fromMinute}`}
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.showTimePicker.bind(this, false)}
            >
              <Text>
                Stop:
                <Text style={styles.timeText}>
                  {` ${toHour}:${toMinute}`}
                </Text>
              </Text>
            </TouchableOpacity>

            <DateTimePicker
              mode="time"
              isVisible={this.state.isTimePickerOn}
              date={isFrom ? fromTime : toTime}
              onConfirm={::this.onTimePicked}
              onCancel={::this.hideTimePicker}
              titleIOS="Choose time"
              timeZoneOffsetInMinutes={0}
              is24Hour
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    paddingVertical: 5,
  },

  timePeriodBlock: {
    justifyContent: 'flex-start',
    height: PERIOD_BLOCK_HEIGHT,
  },

  timePeriodTitleBlock: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  pickers: {
    flexDirection: 'row',
    height: 35,
    padding: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  icon: {
    marginRight: 8,
    fontSize: 16,
  },

  subTitle: {
    flex: 1,
    fontSize: 11,
  },

  timeText: {
    color: '$pe_color_blue',
  },
});