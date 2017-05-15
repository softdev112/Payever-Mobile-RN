import { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import StyleSheet from '../StyleSheet';

export default class SegmentedControl extends Component {
  static defaultProps = {
    enabled: true,
    tintColor: '#0084ff',
    selectedIndex: 0,
  };

  props: {
    values: Array<string>;
    onChange?: () => void;
    onValueChange?: () => void;
    selectedIndex: number;
    tintColor: string;
    enabled?: boolean;
    style?: Object;
  };

  state: {
    currentIndex: number;
  };

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: props.selectedIndex,
    };
  }

  onChange(e, value, index) {
    const { onChange, onValueChange } = this.props;

    this.setState({ currentIndex: index });
    if (onChange) {
      onChange(e, value);
    }

    if (onValueChange) {
      onValueChange(value, index);
    }
  }

  renderButtons() {
    const { values, tintColor, enabled } = this.props;
    const { currentIndex } = this.state;

    return values.map((buttonTitle, index) => {
      const textColor = index === currentIndex ? '#FFF' : tintColor;
      const borderLeft = index > 0
        ? { borderLeftWidth: 1, borderLeftColor: tintColor } : null;

      const btnContainerStyle = [styles.btnContainer, borderLeft];
      if (index === currentIndex) {
        btnContainerStyle.push({ backgroundColor: tintColor });
      }

      const underlayColor = `${tintColor.substr(0, 7)}${55}`;

      return (
        <View
          key={index}
          style={btnContainerStyle}
        >
          <TouchableHighlight
            style={styles.btn}
            onPress={(e) => this.onChange(e, buttonTitle, index)}
            underlayColor={underlayColor}
            disabled={!enabled}
          >
            <Text
              style={[styles.btnTitle, { color: textColor }]}
              numberOfLines={1}
            >
              {buttonTitle.replace(/\b./g, l => l.toUpperCase())}
            </Text>
          </TouchableHighlight>
        </View>
      );
    });
  }

  render() {
    const { style } = this.props;

    return (
      <View style={[styles.container, style]}>
        {this.renderButtons()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderColor: '#0084ff',
    borderRadius: 5,
    borderWidth: 1,
    height: 28,
    overflow: 'hidden',
  },

  btnContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#FFF',
  },

  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnTitle: {
    fontSize: 15,
    color: '#0084ff',
  },
});