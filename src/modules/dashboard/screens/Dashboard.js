import { Component } from 'react';
import { View  } from 'react-native';

import AppIcon from '../components/AppIcon';

export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  render() {
    const { navigator } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1}} />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 10
        }}>
          <AppIcon
            navigator={navigator}
            icon="transactions"
            title="Transactions"
            name="transactions"
          />
          <AppIcon
            navigator={navigator}
            icon="products"
            title="Transactions"
            name="items"
          />
          <AppIcon
            navigator={navigator}
            icon="home"
            title="Home"
            name="dashboard"
          />
          <AppIcon
            navigator={navigator}
            icon="communication"
            title="Communication"
            name="conversation"
          />
          <AppIcon
            navigator={navigator}
            icon="stores"
            title="My Stores"
            name="my_stores"
          />
        </View>
      </View>
    );
  }
}