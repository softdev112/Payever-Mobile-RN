import { Component, PropTypes } from 'react';
import { ScrollView, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

export default class Container extends Component {
  static propTypes = {
    layout: PropTypes.oneOf(['small', 'large']),
    scrollViewStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ])
  };

  static defaultProps = {
    layout: 'large'
  };

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
    maxWidth: 400
  },

  scrollView_large: {

  }
});