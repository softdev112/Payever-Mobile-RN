/* eslint-disable */
import { Component } from 'react';
import { ListView, TouchableOpacity, requireNativeComponent } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { toggleMenu } from '../../../common/Navigation';
import { Icon, NavBar, StyleSheet, Text, View, WebViewEx } from 'ui';
import { Navigator } from 'react-native-navigation';
import injectedCode from './WebView/injectedCode';

import vector from '../../../common/ui/Icon/vector.json';

@inject('userProfiles')
@observer
export default class Debug extends Component {
  static navigatorStyle = { navBarHidden: true };

  props:{
    navigator: Navigator;
  };

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.injectedCode = injectedCode({
      isDev: __DEV__,
      ...props.injectOptions,
    });
  }

  onGoToChat() {
    this.props.navigator.push({
      screen: 'communication.Chat',
    })
  }

  onShowSideMenu() {
    toggleMenu(this.props.navigator);
  }

  showError() {
    this.props.navigator.push({
      screen: 'core.WebView',
      passProps: {
        url: 'http://site-not-exists.ru'
      }
    })
  }

  renderRow(row) {
    return (
      <View style={{flexDirection: 'row'}}>
        <Icon source={row} />
        <Text>{row}</Text>
      </View>
    );
  }

  onLoadStart({ nativeEvent }) {
    console.log(nativeEvent);
  }

  render() {
    const listData = this.ds.cloneWithRows(Object.keys(vector));
    const source = { uri: 'http://ya.ru' };

    return (
      <View style={styles.container}>

        <NavBar style={styles.navBar}>
          <NavBar.Back />
          <NavBar.Title
            source={{
              uri: 'https://mein.payever.de/images/dashboard/communication.png'
            }}
          />
          <NavBar.Menu />
        </NavBar>

        <View style={styles.mainContent}>
          <TouchableOpacity onPress={::this.onGoToChat}>
            <Text>ASDDSDA</Text>
          </TouchableOpacity>
          <ListView
            style={{height: 30}}
            dataSource={listData}
            renderRow={::this.renderRow}
          />
          <WebViewEx
            style={{height: 800}}
            source={source}
            onError={() => {}}
            onLoadStart={::this.onLoadStart}
            onMessage={() => {}}
            javaScriptEnabled
            domStorageEnabled
            injectedJavaScript={this.injectedCode}
            startInLoadingState={false}
            renderError={() => {}}
            bounces={false}
            uploadEnabledAndroid
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },

  row: {
    flexDirection: 'row'
  },

  image: {
    width: 16,
    height: 16,
    shadowColor: 'rgba(0,0,0,.15)',
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    borderRadius: 8,
  },

  navBar: {

  },

  mainContent: {
    flex: 1,
  },
});