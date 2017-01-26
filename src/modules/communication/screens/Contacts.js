import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ListViewDataSource } from 'react-native';
import { GridView, Loader, StyleSheet, Text, View } from 'ui';

import type { Navigator } from 'react-native-navigation';
import type { Config } from '../../../config/index';

@inject('communication', 'config')
@observer
export default class Contacts extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    navigator: Navigator;
    config: Config;
  };

  state: {
    isLoading: false;
  };

  dataSource: ListViewDataSource;

  constructor(props) {
    super(props);

    this.state = {
    };

    this.dataSource = new GridView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
    });

    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 2000);
  }

  render() {
    return (
      <Loader isLoading={this.state.isLoading}>
        <View style={styles.container}>
          <Text>Hello in Contacts</Text>
        </View>
      </Loader>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});