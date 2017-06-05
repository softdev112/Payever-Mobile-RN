import { Component } from 'react';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { StyleSheet } from 'ui';


export default class ChatSkeleton extends Component {
  props: {
    style: Object;
  };

  renderItem() {
    return (
      <Animatable.View
        style={styles.row}
        animation="pulse"
        duration={1000}
        iterationCount="infinite"
      />
    );
  }

  renderSeparator() {
    return <View style={styles.separator} />;
  }

  render() {
    const { style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Animatable.View
          style={styles.header}
          animation="flash"
          duration={1000}
          iterationCount="infinite"
        />
        <FlatList
          style={styles.list}
          data={Array(10).fill('1')}
          renderItem={::this.renderItem}
          ItemSeparatorComponent={::this.renderSeparator}
          keyExtractor={(item, index) => index}
        />
        <Animatable.View
          style={styles.footer}
          animation="flash"
          duration={1000}
          iterationCount="infinite"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  $backgroundColor: '#34FF3D',

  container: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 28,
    paddingVertical: 10,
  },

  row: {
    height: 50,
    borderColor: '$pe_color_light_gray_1',
    borderWidth: 1,
  },

  separator: {
    height: 16,
  },

  header: {
    height: 80,
    borderColor: '$pe_color_light_gray_1',
    borderWidth: 1,
  },

  footer: {
    height: 50,
    borderColor: '$pe_color_light_gray_1',
    borderWidth: 1,
  },
});