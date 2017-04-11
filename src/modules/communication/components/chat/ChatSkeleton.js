import { Component } from 'react';
import { ListView, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { StyleSheet } from 'ui';


export default class ChatSkeleton extends Component {
  props: {
    style: Object;
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: ds.cloneWithRows(Array(10).fill('row')),
    };
  }

  renderRow(_, secId, rowId) {
    return (
      <Animatable.View
        key={rowId}
        style={styles.row}
        animation="pulse"
        duration={1000}
        iterationCount="infinite"
      />
    );
  }

  renderSeparator(rowId, index) {
    return <View key={index} style={styles.separator} />;
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
        <ListView
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          enableEmptySections
          renderRow={::this.renderRow}
          renderSeparator={::this.renderSeparator}
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