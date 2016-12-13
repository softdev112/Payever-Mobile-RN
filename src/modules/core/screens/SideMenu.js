import { Component } from 'react';
import { StyleSheet, Text, View } from 'ui';

export default class SideMenu extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Side menu</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    width: 300
  },
});