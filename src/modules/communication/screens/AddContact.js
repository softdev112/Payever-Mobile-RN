import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { FlatTextInput, NavBar, StyleSheet, View } from 'ui';
import AddContactBlock from '../components/contacts/AddContactBlock';

@inject('communication')
@observer
export default class AddContact extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  $messageTextInput: FlatTextInput;

  state: {
    message: string;
  };

  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  onAddContacts() {
    // communication.sendMsgToSelectedContacts(this.state.message);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Add a contact" />
          <NavBar.Button title="Send" onPress={::this.onAddContacts} />
        </NavBar>
        <View style={styles.content}>
          <FlatTextInput
            ref={ref => this.$messageTextInput = ref}
            placeholder="Message"
            onChangeText={text => this.setState({ message: text })}
            value={this.state.message}
          />
          <AddContactBlock
            style={styles.addContactBlock}
            bottomDockStyle={styles.bottomDockStyle}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 15,
  },

  addContactBlock: {
    marginTop: 10,
  },

  bottomDockStyle: {
    $topHeight: '64%',
    top: '$topHeight',
  },
});