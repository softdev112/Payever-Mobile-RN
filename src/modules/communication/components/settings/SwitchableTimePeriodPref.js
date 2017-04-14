import { Component } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'ui';
import DateTimePicker from 'react-native-modal-datetime-picker';

import type UserSettings
  from '../../../../store/communication/models/UserSettings';
import CheckBoxPref from './CheckBoxPref';

const PERIOD_BLOCK_HEIGHT = 70;

export default class SwitchableTimePeriodPref extends Component {
  props: {
    switchPrefName: string;
    switchTitle: string;
    switchIcon: string;
    periodTitle: string;
    periodFromPrefName: string;
    periodToPrefName: string;
    settings: UserSettings;
  };

  state: {
    isTimePeriodOn: boolean;
    isTimePickerOn: boolean;
    isFrom: boolean;
    fromHour: number;
    fromMinute: number;
    toHour: number;
    toMinute: number;
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

    const initialState = !!(settings[switchPrefName]);

    this.state = {
      fromHour: settings[periodFromPrefName].hour,
      fromMinute: settings[periodFromPrefName].minute,
      toHour: settings[periodToPrefName].hour,
      toMinute: settings[periodToPrefName].minute,
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

    if (!date) return;

    this.hideTimePicker();


    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();

    if (isFrom) {
      settings[periodFromPrefName].hour = hour;
      settings[periodFromPrefName].minute = minute;
      this.setState({ fromHour: hour, fromMinute: minute });
    } else {
      settings[periodToPrefName].hour = hour;
      settings[periodToPrefName].minute = minute;
      this.setState({ toHour: hour, toMinute: minute });
    }
  }

  getTimeStr(hour, minute) {
    const hourStr = hour >= 10 ? String(hour) : `0${hour}`;
    const minuteStr = minute >= 10 ? String(minute) : `0${minute}`;

    return `${hourStr}:${minuteStr}`;
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
    } = this.props;

    const {
      timePeriodHeight, fromHour, fromMinute, toHour, toMinute,
    } = this.state;
    const opacity = timePeriodHeight.interpolate({
      inputRange: [0, PERIOD_BLOCK_HEIGHT],
      outputRange: [0, 1],
    });

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
            styles.period,
            { height: timePeriodHeight },
            { opacity },
          ]}
        >
          <Text style={styles.period_title}>{periodTitle}</Text>
          <View style={styles.picker}>
            <TouchableOpacity
              style={styles.picker_column}
              onPress={() => this.showTimePicker(true)}
            >
              <Text>Start: </Text>
              <Text style={styles.picker_time}>
                {this.getTimeStr(fromHour, fromMinute)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.picker_column}
              onPress={() => this.showTimePicker(false)}
            >
              <Text>Stop: </Text>
              <Text style={styles.picker_time}>
                {this.getTimeStr(toHour, toMinute)}
              </Text>
            </TouchableOpacity>

            <DateTimePicker
              mode="time"
              isVisible={this.state.isTimePickerOn}
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
  },

  period: {
    justifyContent: 'flex-start',
    height: PERIOD_BLOCK_HEIGHT,
  },

  period_title: {
    fontSize: 12,
    height: 35,
    paddingLeft: 25,
  },

  picker: {
    flexDirection: 'row',
    height: 35,
    padding: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  picker_column: {
    flexDirection: 'row',
  },

  picker_time: {
    color: '$pe_color_blue',
  },
});