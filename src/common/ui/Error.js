import { Component } from 'react';
import { Text } from 'react-native';
import StyleSheet from './StyleSheet';

export default class Error extends Component {
  static defaultProps = { duration: 0 };

  props: {
    message: ?string;
    style?: Object | number;
    duration?: number; // ms
  };

  constructor(props) {
    super(props);

    this.state = {
      show: true,
    };
  }

  componentDidMount() {
    // Start timer if duration is set
    this.setUpShowTimer();
  }

  componentWillReceiveProps() {
    this.setState({ show: true });
    this.setUpShowTimer();
  }

  componentWillUnmount() {
    if (this.showTimer) clearTimeout(this.showTimer);
  }

  setUpShowTimer() {
    const { duration } = this.props;

    if (duration === 0 || this.showTimer) return;

    this.showTimer = setTimeout(() => {
      this.setState({ show: false });
      this.showTimer = null;
    }, duration);
  }

  render() {
    const { message } = this.props;
    if (!message || !this.state.show) {
      return null;
    }

    return (
      <Text {...this.props} style={[styles.component, this.props.style]}>
        {message}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    padding: 5,
    textAlign: 'center',
    color: 'red',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 4,
  },
});