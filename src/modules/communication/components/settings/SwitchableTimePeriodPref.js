/**
 * Created by Elf on 30.01.2017.
 */
import { Component } from 'react';
import { Animated, Switch } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

import HourPicker from './HourPicker';
import MinutePicker from './MinutePicker';

export default class SwitchableTimePeriodPref extends Component {
  props: {
    checkBox: CheckBox;
    timePeriod: TimePeriod;
    settings: Object;
    onSwitched: () => {};
  };

  state: {
    isTimePeriodOn: boolean;
    from: TimePoint;
    to: TimePoint;
    timePeriodHeight: Object;
  };

  constructor(props) {
    super(props);

    const { settings, checkBox, timePeriod } = this.props;
    const { from, to } = timePeriod;

    const initialState = !!(settings && settings[checkBox.prefName]);
    const initFrom = settings
      ? settings[from.prefName] : { hour: 0, minute: 0 };
    const initTo = settings ? settings[to.prefName] : { hour: 0, minute: 0 };

    this.state = {
      from: initFrom,
      to: initTo,
      isTimePeriodOn: initialState,
      timePeriodHeight: new Animated.Value(initialState ? 75 : 0),
    };
  }

  onSwitchPress() {
    const { timePeriodHeight, isTimePeriodOn } = this.state;
    this.setState({ isTimePeriodOn: !isTimePeriodOn });

    const { onSwitched, settings, checkBox } = this.props;
    if (onSwitched) {
      onSwitched();
    }

    settings[checkBox.prefName] = !isTimePeriodOn;

    Animated.timing(timePeriodHeight, {
      toValue: isTimePeriodOn ? 0 : 75,
      duration: 200,
    }).start();
  }

  render() {
    const { checkBox, timePeriod } = this.props;
    const { timePeriodHeight } = this.state;
    const opacity = timePeriodHeight.interpolate({
      inputRange: [0, 75],
      outputRange: [0, 1],
    });

    const { settings } = this.props;
    const initStartHour = settings[timePeriod.from.hour];
    const initStartMinute = settings[timePeriod.from.minute];
    const initStopHour = settings[timePeriod.to.hour];
    const initStopMinute = settings[timePeriod.to.minute];

    return (
      <View style={styles.container}>
        <View style={styles.checkBoxBlock}>
          <View style={styles.titleBlock}>
            {checkBox.icon &&
            <Icon style={styles.icon} source={checkBox.icon} />}
            <Text style={styles.title}>{checkBox.title}</Text>
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
            {timePeriod.icon &&
            <Icon style={styles.icon} source={timePeriod.icon} />}
            <Text style={styles.subTitle}>{timePeriod.title}</Text>
          </View>
          <View style={styles.pickers}>
            <View style={styles.timePointPickers}>
              <Text>Start:</Text>
              <HourPicker hour={initStartHour} />
              <MinutePicker minute={initStartMinute} />
            </View>

            <View style={styles.timePointPickers}>
              <Text>Stop:</Text>
              <HourPicker hour={initStopHour} />
              <MinutePicker minute={initStopMinute} />
            </View>
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
    justifyContent: 'space-between',
    height: 40,
  },

  timePeriodTitleBlock: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pickers: {
    flexDirection: 'row',
    height: 45,
    padding: 2,
    justifyContent: 'center',
  },

  timePointPickers: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },

  icon: {
    marginRight: 8,
    fontSize: 16,
  },

  subTitle: {
    flex: 1,
    fontSize: 11,
  },
});

type CheckBox = {
  icon: string;
  checked?: boolean;
  title: string;
  onSwitched: () => {};
};

type TimePeriod = {
  from: TimePoint;
  to: TimePoint;
  icon: string;
  title: string;
};

type TimePoint = {
  prefName?: string;
  hour: number;
  minute: number;
};