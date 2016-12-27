import { Component } from 'react';
import { ScrollView, View } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Container extends Component {
  static defaultProps = {
    layout: 'large',
  };

  props: {
    layout: 'small' | 'large';
    scrollViewStyle?: Object | Number;
    style?: Object | Number;
  }

  render() {
    const scrollViewStyle = styles[`scrollView_${this.props.layout}`];
    return (
      <View style={[styles.container, this.props.style]}>
        <ScrollView
          {...this.props}
          style={[scrollViewStyle, this.props.scrollViewStyle]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  scrollView_small: {
    width: '80%',
    maxWidth: 400,
  },
});