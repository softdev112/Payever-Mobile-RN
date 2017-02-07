/**
 * Created by Elf on 30.01.2017.
 */
import { Component, PropTypes } from 'react';
import { Animated, Switch, TouchableOpacity } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';
import DateTimePicker from 'react-native-modal-datetime-picker';

import type UserSettings
  from '../../../../store/CommunicationStore/models/UserSettings';

const PERIOD_BLOCK_HEIGHT = 70;

export default class SwitchableTimePeriodPref extends Component {
  static contextTypes = {
    settings: PropTypes.object.isRequired,
  };

  props: {
    switchPrefName: string;
    switchTitle: string;
    switchIcon: string;
    periodTitle: string;
    periodIcon: string;
    periodFromPrefName: string;
    periodToPrefName: string;
    onSwitched?: () => void;
  };

  context: {
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
      switchPrefName,
    } = this.props;

    const { settings } = this.context;

    let initialState = false; // Period off
    let initFromTime = new Date(0, 0, 0, 0, 0); // year month day hour minute
    let initToTime = new Date(0, 0, 0, 0, 0);

    if (settings) {
      initialState = !!(settings[switchPrefName]);

      const currentFromTime = settings[periodFromPrefName];
      if (currentFromTime && currentFromTime.hour && currentFromTime.minute) {
        initFromTime =
          new Date(0, 0, 0, currentFromTime.hour, currentFromTime.minute);
      }

      const currentToTime = settings[periodToPrefName];
      if (currentToTime && currentToTime.hour && currentToTime.minute) {
        initToTime =
          new Date(0, 0, 0, currentToTime.hour, currentToTime.minute);
      }
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

    const { onSwitched, switchPrefName } = this.props;
    if (onSwitched) {
      onSwitched();
    }

    const { settings } = this.context;
    settings[switchPrefName] = !isTimePeriodOn;

    Animated.timing(timePeriodHeight, {
      toValue: isTimePeriodOn ? 0 : PERIOD_BLOCK_HEIGHT,
      duration: 200,
    }).start();
  }

  onTimePicked(date) {
    const { periodFromPrefName, periodToPrefName } = this.props;
    const { isFrom } = this.state;
    const { settings } = this.context;

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
      switchTitle,
      switchIcon,
      periodTitle,
      periodIcon,
    } = this.props;

    const { isFrom, timePeriodHeight, fromTime, toTime } = this.state;
    const opacity = timePeriodHeight.interpolate({
      inputRange: [0, PERIOD_BLOCK_HEIGHT],
      outputRange: [0, 1],
    });

    const fromHour = fromTime.getHours() > 9
      ? String(fromTime.getHours()) : `0${fromTime.getHours()}`;

    const fromMinute = fromTime.getMinutes() > 9
      ? String(fromTime.getMinutes()) : `0${fromTime.getMinutes()}`;

    const toHour = toTime.getHours() > 9
      ? String(toTime.getHours()) : `0${toTime.getHours()}`;

    const toMinute = toTime.getMinutes() > 9
      ? String(toTime.getMinutes()) : `0${toTime.getMinutes()}`;

    return (
      <View style={styles.container}>
        <View style={styles.checkBoxBlock}>
          <View style={styles.titleBlock}>
            {switchIcon &&
            <Icon style={styles.icon} source={switchIcon} />}
            <Text style={styles.title}>{switchTitle}</Text>
          </View>
          <Switch
            value={this.state.isTimePeriodOn}
            onValueChange={::this.onSwitchPress}
          />
        </View>

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
    paddingHorizontal: 3,
  },

  checkBoxBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },

  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timePeriodBlock: {
    justifyContent: 'flex-start',
    height: 40,
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