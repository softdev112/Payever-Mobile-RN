import { Component } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'ui';
import DateTimePicker from 'react-native-modal-datetime-picker';

import type UserSettings
  from '../../../../store/CommunicationStore/models/UserSettings';
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

    const initialState = !!(settings[switchPrefName]);

    this.state = {
      fromTime: makeTime(settings[periodFromPrefName]),
      toTime: makeTime(settings[periodToPrefName]),
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
    console.log('DATE', date);

    const { periodFromPrefName, periodToPrefName, settings } = this.props;
    const { isFrom } = this.state;

    this.hideTimePicker();

    if (isFrom) {
      // Set from time
      settings[periodFromPrefName].hour = date.getHours();
      settings[periodFromPrefName].minute = date.getMinutes();
      this.setState({ fromTime: date });
    } else {
      // Set to time
      settings[periodToPrefName].hour = date.getHours();
      settings[periodToPrefName].minute = date.getMinutes();
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
    } = this.props;

    const { isFrom, timePeriodHeight, fromTime, toTime } = this.state;
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
              <Text style={styles.picker_time}>{formatTime(fromTime)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.picker_column}
              onPress={() => this.showTimePicker(false)}
            >
              <Text>Stop: </Text>
              <Text style={styles.picker_time}>{formatTime(toTime)}</Text>
            </TouchableOpacity>

            <DateTimePicker
              mode="time"
              isVisible={this.state.isTimePickerOn}
              date={isFrom ? fromTime : toTime}
              onConfirm={::this.onTimePicked}
              onCancel={::this.hideTimePicker}
              titleIOS="Choose time"
              is24Hour
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

function formatTime(time: Date) {
  const offsetTime = new Date(time - (time.getTimezoneOffset() * 60 * 1000));
  return offsetTime.toISOString().substr(11, 5);
}

function makeTime({ hour, minute }) {
  return new Date(0, 0, 0, hour, minute, 0);
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