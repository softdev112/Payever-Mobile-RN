/* eslint-disable */

import { Component } from 'react';
import { Image } from 'react-native';

import { Icon, Loader, StyleSheet, Text, View } from 'ui';


const EARLY_LOADING = require('../../../store/UserProfilesStore/images/no-business.png');

export default class Debug extends Component {
  props: {
    navigator: Navigator;
  };

  render() {
    return (
      <View>
        <View style={styles.row}>
          <Icon source="icon-search-16" />
          <Text>icon-search-16 Icon</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={require('../../../store/UserProfilesStore/images/no-business.png')}
            />
          <Text>no-business1</Text>
        </View>
        <View style={styles.row}>
          <Image style={styles.image} source={EARLY_LOADING} />
          <Text>no-business early loading</Text>
        </View>
        <View style={styles.row}>
          <Loader isLoading />
          <Text>Spinner</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },

  image: {
    width: 16,
    height: 16,
  }
});