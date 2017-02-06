/**
 * Created by Elf on 30.01.2017.
 */
import { Component } from 'react';
import { Animated, Switch, TouchableOpacity } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';
import DateTimePicker from 'react-native-modal-datetime-picker';

const PERIOD_BLOCK_HEIGHT = 70;

export default class SwitchableTimePeriodPref extends Component {
  props: {
    switchPrefName: string;
    switchTitle: string;
    switchIcon: string;
    periodTitle: string;
    periodIcon: string;
    periodFromPrefName: string;
    periodToPrefName: string;
    settings: Object;
    onSwitched?: () => void;
  };

  state: {
    isTimePeriodOn: boolean;
    isTimePickerOn: boolean;
    isFrom: boolean;
    from: Object;
    to: Object;
    timePeriodHeight: Object;
  };

  constructor(props) {
    super(props);

    const {
      periodFromPrefName,
      periodToPrefName,
      settings,
      switchPrefName,
    } = this.props;

    let initialState = false; // Period off
    let initFrom = new Date(0, 0, 0, 0, 0); // year month day hour minute
    let initTo = new Date(0, 0, 0, 0, 0);

    if (settings) {
      initialState = !!(settings[switchPrefName]);

      const currentFrom = settings[periodFromPrefName];
      if (currentFrom && currentFrom.hour && currentFrom.minute) {
        initFrom = new Date(0, 0, 0, currentFrom.hour, currentFrom.minute);
      }

      const currentTo = settings[periodToPrefName];
      if (currentTo && currentTo.hour && currentTo.minute) {
        initTo = new Date(0, 0, 0, currentTo.hour, currentTo.minute);
      }
    }

    this.state = {
      from: initFrom,
      to: initTo,
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

    const { onSwitched, settings, switchPrefName } = this.props;
    if (onSwitched) {
      onSwitched();
    }

    settings[switchPrefName] = !isTimePeriodOn;

    Animated.timing(timePeriodHeight, {
      toValue: isTimePeriodOn ? 0 : PERIOD_BLOCK_HEIGHT,
      duration: 200,
    }).start();
  }

  onTimePicked(date) {
    const { periodFromPrefName, periodToPrefName, settings } = this.props;
    const { isFrom } = this.state;

    this.switchTimePicker(isFrom);

    if (isFrom) {
      // Set from time
      settings[periodFromPrefName].hour = date.getHours();
      settings[periodFromPrefName].minutes = date.getMinutes();
      this.setState({ from: date });
    } else {
      // Set to time
      settings[periodToPrefName].hour = date.getHours();
      settings[periodToPrefName].minutes = date.getMinutes();
      this.setState({ to: date });
    }
  }

  switchTimePicker(isFrom) {
    const { isTimePickerOn } = this.state;
    this.setState({ isFrom, isTimePickerOn: !isTimePickerOn });
  }

  render() {
    const {
      switchTitle,
      switchIcon,
      periodTitle,
      periodIcon,
    } = this.props;

    const { timePeriodHeight, from, to } = this.state;
    const opacity = timePeriodHeight.interpolate({
      inputRange: [0, PERIOD_BLOCK_HEIGHT],
      outputRange: [0, 1],
    });

    const fromHour = from ? from.getHours() : 0;
    const fromMinutes = from ? from.getMinutes() : 0;
    const toHour = to ? to.getHours() : 0;
    const toMinutes = to ? to.getMinutes() : 0;

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
              onPress={this.switchTimePicker.bind(this, true)}
            >
              <Text>
                Start:
                <Text style={styles.timeText}>
                  {` ${fromHour}:${fromMinutes}`}
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.switchTimePicker.bind(this, false)}
            >
              <Text>
                Stop:
                <Text style={styles.timeText}>
                  {` ${toHour}:${toMinutes}`}
                </Text>
              </Text>
            </TouchableOpacity>

            <DateTimePicker
              mode="time"
              isVisible={this.state.isTimePickerOn}
              date={from}
              onConfirm={::this.onTimePicked}
              onCancel={::this.switchTimePicker}
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
    justifyContent: 'center',
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