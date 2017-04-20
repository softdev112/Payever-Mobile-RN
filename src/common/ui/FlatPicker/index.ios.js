import { Component } from 'react';
import { Picker, Text, TouchableWithoutFeedback, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import Icon from '../Icon';
import StyleSheet from '../StyleSheet';
import countries from './data/countries.json';
import legalForms from './data/legal-forms.json';

const COLLAPSED_HEIGHT = 50;
const EXPANDED_HEIGHT = 260;

export default class FlatPicker extends Component {
  static defaultProps = {
    placeholder: 'Select value',
  };

  props: {
    type?: 'countries' | 'legal-forms';
    placeholder?: string;
    placeholderStyle?: Object;
    style?: Object;
    values?: Array<any>;
    labels?: Array<any>;
    onValueChange?: (value: string) => void;
    renderValidator?: Function;
  };

  state: {
    value: string;
    collapsed: true;
  };

  $animContainer: Animatable.View;
  onExpand: () => void;

  constructor(props) {
    super(props);

    this.onExpand = ::this.onExpand;

    this.state = {
      value: '',
      collapsed: true,
    };
  }

  onExpand() {
    const { collapsed } = this.state;

    if (collapsed) {
      this.$animContainer
        .transitionTo({ height: EXPANDED_HEIGHT }, 300);
      setTimeout(() => this.setState({ collapsed: !collapsed }), 200);
    } else {
      this.setState({ collapsed: !collapsed });
      this.$animContainer
        .transitionTo({ height: COLLAPSED_HEIGHT }, 300);
    }
  }

  onPickerValueChange(value) {
    const { onValueChange } = this.props;

    if (onValueChange) {
      onValueChange(value);
    }

    this.setState({ value });
  }

  getCurrentLabel(): string {
    const { labels, values, placeholder, type } = this.props;
    const { value } = this.state;

    if ((!type && !labels && !values) || value === '') {
      return placeholder;
    }

    if (type) {
      let resLabel = null;
      switch (type) {
        case 'countries': {
          resLabel = countries.data.find(item => item.value === value);
          break;
        }

        case 'legal-forms': {
          resLabel = legalForms.data.find(item => item.value === value);
          break;
        }

        default: {
          resLabel = { label: placeholder };
          break;
        }
      }

      return resLabel ? resLabel.label : placeholder;
    }

    return values.find(item => item === value) || placeholder;
  }

  async shakeElementAndSetFocus() {
    await this.$animContainer.shake(300);
    if (this.state.collapsed) {
      this.onExpand();
    }
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
        />
      );
    });
  }

  renderValidator() {
    const { renderValidator } = this.props;

    if (renderValidator) {
      return renderValidator();
    }

    return null;
  }

  render() {
    const { placeholderStyle, style } = this.props;
    const { collapsed, value } = this.state;

    const valueTextStyle = [styles.placeholder, placeholderStyle];
    if (value !== '') {
      valueTextStyle.push(styles.selectedValueText);
    }

    return (
      <Animatable.View
        style={[styles.container, style]}
        ref={ref => this.$animContainer = ref}
      >
        {!collapsed && this.renderValidator()}
        {collapsed ? (
          <TouchableWithoutFeedback onPress={this.onExpand}>
            <View style={styles.collapsedView}>
              <Text style={valueTextStyle}>{this.getCurrentLabel()}</Text>
              <Icon style={styles.icon} source="fa-chevron-down" />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={styles.expandedView}>
            <Picker
              selectedValue={this.state.value}
              onValueChange={::this.onPickerValueChange}
              mode="dropdown"
            >
              {this.renderPickerOptions()}
            </Picker>
            <Icon
              style={styles.icon}
              source="fa-chevron-up"
              onPress={this.onExpand}
            />
          </View>
        )}
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '$pe_color_light_gray_1',
    borderBottomWidth: 1,
    minHeight: COLLAPSED_HEIGHT,
  },

  collapsedView: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expandedView: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  placeholder: {
    fontSize: 22,
    fontFamily: '$font_family',
    fontWeight: '200',
    opacity: 0.4,
  },

  selectedValueText: {
    opacity: 1,
  },

  icon: {
    alignSelf: 'center',
    fontSize: 18,
    opacity: 0.6,
    color: '#000',
  },
});