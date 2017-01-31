/**
 * Created by Elf on 31.01.2017.
 */
import { Component } from 'react';
import { StyleSheet, Text, View } from 'ui';
import { Picker } from 'react-native';
import _ from 'lodash';

export default class HourPicker extends Component {
  props: {
    hour: number;
    title?: string;
  };

  state: {
    hour: number;
  };

  constructor(props) {
    super(props);

    this.state = {
      hour: props.hour || 0,
    };
  }

  render() {
    const hourRange = _.range(24);
    const { title } = this.props;

    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Picker
          style={styles.picker}
          selectedValue={this.state.hour}
          onValueChange={(hour) => this.setState({ hour })}
        >
          {hourRange.map((item) => {
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
    width: 50,
    padding: 2,
  },

  picker: {
    width: 50,
  },

  title: {
    fontSize: 11,
  },
});