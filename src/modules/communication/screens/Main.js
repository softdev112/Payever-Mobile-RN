import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ListViewDataSource } from 'react-native';
import { NavBar, StyleSheet, View } from 'ui';

import type { Navigator } from 'react-native-navigation';
import type { Config } from '../../../config/index';

import Contacts from '../components/Contacts';

//noinspection JSUnresolvedVariable
import imgCommunication from '../images/communication.png';

@inject('communication', 'config')
@observer
export default class Main extends Component {
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
      <View style={styles.container}>
        <NavBar.Default title="Communication" source={imgCommunication} />
        <Contacts />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});