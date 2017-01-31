/**
 * Created by Elf on 30.01.2017.
 */
import { Component } from 'react';
import { Animated, Slider, Switch } from 'react-native';
import { Icon, StyleSheet, Text, View } from 'ui';

export default class SwitchableSliderPref extends Component {
  props: {
    checkBox: CheckBox;
    slider: SliderPref;
    settings: Object;
    onSwitched: () => {};
  };

  state: {
    isSliderOn: boolean;
    value: number;
    sliderHeight: Object;
  };

  constructor(props) {
    super(props);

    const { settings, checkBox, slider } = this.props;

    const initialState = !!(settings && settings[checkBox.prefName]);
    this.state = {
      isSliderOn: initialState,
      value:  settings ? settings[slider.prefName] : 0,
      sliderHeight: new Animated.Value(initialState ? 40 : 0),
    };
  }

  onSlidingComplete(value) {
    const { settings, slider } = this.props;

    if (settings) {
      settings[slider.prefName] = value;
    }
  }

  onSwitchPress() {
    const { sliderHeight, isSliderOn } = this.state;
    this.setState({ isSliderOn: !isSliderOn });

    const { onSwitched, settings, checkBox } = this.props;
    if (onSwitched) {
      onSwitched();
    }

    settings[checkBox.prefName] = !isSliderOn;

    Animated.timing(sliderHeight, {
      toValue: isSliderOn ? 0 : 40,
      duration: 200,
    }).start();
  }

  onValueChange(value) {
    this.setState({ value });
  }

  render() {
    const { checkBox, slider } = this.props;
    const { sliderHeight, value } = this.state;
    const opacity = sliderHeight.interpolate({
      inputRange: [0, 40],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.container}>
        <View style={styles.checkBoxBlock}>
          <View style={styles.titleBlock}>
            {checkBox.icon &&
            <Icon style={styles.icon} source={checkBox.icon} />}
            <Text style={styles.title}>{checkBox.title}</Text>
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
            {slider.icon &&
            <Icon style={styles.icon} source={slider.icon} />}
            <Text style={styles.title}>{slider.title}</Text>
          </View>
          <Slider
            style={styles.sliderGauge}
            minimumValue={slider.min}
            maximumValue={slider.max}
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

type CheckBox = {
  icon: string;
  checked?: boolean;
  title: string;
  onSwitched: () => {};
};

type SliderPref = {
  icon: string;
  title: string;
  prefName: string;
  min: number;
  max: number;
};