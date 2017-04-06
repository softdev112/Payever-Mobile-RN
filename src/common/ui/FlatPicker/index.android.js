import { Component } from 'react';
import { Picker } from 'react-native';
import * as Animatable from 'react-native-animatable';

import StyleSheet from '../StyleSheet';
import countries from './data/countries.json';
import legalForms from './data/legal-forms.json';

export default class FlatPicker extends Component {
  static defaultProps = {
    placeholder: 'Select value',
  };

  props: {
    type?: 'countries' | 'legal-forms';
    style?: Object;
    values?: Array<any>;
    labels?: Array<any>;
    onValueChange?: (value: string) => void;
  };

  state: {
    value: string;
  };

  $animContainer: Animatable.View;

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  onPickerValueChange(value) {
    const { onValueChange } = this.props;

    if (onValueChange) {
      onValueChange(value);
    }

    this.setState({ value });
  }

  async shakeElementAndSetFocus() {
    await this.$animContainer.shake(300);
  }

  renderPickerOptions() {
    const { labels, values, type } = this.props;

    if (!type && !labels && !values) {
      return null;
    }

    if (type) {
      let inputData;
      switch (type) {
        case 'countries': {
          inputData = countries.data;
          break;
        }

        case 'legal-forms': {
          inputData = legalForms.data;
          break;
        }

        default: {
          inputData = [];
          break;
        }
      }

      return inputData.map((option, index) => {
        return (
          <Picker.Item
            key={index}
            label={option.label}
            value={option.value}
            color={index === 0 ? '#00000055' : '#000'}
          />
        );
      });
    }

    return values.map((option, index) => {
      return (
        <Picker.Item
          key={index}
          label={labels[index] || `Option ${index}`}
          value={option}
          color={index === 0 ? '#00000055' : '#000'}
        />
      );
    });
  }

  render() {
    const { style } = this.props;

    return (
      <Animatable.View
        style={[styles.container, style]}
        ref={ref => this.$animContainer = ref}
      >
        <Picker
          selectedValue={this.state.value}
          onValueChange={::this.onPickerValueChange}
          mode="dropdown"
        >
          {this.renderPickerOptions()}
        </Picker>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    height: 50,
  },
});