import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { NavBar, StyleSheet, View } from 'ui';
import AddContactBlock from '../components/contacts/AddContactBlock';
import ProfilesStore from '../../../store/profiles';

@inject('profiles')
@observer
export default class AddContact extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    profiles?: ProfilesStore;
  };

  render() {
    this.props.profiles.loadAllContacts();
    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Add a contact" />
        </NavBar>
        <AddContactBlock />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});