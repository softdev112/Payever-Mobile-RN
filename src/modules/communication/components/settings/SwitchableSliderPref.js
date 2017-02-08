import { Component } from 'react';
import { Animated, Slider } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

import type UserSettings
  from '../../../../store/CommunicationStore/models/UserSettings';
import CheckBoxPref from './CheckBoxPref';

const SLIDER_BLOCK_HEIGHT = 45;

export default class SwitchableSliderPref extends Component {
  props: {
    switchPrefName: string;
    switchTitle: string;
    switchIcon?: string;
    sliderPrefName: string;
    sliderMin: number;
    sliderMax: number;
    sliderTitle: string;
    sliderIcon?: string;
    settings: UserSettings;
  };

  state: {
    isSliderOn: boolean;
    value: number;
    sliderHeight: Object;
  };

  constructor(props) {
    super(props);

    const { settings, sliderPrefName, switchPrefName } = props;

    const initialState = !!(settings[switchPrefName]);
    this.state = {
      isSliderOn: initialState,
      value: settings[sliderPrefName],
      sliderHeight: new Animated.Value(initialState ? SLIDER_BLOCK_HEIGHT : 0),
    };
  }

  onSlidingComplete(value) {
    const { settings, sliderPrefName } = this.props;

    if (settings) {
      settings[sliderPrefName] = value;
    }
  }

  onSwitchPress() {
    const { isSliderOn, sliderHeight } = this.state;
    this.setState({ isSliderOn: !isSliderOn });

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
      settings,
      switchTitle,
      switchPrefName,
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
        <CheckBoxPref
          prefName={switchPrefName}
          title={switchTitle}
          icon={switchIcon}
          onValueChange={::this.onSwitchPress}
          settings={settings}
        />

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
  },

  sliderBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: SLIDER_BLOCK_HEIGHT,
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