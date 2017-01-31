/**
 * Created by Elf on 31.01.2017.
 */
import { Component } from 'react';
import { StyleSheet, Text, View } from 'ui';
import { Picker } from 'react-native';
import _ from 'lodash';

export default class MinutePicker extends Component {
  props: {
    minute: number;
    title?: string;
  };

  state: {
    minute: number;
  };

  constructor(props) {
    super(props);

    this.state = {
      minute: props.minute || 0,
    };
  }

  render() {
    const minuteRange = _.range(60);
    const { title } = this.props;

    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Picker
          style={styles.picker}
          selectedValue={this.state.minute}
          onValueChange={(hour) => this.setState({ hour })}
        >
          {minuteRange.map((item) => {
            const label = item > 9 ? `${item}` : `0${item}`;

            return <Picker.Item key={item} label={label} value={item} />;
          })}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    padding: 2,
  },

  picker: {
    width: 40,
  },

  title: {
    fontSize: 11,
  },
});