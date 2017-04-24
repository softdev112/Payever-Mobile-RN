/* eslint-disable react/no-unused-prop-types */
import { Component } from 'react';
import { observer } from 'mobx-react/native';
import { StyleSheet, Text, View } from 'ui';

import OnlineStatus from '../OnlineStatus';

@observer
export default class Status extends Component {
  interval: any;

  props: {
    status: {
      label: string;
      online: boolean;
      typing: boolean;
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      dots: 0,
    };
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  updateTypingText() {
    const dots = this.state.dots;
    this.setState({
      dots: dots > 2 ? 0 : dots + 1,
    });
  }

  render() {
    const { status } = this.props;
    const { dots } = this.state;

    clearInterval(this.interval);
    if (status.typing) {
      this.interval = setInterval(::this.updateTypingText, 300);
    }

    const statusLabel =
      (status.online && status.label === '') ? 'online' : status.label;

    return (
      <View style={styles.container}>
        <OnlineStatus style={styles.led} isOnline={status.online} />
        <Text style={styles.text}>
          {status.typing ? 'typing' + '.'.repeat(dots) : statusLabel}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  led: {
    marginRight: 8,
  },

  text: {
    color: '#959ba3',
    fontSize: 12,
  },
});