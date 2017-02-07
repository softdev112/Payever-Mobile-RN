/**
 * Created by Elf on 30.01.2017.
 */
import { Component, PropTypes } from 'react';
import { Animated, Slider, Switch } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

import type UserSettings
  from '../../../../store/CommunicationStore/models/UserSettings';

const SLIDER_BLOCK_HEIGHT = 40;

export default class SwitchableSliderPref extends Component {
  static contextTypes = {
    settings: PropTypes.object.isRequired,
  };

  props: {
    switchPrefName: string;
    switchTitle: string;
    switchIcon: string;
    sliderPrefName: string;
    sliderMin: number;
    sliderMax: number;
    sliderTitle: string;
    sliderIcon: string;
    onSwitched: () => void;
  };

  context: {
    settings: UserSettings;
  };

  state: {
    isSliderOn: boolean;
    value: number;
    sliderHeight: Object;
  };

  constructor(props, context) {
    super(props, context);

    const { switchPrefName, sliderPrefName } = props;
    const { settings } = context;

    const initialState = !!(settings && settings[switchPrefName]);
    this.state = {
      isSliderOn: initialState,
      value:  settings ? settings[sliderPrefName] : 0,
      sliderHeight: new Animated.Value(initialState ? SLIDER_BLOCK_HEIGHT : 0),
    };
  }

  onSlidingComplete(value) {
    const { sliderPrefName } = this.props;
    const { settings } = this.context;

    if (settings) {
      settings[sliderPrefName] = value;
    }
  }

  onSwitchPress() {
    const { sliderHeight, isSliderOn } = this.state;
    this.setState({ isSliderOn: !isSliderOn });

    const { onSwitched, switchPrefName } = this.props;
    if (onSwitched) {
      onSwitched();
    }

    const { settings } = this.context;
    settings[switchPrefName] = !isSliderOn;

    Animated.timing(sliderHeight, {
      toValue: isSliderOn ? 0 : SLIDER_BLOCK_HEIGHT,
      duration: 200,
    }).start();
  }

  onValueChange(value) {
    this.setState({ value });
  }

  render() {
    const {
      switchTitle,
      switchIcon,
      sliderTitle,
      sliderIcon,
      sliderMin,
      sliderMax,
    } = this.props;

    const { sliderHeight, value } = this.state;
    const opacity = sliderHeight.interpolate({
      inputRange: [0, 40],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.container}>
        <View style={styles.checkBoxBlock}>
          <View style={styles.titleBlock}>
            {switchIcon &&
            <Icon style={styles.icon} source={switchIcon} />}
            <Text style={styles.title}>{switchTitle}</Text>
          </View>
          <Switch
            value={this.state.isSliderOn}
            onValueChange={::this.onSwitchPress}
          />
        </View>

        <Animated.View
          style={[
            styles.sliderBlock,
            { height: sliderHeight },
            { opacity },
          ]}
        >
          <View style={styles.sliderTitleBlock}>
            {sliderIcon &&
            <Icon style={styles.icon} source={sliderIcon} />}
            <Text style={styles.title}>{sliderTitle}</Text>
          </View>
          <Slider
            style={styles.sliderGauge}
            minimumValue={sliderMin}
            maximumValue={sliderMax}
            onSlidingComplete={::this.onSlidingComplete}
            onValueChange={::this.onValueChange}
            value={value}
          />
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

  sliderBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },

  sliderTitleBlock: {
    flex: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sliderGauge: {
    flex: 50,
  },

  icon: {
    marginRight: 8,
    fontSize: 16,
  },
});