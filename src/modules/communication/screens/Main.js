import { Component } from 'react';
import { images, NavBar, StyleSheet, View } from 'ui';
import { ScreenParams } from 'utils';

import Chat from '../components/chat';
import Contacts from '../components/contacts';
import ContactsScreen from './Contacts';

export default class Main extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  render() {
    if (!ScreenParams.isTabletLayout()) {
      return <ContactsScreen />;
    }

    return (
      <View style={styles.container}>
        <NavBar.Default title="Communication" source={images.communication} />
        <View style={styles.main}>
          <Contacts style={styles.contacts} phoneView={false} />
          <View style={styles.chat}>
            <View style={styles.chat_shadow} />
            <Chat style={styles.chat_component} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chat: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
  },

  chat_component: {
    flex: 1,
    borderLeftColor: '$pe_color_light_gray_1',
    borderLeftWidth: 1,
  },

  chat_shadow: {
    backgroundColor: '#d6d6d6',
    bottom: 0,
    elevation: 5,
    right: 0,
    position: 'absolute',
    shadowColor: 'rgba(0, 0, 0, .1)',
    shadowRadius: 7,
    shadowOffset: {
      width: -3,
      height: 7,
    },
    shadowOpacity: 1,
    top: 0,
    width: 1,
  },

  contacts: {
    width: 350,
    zIndex: 2,
  },

  container: {
    flex: 1,
  },

  main: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row',
  },
});